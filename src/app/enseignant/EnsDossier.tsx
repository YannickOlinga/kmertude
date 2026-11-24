import { useRef, useState, type FormEvent } from 'react'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Icon, type IconName } from '../icons'
import { Bd, Field, Loadable, Msg, Seg } from '../ui'
import { AdresseFields } from '../fields'
import { EMPTY_ADRESSE, type Adresse } from '../referentiels'
import { useEnseignant } from './useEnseignant'
import {
  DOCUMENT_LABEL, addZone, deleteDocument, deleteZone, downloadDocument, getCoordonnees, listMesDocuments, listZones,
  saveCoordonnees, uploadDocument, type DocumentEnseignant, type DocumentType,
} from '../../lib/backend'
import { ACCEPTED_FILES, fileError, isCanonicalPhone, normalizePhone } from '../../lib/teacherApplications'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'
import './ens.css'

type Tab = 'z' | 'm' | 'd'

function Zones({ enseignantId }: { enseignantId: number | undefined }) {
  const zones = useApi(() => (enseignantId ? listZones(enseignantId) : Promise.resolve([])), [enseignantId])
  const [adresse, setAdresse] = useState<Adresse>(EMPTY_ADRESSE)
  const [rayon, setRayon] = useState('10')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const add = async (e: FormEvent) => {
    e.preventDefault()
    if (!enseignantId) { setMsg({ error: 'Enregistrez d’abord votre numéro Mobile Money (onglet Mobile Money) pour activer votre profil.' }); return }
    if (!adresse.ville.trim()) { setMsg({ error: 'Choisissez au moins la ville.' }); return }
    setBusy(true)
    setMsg({})
    try {
      await addZone(enseignantId, {
        ville: adresse.ville.trim(),
        commune_arrondissement: adresse.arrondissement.trim() || null,
        quartier: adresse.quartier.trim() || null,
        rayon_km: Math.min(100, Math.max(1, Number.parseInt(rayon, 10) || 10)),
      })
      setAdresse(EMPTY_ADRESSE)
      setMsg({ ok: 'Zone ajoutée.' })
      await zones.reload()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
    }
  }
  const remove = async (id: number) => {
    if (!window.confirm('Supprimer cette zone ?')) return
    try { await deleteZone(id); await zones.reload() } catch (x) { window.alert(errorMessage(x)) }
  }

  return (
    <>
      <Loadable loading={zones.loading} error={zones.error} onRetry={zones.reload}>
        {zones.data?.length === 0 && <p className="ks-mu ks-sm">Aucune zone : ajoutez les quartiers où vous pouvez vous déplacer.</p>}
        <div className="ed-zones">
          {zones.data?.map((z) => (
            <div key={z.id} className="ed-zone">
              <span className="ed-zone-pin" aria-hidden="true">📍</span>
              <span className="ed-zone-txt">
                <b>{z.quartier || z.commune_arrondissement || z.ville}</b>
                <small>{[z.quartier && z.commune_arrondissement, z.ville].filter(Boolean).join(' · ')} · rayon {z.rayon_km ?? '—'} km</small>
              </span>
              <button type="button" className="ed-x" onClick={() => remove(z.id)} aria-label="Supprimer la zone" title="Supprimer">×</button>
            </div>
          ))}
        </div>
      </Loadable>
      <form onSubmit={add} noValidate className="ed-sub">
        <h3>Ajouter une zone</h3>
        <AdresseFields value={adresse} onChange={setAdresse} repere={false} />
        <Field label="Rayon (km)"><input type="number" min={1} max={100} value={rayon} onChange={(e) => setRayon(e.target.value)} /></Field>
        <Msg {...msg} />
        <button type="submit" className="ks-btn p w" disabled={busy}>＋ Ajouter la zone</button>
      </form>
    </>
  )
}

function MobileMoney({ onSaved }: { onSaved: () => void }) {
  const coord = useApi(() => getCoordonnees().catch(() => null))
  if (coord.loading) return <p className="ks-state">Chargement…</p>
  return <MobileMoneyForm key={coord.data?.numero_mobile_money ?? 'new'} initial={coord.data} onSaved={async () => { await coord.reload(); onSaved() }} />
}

function MobileMoneyForm({ initial, onSaved }: { initial: Awaited<ReturnType<typeof getCoordonnees>> | null; onSaved: () => void }) {
  const [op, setOp] = useState<'mtn_momo' | 'orange_money'>(initial?.operateur ?? 'mtn_momo')
  const [num, setNum] = useState(initial?.numero_mobile_money ?? '')
  const [nom, setNom] = useState(initial?.nom_titulaire_compte ?? '')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!isCanonicalPhone(num)) { setMsg({ error: 'Numéro camerounais à 9 chiffres commençant par 6.' }); return }
    if (nom.trim().length < 2) { setMsg({ error: 'Nom du titulaire requis.' }); return }
    setBusy(true)
    setMsg({})
    try {
      await saveCoordonnees({ operateur: op, numero_mobile_money: normalizePhone(num), nom_titulaire_compte: nom.trim() })
      setMsg({ ok: 'Coordonnées enregistrées.' })
      onSaved()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} noValidate>
      <p className="ks-mu ks-sm">Vos rémunérations sont versées sur ce numéro. Le nom du titulaire doit correspondre à votre identité.</p>
      {initial && <p className="ks-sm">{initial.est_verifie ? <Bd s={{ label: 'Numéro vérifié', tone: 'ok' }} /> : <Bd s={{ label: 'Vérification en attente', tone: 'wn' }} />}</p>}
      <Seg value={op} onChange={setOp} options={[['mtn_momo', 'MTN MoMo'], ['orange_money', 'Orange Money']]} />
      <Field label="Numéro"><input type="tel" value={num} onChange={(e) => setNum(e.target.value)} placeholder="+237 6XX XX XX XX" /></Field>
      <Field label="Nom du titulaire du compte SIM"><input value={nom} onChange={(e) => setNom(e.target.value)} /></Field>
      <Msg {...msg} />
      <button type="submit" className="ks-btn p w" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
    </form>
  )
}

