import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import { Alert, Bd, Field, Loadable, Modal, Msg, type Status } from '../ui'
import { useEnseignant } from './useEnseignant'
import {
  MODALITE_LABEL, PROPOSITION_STATUT, fcfa, heuresRestantes, listMesPropositions, repondreProposition, type Proposition,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'

const status = (p: Proposition): Status => {
  if (p.statut === 'en_attente') {
    const h = heuresRestantes(p.date_expiration)
    return { label: h != null ? `Expire dans ${h} h` : 'En attente', tone: 'wn' }
  }
  if (p.statut === 'option_posee') return { label: 'Acceptée — confirmation en cours', tone: 'wn' }
  return PROPOSITION_STATUT[p.statut]
}

// 3C — Propositions reçues (données anonymisées jusqu'à l'affectation)
export default function EnsPropositions() {
  const ens = useEnseignant()
  const props = useApi(listMesPropositions)
  const [busy, setBusy] = useState<number | null>(null)
  const [refus, setRefus] = useState<Proposition | null>(null)
  const [motif, setMotif] = useState('')
  const [err, setErr] = useState('')

  const certifie = ens.data?.statut_validation === 'valide'

  const accept = async (p: Proposition) => {
    setBusy(p.id)
    try { await repondreProposition(p.id, 'accepter'); await props.reload() } catch (x) { window.alert(errorMessage(x)) } finally { setBusy(null) }
  }
  const refuse = async () => {
    if (!refus) return
    setBusy(refus.id)
    setErr('')
    try { await repondreProposition(refus.id, 'refuser', motif.trim()); setRefus(null); await props.reload() } catch (x) { setErr(errorMessage(x)) } finally { setBusy(null) }
  }

  const list = props.data ?? []
  const actives = list.filter((p) => ['en_attente', 'option_posee', 'acceptee'].includes(p.statut))
  const autres = list.filter((p) => !actives.includes(p))

  return (
    <AppShell>
      <h1>Propositions reçues</h1>
      {ens.data && !certifie && <Alert tone="wn">Votre profil doit être certifié pour accepter une mission. <Link to="/enseignant">Voir mon statut</Link></Alert>}
      <Loadable loading={props.loading} error={props.error} onRetry={props.reload} empty={!list.length} emptyText="Aucune proposition pour le moment.">
        {actives.map((p) => (
          <div key={p.id} className="ks-card">
            <div className="ks-sp"><b>{p.demande.matiere}</b><Bd s={status(p)} /></div>
            <p className="ks-sm">
              Niveau : {p.demande.classe_niveau}{p.demande.serie ? ` ${p.demande.serie}` : ''}<br />
              Élève : {p.demande.prenom_eleve}<br />
              Lieu : {p.demande.modalite === 'en_ligne' ? 'En ligne' : `${p.demande.localisation_quartier}, ${p.demande.localisation_ville}`} · {MODALITE_LABEL[p.demande.modalite]}<br />
              Volume : {p.demande.heures_semaine_souhaitees} h/semaine{p.demande.rythme ? ` · ${p.demande.rythme}` : ''}
              {p.demande.disponibilites && <><br />Disponibilités : {p.demande.disponibilites}</>}
              {p.demande.objectifs && <><br />Objectifs : {p.demande.objectifs}</>}
            </p>
            {p.message_admin && <p className="ks-sm ks-mu">Message du conseiller : {p.message_admin}</p>}
            <div className="ks-big">{fcfa(p.tarif_horaire_propose)}/h</div>

            {p.statut === 'acceptee' ? (
              <Alert tone="ok"><b>Mission active.</b> Les coordonnées et le chat sont dans <Link to="/enseignant/seance">Séance</Link>.</Alert>
            ) : (
              <div className="ks-lock">🔒 Nom de famille, téléphone et point de repère masqués jusqu’à la confirmation de l’affectation.</div>
            )}
            {p.statut === 'option_posee' && <p className="ks-sm ks-mu">Votre accord est enregistré : l’équipe confirme l’affectation officielle avec la famille.</p>}
            {p.statut === 'en_attente' && (
              <div className="ks-row">
                <button type="button" className="ks-btn ok" disabled={!certifie || busy === p.id} onClick={() => accept(p)}>Accepter la mission</button>
                <button type="button" className="ks-btn er" disabled={busy === p.id} onClick={() => { setRefus(p); setMotif(''); setErr('') }}>Refuser</button>
              </div>
            )}
          </div>
        ))}
        {autres.length > 0 && (
          <>
            <h2>Historique</h2>
            {autres.map((p) => (
              <div key={p.id} className="ks-card ks-sp">
                <span>{p.demande.matiere} · {p.demande.classe_niveau} · {p.demande.localisation_ville}</span>
                <Bd s={status(p)} />
              </div>
            ))}
          </>
        )}
      </Loadable>

      {refus && (
        <Modal title="Refuser la proposition" onClose={() => setRefus(null)}>
          <Field label="Motif (facultatif)">
            <textarea rows={2} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Éloignement, horaires incompatibles…" />
          </Field>
          <Msg error={err} />
          <div className="ks-row">
            <button type="button" className="ks-btn" onClick={() => setRefus(null)}>Annuler</button>
            <button type="button" className="ks-btn er" disabled={busy === refus.id} onClick={refuse}>Refuser</button>
          </div>
        </Modal>
      )}
    </AppShell>
  )
}
