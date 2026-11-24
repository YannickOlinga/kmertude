import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Icon, type IconName } from '../icons'
import { Bd, Field, Loadable, Modal, Msg } from '../ui'
import {
  DOCUMENT_LABEL, downloadDocument, fcfa, getSupervision, listDocumentsEnseignant, listEnseignants, setDocumentStatut,
  validerEnseignant, type DocumentEnseignant, type Enseignant,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'
import './admin.css'

const DOC = { valide: { label: 'Validé', tone: 'ok' }, refuse: { label: 'Refusé', tone: 'er' }, en_attente: { label: 'À vérifier', tone: 'wn' } } as const

// Revue d'un dossier enseignant : documents (valider / refuser) puis certification du profil
function DossierReview({ ens, onClose, onDone }: { ens: Enseignant; onClose: () => void; onDone: () => void }) {
  const docs = useApi(() => listDocumentsEnseignant(ens.id), [ens.id])
  const [motif, setMotif] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const docAction = async (d: DocumentEnseignant, statut: 'valide' | 'refuse') => {
    let m: string | undefined
    if (statut === 'refuse') {
      m = window.prompt('Motif du refus (visible par l’enseignant) :')?.trim()
      if (!m) return
    }
    try { await setDocumentStatut(d.id, statut, m); await docs.reload() } catch (x) { window.alert(errorMessage(x)) }
  }
  const open = async (d: DocumentEnseignant) => {
    try { window.open(URL.createObjectURL(await downloadDocument(d.id)), '_blank') } catch (x) { window.alert(errorMessage(x)) }
  }
  const decide = async (statut: 'valide' | 'refuse') => {
    if (statut === 'refuse' && motif.trim().length < 3) { setErr('Indiquez le motif du refus.'); return }
    setBusy(true)
    setErr('')
    try { await validerEnseignant(ens.id, statut, motif.trim()); onDone() } catch (x) { setErr(errorMessage(x)) } finally { setBusy(false) }
  }

  return (
    <Modal title={`Dossier de ${ens.user.full_name}`} onClose={onClose}>
      <dl className="ad-facts">
        <div><dt>Email</dt><dd>{ens.user.email}</dd></div>
        <div><dt>Téléphone</dt><dd>{ens.user.phone ?? '—'}</dd></div>
        <div><dt>Spécialités</dt><dd>{ens.specialites ?? '—'}</dd></div>
        <div><dt>Niveau d’études</dt><dd>{ens.niveau_etudes ?? '—'}</dd></div>
        <div className="full"><dt>Tarif souhaité</dt><dd>{fcfa(ens.tarif_horaire)}/h</dd></div>
      </dl>
      <h3 className="ad-sub">Documents</h3>
      <Loadable loading={docs.loading} error={docs.error} empty={!docs.data?.length} emptyText="Aucun document téléversé.">
        <div className="ad-docs">
          {docs.data?.map((d) => (
            <div key={d.id} className="ad-doc">
              <span className="ad-doc-ico" aria-hidden="true">📄</span>
              <span className="ad-doc-txt"><b>{DOCUMENT_LABEL[d.type_document]}</b><Bd s={DOC[d.statut]} /></span>
              <span className="ad-doc-act">
                <button type="button" className="ks-btn sm" onClick={() => open(d)}>Ouvrir</button>
                {d.statut !== 'valide' && <button type="button" className="ks-btn sm ok" onClick={() => docAction(d, 'valide')}>Valider</button>}
                {d.statut !== 'refuse' && <button type="button" className="ks-btn sm er" onClick={() => docAction(d, 'refuse')}>Refuser</button>}
              </span>
            </div>
          ))}
        </div>
      </Loadable>
      <Field label="Motif (obligatoire en cas de refus)"><input value={motif} onChange={(e) => setMotif(e.target.value)} /></Field>
      <Msg error={err} />
      <div className="ks-row">
        <button type="button" className="ks-btn er" disabled={busy} onClick={() => decide('refuse')}>Refuser le profil</button>
        <button type="button" className="ks-btn ok" disabled={busy} onClick={() => decide('valide')}>Certifier le profil</button>
      </div>
    </Modal>
  )
}

type Kpi = { label: string; value: number; money?: boolean; icon: IconName; to?: string; alert?: boolean }

function KpiCard({ k }: { k: Kpi }) {
  const n = new Intl.NumberFormat('fr-FR').format(k.value).replace(/[\u00a0\u202f]/g, ' ')
  const body = (
    <>
      <span className="ad-kpi-ico"><Icon name={k.icon} /></span>
      <span className="ad-kpi-label">{k.label}</span>
      <p className="ad-kpi-value"><b>{n}</b>{k.money && <span>FCFA</span>}</p>
      {k.to && <span className="ad-kpi-go" aria-hidden="true">→</span>}
    </>
  )
  const cls = `ad-kpi ${k.alert ? 'alert' : ''}`
  if (!k.to) return <div className={cls}>{body}</div>
  return k.to.startsWith('#') ? <a href={k.to} className={cls}>{body}</a> : <Link to={k.to} className={cls}>{body}</Link>
}

const initiales = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?'

// 4A — Cockpit : 8 KPIs en FCFA entiers + file des profs à valider
export default function AdminCockpit() {
  const kpi = useApi(getSupervision)
  const profs = useApi(async () => (await listEnseignants()).filter((e) => e.statut_validation === 'en_attente'))
  const [review, setReview] = useState<Enseignant | null>(null)

  const k = kpi.data
  const activite: Kpi[] = k ? [
    { label: 'Demandes en attente', value: k.demandes_en_attente, icon: 'list', to: '/admin/demandes', alert: k.demandes_en_attente > 0 },
    { label: 'Profs à valider', value: k.enseignants_en_attente_validation, icon: 'user', to: '#profs', alert: k.enseignants_en_attente_validation > 0 },
    { label: 'Missions actives', value: k.missions_actives, icon: 'book' },
  ] : []
  const finance: Kpi[] = k ? [
    { label: 'CA facturé', value: k.chiffre_affaires_facture_fcfa, money: true, icon: 'receipt' },
    { label: 'Encaissements MoMo / OM', value: k.encaissements_recus_fcfa, money: true, icon: 'wallet', to: '/admin/finance' },
    { label: 'Encours clients', value: k.encours_clients_total_fcfa, money: true, icon: 'chart', to: '/admin/finance' },
    { label: 'Bordereaux profs payés', value: k.bordereaux_enseignants_payes_fcfa, money: true, icon: 'check' },
    { label: 'Bordereaux profs en attente', value: k.bordereaux_enseignants_en_attente_fcfa, money: true, icon: 'calendar', to: '/admin/finance', alert: k.bordereaux_enseignants_en_attente_fcfa > 0 },
  ] : []
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <AppShell>
      <PageHero eyebrow="Back-office" title="Cockpit" text={`Vue d’ensemble de l’activité · ${today}`} />

      <Loadable loading={kpi.loading} error={kpi.error} onRetry={kpi.reload}>
        <h2 className="ad-h">Activité</h2>
        <div className="ad-kpis ad-kpis-3">{activite.map((x) => <KpiCard key={x.label} k={x} />)}</div>
        <h2 className="ad-h">Finance</h2>
        <div className="ad-kpis">{finance.map((x) => <KpiCard key={x.label} k={x} />)}</div>
      </Loadable>

      <div className="ch-head" id="profs">
        <h2>Profs à valider</h2>
        {(profs.data?.length ?? 0) > 0 && <span className="ks-bd wn">{profs.data!.length} en attente</span>}
      </div>
      <Loadable loading={profs.loading} error={profs.error} onRetry={profs.reload}>
        {profs.data?.length === 0 ? (
          <div className="ks-card cp-empty"> 
            <b>Aucun dossier en attente</b>
            <p className="ks-mu ks-sm">Les nouveaux enseignants inscrits apparaîtront ici.</p>
          </div>
        ) : (
          <div className="ad-profs">
            {profs.data?.map((e) => (
              <article key={e.id} className="ad-prof">
                <div className="ad-prof-top">
                  <span className="ch-av" style={{ background: 'var(--ks-ac)' }}>{initiales(e.user.full_name)}</span>
                  <span className="ad-prof-id">
                    <b>{e.user.full_name}</b>
                    <small>{e.user.phone ?? e.user.email}</small>
                  </span>
                </div>
                <div className="ch-tags">
                  {(e.specialites ?? '').split(/[,;]/).map((x) => x.trim()).filter(Boolean).slice(0, 3).map((x) => <span key={x}>{x}</span>)}
                </div>
                <div className="ad-prof-meta">
                  <span>{e.niveau_etudes ?? 'Niveau non précisé'}</span>
                  <b>{fcfa(e.tarif_horaire)}/h</b>
                </div>
                <button type="button" className="ks-btn p w" onClick={() => setReview(e)}>Examiner le dossier</button>
              </article>
            ))}
          </div>
        )}
      </Loadable>

      {review && <DossierReview ens={review} onClose={() => setReview(null)} onDone={() => { setReview(null); void profs.reload(); void kpi.reload() }} />}
    </AppShell>
  )
}
