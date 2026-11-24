import { useState } from 'react'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Bd, Field, Loadable, Msg } from '../ui'
import {
  DEMANDE_STATUT, MODALITE_LABEL, PROPOSITION_STATUT, confirmerAffectation, createProposition, dateFr, fcfa, getBeneficiaire,
  getFamille, getProposition, listDemandes, listEnseignants, listZones, updateDemande, type DemandeAdmin, type Zone,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'
import './admin.css'

// L'API n'expose pas la liste des propositions d'une demande : on garde les ids émis depuis cet écran.
const SENT_KEY = 'kmertude:admin:propositions'
const readSent = (): Record<number, number[]> => { try { return JSON.parse(localStorage.getItem(SENT_KEY) ?? '{}') } catch { return {} } }
const addSent = (demande: number, prop: number) => {
  const all = readSent()
  all[demande] = [...new Set([...(all[demande] ?? []), prop])]
  try { localStorage.setItem(SENT_KEY, JSON.stringify(all)) } catch { /* ignore */ }
}

const norm = (s: string | null | undefined) => (s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

function Qualification({ demande, onSaved }: { demande: DemandeAdmin; onSaved: () => void }) {
  const ctx = useApi(async () => {
    const [famille, benef] = await Promise.all([
      getFamille(demande.famille_id).catch(() => null),
      getBeneficiaire(demande.beneficiaire_id).catch(() => null),
    ])
    return { famille, benef }
  }, [demande.id])
  const [tarif, setTarif] = useState(demande.tarif_horaire_client ? String(demande.tarif_horaire_client) : '')
  const [notes, setNotes] = useState(demande.notes_administratives ?? '')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const save = async () => {
    const t = Number.parseInt(tarif.replace(/\D/g, ''), 10)
    if (!t) { setMsg({ error: 'Fixez le tarif client (FCFA/h).' }); return }
    setBusy(true)
    setMsg({})
    try {
      await updateDemande(demande.id, {
        tarif_horaire_client: t,
        notes_administratives: notes.trim() || null,
        ...(demande.statut === 'soumise' ? { statut: 'en_cours_traitement' as const } : {}),
      })
      setMsg({ ok: 'Qualification enregistrée.' })
      onSaved()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
    }
  }

  const fam = ctx.data?.famille?.user
  const b = ctx.data?.benef
  const lieu = [demande.localisation_quartier, demande.commune_arrondissement, demande.localisation_ville].filter(Boolean).join(', ')
  return (
    <section className="ks-card ad-panel">
      <div className="ad-panel-head">
        <span className="ad-step">1</span>
        <div>
          <h2>Qualification</h2>
          <span className="ks-mu ks-sm">Demande D-{demande.id} · soumise le {dateFr(demande.date_soumission, true)}</span>
        </div>
        <Bd s={DEMANDE_STATUT[demande.statut]} />
      </div>

      <dl className="ad-facts">
        <div><dt>Famille</dt><dd>{fam ? fam.full_name : '…'}<small>{fam?.phone ?? fam?.email}</small></dd></div>
        <div><dt>Élève</dt><dd>{b ? `${b.prenom} ${b.nom}` : '…'}<small>{b ? `${b.classe_niveau}${b.serie ? ` · ${b.serie}` : ''}` : ''}</small></dd></div>
        <div><dt>Cours</dt><dd>{demande.matiere}<small>{MODALITE_LABEL[demande.modalite]} · {demande.heures_semaine_souhaitees} h/sem{demande.rythme ? ` · ${demande.rythme}` : ''}</small></dd></div>
        <div><dt>Lieu</dt><dd>{lieu || '—'}{demande.localisation_point_repere && <small>{demande.localisation_point_repere}</small>}</dd></div>
        {demande.disponibilites && <div className="full"><dt>Disponibilités</dt><dd>{demande.disponibilites}</dd></div>}
        {demande.objectifs && <div className="full"><dt>Objectifs</dt><dd>{demande.objectifs}</dd></div>}
        {b?.besoins_specifiques && <div className="full"><dt>Besoins spécifiques</dt><dd>{b.besoins_specifiques}</dd></div>}
      </dl>

      <div className="ad-tarif">
        <Field label="Tarif client (FCFA/h)"><input inputMode="numeric" value={tarif} onChange={(e) => setTarif(e.target.value)} placeholder="5 000" /></Field>
        <Field label="Notes administratives"><textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Résumé de l’appel, contraintes…" /></Field>
      </div>
      <Msg {...msg} />
      <button type="button" className="ks-btn p w" disabled={busy} onClick={save}>{busy ? 'Enregistrement…' : 'Enregistrer la qualification'}</button>
    </section>
  )
}

function Propositions({ demande, onChange }: { demande: DemandeAdmin; onChange: () => void }) {
  const [filtreMatiere, setFiltreMatiere] = useState(true)
  const [filtreQuartier, setFiltreQuartier] = useState(true)
  const profs = useApi(async () => {
    const list = await listEnseignants({ verified_only: true })
    const valides = list.filter((e) => e.statut_validation === 'valide')
    const zones = new Map<number, Zone[]>(await Promise.all(valides.map(async (e) => [e.id, await listZones(e.id).catch(() => [])] as const)))
    return { valides, zones }
  })
  const [tarifs, setTarifs] = useState<Record<number, string>>({})
  const [sentIds, setSentIds] = useState<number[]>(() => readSent()[demande.id] ?? [])
  const sent = useApi(() => Promise.all(sentIds.map((id) => getProposition(id).catch(() => null))), [sentIds.join(',')])
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState<number | null>(null)

  const client = demande.tarif_horaire_client
  const list = (profs.data?.valides ?? []).filter((e) => {
    if (filtreMatiere && !norm(e.specialites).includes(norm(demande.matiere))) return false
    if (filtreQuartier && demande.modalite !== 'en_ligne') {
      // Même ville, et même quartier ou rayon d'intervention d'au moins 5 km
      const zs = profs.data?.zones.get(e.id) ?? []
      return zs.some((z) => z.actif && norm(z.ville) === norm(demande.localisation_ville)
        && (!z.quartier || norm(z.quartier) === norm(demande.localisation_quartier) || (z.rayon_km ?? 0) >= 5))
    }
    return true
  }).sort((a, b) => b.note_sur_5 - a.note_sur_5)

  const send = async (enseignantId: number, defaut: number | null) => {
    const t = Number.parseInt((tarifs[enseignantId] ?? String(defaut ?? '')).replace(/\D/g, ''), 10)
    if (!client) { setMsg({ error: 'Enregistrez d’abord le tarif client (qualification).' }); return }
    if (!t) { setMsg({ error: 'Indiquez le tarif proposé à l’enseignant.' }); return }
    setBusy(enseignantId)
    setMsg({})
    try {
      const p = await createProposition({ demande_cours_id: demande.id, enseignant_id: enseignantId, tarif_horaire_propose: t, duree_validite_heures: 48 })
      addSent(demande.id, p.id)
      setSentIds(readSent()[demande.id] ?? [])
      setMsg({ ok: 'Proposition envoyée — expire dans 48 h.' })
      onChange()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(null)
    }
  }
  const affecter = async (id: number) => {
    if (!window.confirm('Confirmer l’affectation officielle ? La mission sera créée et les coordonnées dévoilées.')) return
    try { await confirmerAffectation(id); await sent.reload(); onChange() } catch (x) { window.alert(errorMessage(x)) }
  }

  const byProf = new Map((sent.data ?? []).filter(Boolean).map((p) => [p!.enseignant_id, p!]))
  const name = (id: number) => profs.data?.valides.find((e) => e.id === id)?.user.full_name ?? `Enseignant #${id}`

  const envoyees = (sent.data ?? []).filter(Boolean)
  return (
    <section className="ks-card ad-panel">
      <div className="ad-panel-head">
        <span className="ad-step">2</span>
        <div>
          <h2>Proposer un enseignant</h2>
          <span className="ks-mu ks-sm">{client ? `Tarif client : ${fcfa(client)}/h` : 'Fixez d’abord le tarif client'}</span>
        </div>
      </div>

      <div className="ad-filters">
        <span className="ks-mu ks-sm">Filtres :</span>
        {demande.modalite !== 'en_ligne' && (
          <button type="button" aria-pressed={filtreQuartier} className={filtreQuartier ? 'on' : ''} onClick={() => setFiltreQuartier(!filtreQuartier)}>📍 {demande.localisation_quartier}</button>
        )}
        <button type="button" aria-pressed={filtreMatiere} className={filtreMatiere ? 'on' : ''} onClick={() => setFiltreMatiere(!filtreMatiere)}>📘 {demande.matiere}</button>
      </div>
      <Msg {...msg} />

      {envoyees.length > 0 && (
        <div className="ad-sent">
          <h3>Propositions envoyées</h3>
          {envoyees.map((p) => (
            <div key={p!.id} className="ad-sent-row">
              <span><b>{name(p!.enseignant_id)}</b><small>{fcfa(p!.tarif_horaire_propose)}/h</small></span>
              <Bd s={p!.statut === 'option_posee' ? { label: 'Accord du prof', tone: 'ok' } : PROPOSITION_STATUT[p!.statut]} />
              {p!.statut === 'option_posee' && <button type="button" className="ks-btn sm ok" onClick={() => affecter(p!.id)}>Confirmer l’affectation</button>}
            </div>
          ))}
        </div>
      )}

      <Loadable loading={profs.loading} error={profs.error} onRetry={profs.reload} empty={!list.length} emptyText="Aucun enseignant validé ne correspond à ces filtres.">
        {list.map((e) => {
          const t = Number.parseInt((tarifs[e.id] ?? String(e.tarif_horaire ?? '')).replace(/\D/g, ''), 10) || 0
          const deja = byProf.get(e.id)
          const marge = client ? client - t : null
          const zones = (profs.data?.zones.get(e.id) ?? []).map((z) => z.quartier ?? z.ville).join(', ')
          return (
            <article key={e.id} className="ad-cand">
              <div className="ad-cand-top">
                <span className="ad-cand-av">{(e.user.first_name?.[0] ?? '?').toUpperCase()}</span>
                <span className="ad-cand-id">
                  <b>{e.user.first_name} {e.user.last_name?.[0] ?? ''}.</b>
                  <small>{e.specialites} · {zones || 'zones non renseignées'}</small>
                </span>
                <span className="ad-rating">★ {e.note_sur_5.toFixed(1)} <small>({e.nombre_avis})</small></span>
              </div>
              <div className="ad-cand-deal">
                <label>
                  <span>Tarif prof (FCFA/h)</span>
                  <input className="ks-input" inputMode="numeric" value={tarifs[e.id] ?? String(e.tarif_horaire ?? '')}
                    onChange={(x) => setTarifs({ ...tarifs, [e.id]: x.target.value })} />
                </label>
                <div className={`ad-marge ${marge == null ? '' : marge > 0 ? 'ok' : 'er'}`}>
                  <span>Marge / h</span>
                  <b>{marge == null ? '—' : fcfa(marge)}</b>
                </div>
                {deja && ['en_attente', 'option_posee', 'acceptee'].includes(deja.statut)
                  ? <Bd s={{ label: deja.statut === 'en_attente' ? 'Envoyée · 48 h' : PROPOSITION_STATUT[deja.statut].label, tone: 'ok' }} />
                  : <button type="button" className="ks-btn sm p" disabled={busy === e.id || !client} onClick={() => send(e.id, e.tarif_horaire)}>Proposer</button>}
              </div>
            </article>
          )
        })}
      </Loadable>
    </section>
  )
}

const A_TRAITER: string[] = ['soumise', 'en_cours_traitement', 'proposee']

// 4B — Qualification & proposition
export default function AdminDemandes() {
  const [statut, setStatut] = useState<'a_traiter' | 'affectee' | 'toutes'>('a_traiter')
  const demandes = useApi(async () => (await listDemandes()) as DemandeAdmin[])
  const [selected, setSelected] = useState<number | null>(null)

  const list = (demandes.data ?? []).filter((d) =>
    statut === 'toutes' ? true : statut === 'affectee' ? d.statut === 'affectee' : A_TRAITER.includes(d.statut))
    .sort((a, b) => a.date_soumission.localeCompare(b.date_soumission))
  const demande = list.find((d) => d.id === selected) ?? list[0]

  const all = demandes.data ?? []
  const count = (k: typeof statut) => all.filter((d) => k === 'toutes' ? true : k === 'affectee' ? d.statut === 'affectee' : A_TRAITER.includes(d.statut)).length

  return (
    <AppShell>
      <PageHero eyebrow="Back-office" title="Demandes" text="Qualifiez chaque demande, fixez le tarif client, puis proposez un enseignant validé." />
      <div className="ad-seg" role="tablist">
        {([['a_traiter', 'À traiter'], ['affectee', 'Affectées'], ['toutes', 'Toutes']] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={statut === k} className={statut === k ? 'on' : ''} onClick={() => setStatut(k)}>
            {l} <span>{demandes.data ? count(k) : '…'}</span>
          </button>
        ))}
      </div>
      <Loadable loading={demandes.loading} error={demandes.error} onRetry={demandes.reload}>
        {list.length === 0 ? (
          <div className="ks-card cp-empty">
            <span className="cp-empty-ico">📭</span>
            <b>Aucune demande dans cette catégorie</b>
            <p className="ks-mu ks-sm">Les nouvelles demandes des familles arrivent ici.</p>
          </div>
        ) : (
          <div className="ad-md">
            <nav className="ad-list" aria-label="Demandes">
              {list.map((d) => (
                <button key={d.id} type="button" className={`ad-item ${d.id === demande?.id ? 'on' : ''}`} onClick={() => setSelected(d.id)}>
                  <span className="ks-sp">
                    <b>{d.matiere} · {d.niveau}</b>
                    <Bd s={DEMANDE_STATUT[d.statut]} />
                  </span>
                  <small>📍 {d.localisation_quartier}, {d.localisation_ville}</small>
                  <small className="ks-sp">
                    <span>D-{d.id} · {dateFr(d.date_soumission)}</span>
                    <span>{d.tarif_horaire_client ? `${fcfa(d.tarif_horaire_client)}/h` : 'Tarif à fixer'}</span>
                  </small>
                </button>
              ))}
            </nav>
            {demande && (
              <div className="ad-detail">
                <Qualification key={`q${demande.id}`} demande={demande} onSaved={demandes.reload} />
                <Propositions key={`p${demande.id}`} demande={demande} onChange={demandes.reload} />
              </div>
            )}
          </div>
        )}
      </Loadable>
    </AppShell>
  )
}