const DOC_STATUS = {
  valide: { label: 'Validé 🔒', tone: 'ok' },
  refuse: { label: 'Refusé', tone: 'er' },
  en_attente: { label: 'En attente', tone: 'wn' },
} as const

function Documents() {
  const docs = useApi(listMesDocuments)
  const [type, setType] = useState<DocumentType>('cni')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const replacing = useRef<DocumentEnseignant | null>(null)

  const pick = (t: DocumentType, replace: DocumentEnseignant | null = null) => {
    setType(t)
    replacing.current = replace
    input.current?.click()
  }
  const upload = async (file: File | undefined) => {
    if (!file) return
    const fe = fileError(file)
    if (fe) { setMsg({ error: fe }); return }
    setBusy(true)
    setMsg({})
    try {
      await uploadDocument(type, file)
      // Remplacement d'un document refusé : l'ancien (non validé) est supprimé
      if (replacing.current) await deleteDocument(replacing.current.id).catch(() => null)
      setMsg({ ok: 'Document envoyé : il sera vérifié par notre équipe.' })
      await docs.reload()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
      replacing.current = null
      if (input.current) input.current.value = ''
    }
  }
  const open = async (d: DocumentEnseignant) => {
    try {
      const url = URL.createObjectURL(await downloadDocument(d.id))
      const a = document.createElement('a')
      a.href = url
      a.download = d.nom_fichier_original
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch (x) { window.alert(errorMessage(x)) }
  }
  const remove = async (d: DocumentEnseignant) => {
    if (!window.confirm(`Supprimer « ${d.nom_fichier_original} » ?`)) return
    try { await deleteDocument(d.id); await docs.reload() } catch (x) { window.alert(errorMessage(x)) }
  }

  return (
    <>
      <input ref={input} type="file" accept={ACCEPTED_FILES} hidden onChange={(e) => upload(e.target.files?.[0])} />
      <Loadable loading={docs.loading} error={docs.error} onRetry={docs.reload}>
        {docs.data?.map((d) => (
          <div key={d.id} className={`ed-doc ${d.statut}`}>
            <div className="ed-doc-top">
              <span className="ed-doc-ico" aria-hidden="true">📄</span>
              <span className="ed-doc-txt">
                <b>{DOCUMENT_LABEL[d.type_document]}</b>
                <small>{d.nom_fichier_original}</small>
              </span>
              <Bd s={DOC_STATUS[d.statut]} />
            </div>
            {d.statut === 'refuse' && d.motif_rejet && <p className="ks-err">Motif : {d.motif_rejet}</p>}
            <div className="ks-row">
              <button type="button" className="ks-btn sm" onClick={() => open(d)}>Télécharger</button>
              {d.statut === 'refuse' && <button type="button" className="ks-btn sm p" disabled={busy} onClick={() => pick(d.type_document, d)}>Remplacer le fichier</button>}
              {d.statut === 'en_attente' && <button type="button" className="ks-btn sm er" onClick={() => remove(d)}>Supprimer</button>}
            </div>
          </div>
        ))}
      </Loadable>
      <div className="ed-sub">
      <h3>Ajouter un document</h3>
      <Field label="Type de document">
        <select value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
          {(Object.keys(DOCUMENT_LABEL) as DocumentType[]).map((t) => <option key={t} value={t}>{DOCUMENT_LABEL[t]}</option>)}
        </select>
      </Field>
      <Msg {...msg} />
      <button type="button" className="ks-btn w" disabled={busy} onClick={() => pick(type)}>{busy ? 'Envoi…' : '＋ Téléverser un document'}</button>
      <p className="ks-mu ks-sm ks-c">PDF, JPG ou PNG · 10 Mo max</p>
      </div>
    </>
  )
}

const TABS: [Tab, string, IconName, string][] = [
  ['z', 'Mes zones', 'home', 'Où pouvez-vous donner des cours ?'],
  ['m', 'Mobile Money', 'wallet', 'Où recevoir vos rémunérations ?'],
  ['d', 'Documents', 'folder', 'Pièce d’identité et diplômes'],
]

// 3B — Mon dossier : zones, Mobile Money, documents
export default function EnsDossier() {
  const ens = useEnseignant()
  const [tab, setTab] = useState<Tab>('z')
  return (
    <AppShell>
      <PageHero eyebrow="Espace enseignant" title="Mon dossier"
        text="Un dossier complet est vérifié plus vite et vous permet de recevoir des missions près de chez vous." />
      <div className="sp-tabs" role="tablist">
        {TABS.map(([id, label, icon, hint]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            <span className="sp-tab-ico"><Icon name={icon} /></span>
            <span><b>{label}</b><small>{hint}</small></span>
          </button>
        ))}
      </div>
      <section className="ks-card ed-panel">
        {tab === 'z' && <Zones enseignantId={ens.data?.id} />}
        {tab === 'm' && <MobileMoney onSaved={ens.reload} />}
        {tab === 'd' && <Documents />}
      </section>
    </AppShell>
  )
}
