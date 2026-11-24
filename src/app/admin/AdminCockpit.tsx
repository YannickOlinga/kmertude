import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import { Bd, Field, Loadable, Modal, Msg } from '../ui'
import {
  DOCUMENT_LABEL, downloadDocument, fcfa, getSupervision, listDocumentsEnseignant, listEnseignants, setDocumentStatut,
  validerEnseignant, type DocumentEnseignant, type Enseignant,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'

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
      <p className="ks-sm">
        {ens.user.email} · {ens.user.phone ?? '—'}<br />
        {ens.specialites ?? '—'}<br />
        {ens.niveau_etudes ?? '—'} · souhaite {fcfa(ens.tarif_horaire)}/h
      </p>
      <h3>Documents</h3>
      <Loadable loading={docs.loading} error={docs.error} empty={!docs.data?.length} emptyText="Aucun document téléversé.">
        {docs.data?.map((d) => (
          <div key={d.id} className="ks-card">
            <div className="ks-sp"><b>{DOCUMENT_LABEL[d.type_document]}</b><Bd s={DOC[d.statut]} /></div>
            <div className="ks-row">
              <button type="button" className="ks-btn sm" onClick={() => open(d)}>Ouvrir</button>
              {d.statut !== 'valide' && <button type="button" className="ks-btn sm ok" onClick={() => docAction(d, 'valide')}>Valider</button>}
              {d.statut !== 'refuse' && <button type="button" className="ks-btn sm er" onClick={() => docAction(d, 'refuse')}>Refuser</button>}
            </div>
          </div>
        ))}
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

// 4A — Cockpit : 8 KPIs en FCFA entiers + file des profs à valider
export default function AdminCockpit() {
  const kpi = useApi(getSupervision)
  const profs = useApi(async () => (await listEnseignants()).filter((e) => e.statut_validation === 'en_attente'))
  const [review, setReview] = useState<Enseignant | null>(null)

  const k = kpi.data
  const cards: [string, string, string?][] = k ? [
    ['Demandes en attente', String(k.demandes_en_attente), '/admin/demandes'],
    ['Profs à valider', String(k.enseignants_en_attente_validation), '#profs'],
    ['Missions actives', String(k.missions_actives)],
    ['CA facturé', fcfa(k.chiffre_affaires_facture_fcfa)],
    ['Encaissements MoMo/OM', fcfa(k.encaissements_recus_fcfa), '/admin/finance'],
    ['Encours clients', fcfa(k.encours_clients_total_fcfa), '/admin/finance'],
    ['Bordereaux profs payés', fcfa(k.bordereaux_enseignants_payes_fcfa)],
    ['Bordereaux profs en attente', fcfa(k.bordereaux_enseignants_en_attente_fcfa), '/admin/finance'],
  ] : []

  return (
    <AppShell>
      <h1>Cockpit</h1>
      <Loadable loading={kpi.loading} error={kpi.error} onRetry={kpi.reload}>
        <div className="ks-g4">
          {cards.map(([label, value, to]) => {
            const body = <><div className="ks-mu ks-sm">{label}</div><div className="ks-big">{value}</div></>
            if (!to) return <div key={label} className="ks-card">{body}</div>
            return to.startsWith('#')
              ? <a key={label} href={to} className="ks-card" style={{ color: 'inherit', textDecoration: 'none' }}>{body}</a>
              : <Link key={label} to={to} className="ks-card" style={{ color: 'inherit', textDecoration: 'none' }}>{body}</Link>
          })}
        </div>
      </Loadable>

      <h2 id="profs">Profs à valider</h2>
      <Loadable loading={profs.loading} error={profs.error} onRetry={profs.reload} empty={!profs.data?.length} emptyText="Aucun dossier en attente.">
        <div className="ks-scroll">
          <table className="ks-table">
            <thead><tr><th>Enseignant</th><th>Spécialités</th><th>Niveau</th><th>Tarif souhaité</th><th /></tr></thead>
            <tbody>
              {profs.data?.map((e) => (
                <tr key={e.id}>
                  <td>{e.user.full_name}<div className="ks-mu ks-sm">{e.user.phone}</div></td>
                  <td>{e.specialites ?? '—'}</td>
                  <td>{e.niveau_etudes ?? '—'}</td>
                  <td>{fcfa(e.tarif_horaire)}</td>
                  <td><button type="button" className="ks-btn sm p" onClick={() => setReview(e)}>Examiner</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Loadable>

      {review && <DossierReview ens={review} onClose={() => setReview(null)} onDone={() => { setReview(null); void profs.reload(); void kpi.reload() }} />}
    </AppShell>
  )
}
