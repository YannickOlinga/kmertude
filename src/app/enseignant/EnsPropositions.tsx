import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Icon } from '../icons'
import { Bd, Field, Loadable, Modal, Msg, type Status } from '../ui'
import { useEnseignant } from './useEnseignant'
import {
  MODALITE_LABEL, PROPOSITION_STATUT, fcfa, heuresRestantes, listMesPropositions, repondreProposition, type Proposition,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'
import './ens.css'

const status = (p: Proposition): Status => {
  if (p.statut === 'en_attente') {
    const h = heuresRestantes(p.date_expiration)
    return { label: h != null ? `Expire dans ${h} h` : 'En attente', tone: 'wn' }
  }
  if (p.statut === 'option_posee') return { label: 'Acceptée · confirmation en cours', tone: 'wn' }
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
  const nbAttente = list.filter((p) => p.statut === 'en_attente').length

  return (
    <AppShell>
      <PageHero eyebrow="Espace enseignant" title="Propositions reçues"
        text={nbAttente > 0
          ? `${nbAttente} proposition${nbAttente > 1 ? 's' : ''} attend${nbAttente > 1 ? 'ent' : ''} votre réponse. Elles sont valables 48 h.`
          : 'Les missions que notre équipe vous propose, selon vos matières et vos zones.'} />

      {ens.data && !certifie && (
        <div className="cp-block-banner">
          <div>
            <b>Profil pas encore certifié</b>
            <p>Vous pourrez accepter une mission dès que votre dossier sera validé.</p>
          </div>
          <Link to="/enseignant/dossier" className="ks-btn">Voir mon dossier</Link>
        </div>
      )}

      <Loadable loading={props.loading} error={props.error} onRetry={props.reload}>
        {list.length === 0 && (
          <div className="ks-card cp-empty">
             <b>Aucune proposition pour le moment</b>
            <p className="ks-mu ks-sm">Complétez vos zones et vos matières pour recevoir des missions proches de chez vous.</p>
          </div>
        )}

        <div className="ep-list">
          {actives.map((p) => (
            <article key={p.id} className={`ks-card ep-card ${p.statut === 'en_attente' ? 'new' : ''}`}>
              <div className="ks-sp">
                <div>
                  <h2 className="ep-title">{p.demande.matiere}</h2>
                  <span className="ks-mu ks-sm">{p.demande.classe_niveau}{p.demande.serie ? ` · Série ${p.demande.serie}` : ''}</span>
                </div>
                <Bd s={status(p)} />
              </div>

              <div className="ep-price">
                <b>{fcfa(p.tarif_horaire_propose)}</b><span>/ heure</span>
              </div>

              <dl className="ep-facts">
                <div><dt>Élève</dt><dd>{p.demande.prenom_eleve}</dd></div>
                <div><dt>Lieu</dt><dd>{p.demande.modalite === 'en_ligne' ? 'En ligne' : `${p.demande.localisation_quartier}, ${p.demande.localisation_ville}`}</dd></div>
                <div><dt>Format</dt><dd>{MODALITE_LABEL[p.demande.modalite]}</dd></div>
                <div><dt>Volume</dt><dd>{p.demande.heures_semaine_souhaitees} h / semaine{p.demande.rythme ? ` · ${p.demande.rythme}` : ''}</dd></div>
                {p.demande.disponibilites && <div className="full"><dt>Disponibilités</dt><dd>{p.demande.disponibilites}</dd></div>}
                {p.demande.objectifs && <div className="full"><dt>Objectifs</dt><dd>{p.demande.objectifs}</dd></div>}
              </dl>

              {p.message_admin && <div className="cm-report"><b>Message du conseiller</b><p>{p.message_admin}</p></div>}

              {p.statut === 'acceptee' ? (
                <div className="ep-note ok"><b>Mission active.</b> Retrouvez les séances et le chat dans <Link to="/enseignant/seance">Séance</Link>.</div>
              ) : (
                <div className="ep-note lock">🔒 Nom de famille, téléphone et point de repère restent masqués jusqu’à la confirmation de l’affectation.</div>
              )}
              {p.statut === 'option_posee' && <p className="ks-sm ks-mu">Votre accord est enregistré : l’équipe confirme l’affectation avec la famille.</p>}
              {p.statut === 'en_attente' && (
                <div className="ks-row">
                  <button type="button" className="ks-btn ok ep-btn" disabled={!certifie || busy === p.id} onClick={() => accept(p)}>
                    <Icon name="check" size={16} /> Accepter la mission
                  </button>
                  <button type="button" className="ks-btn er" disabled={busy === p.id} onClick={() => { setRefus(p); setMotif(''); setErr('') }}>Refuser</button>
                </div>
              )}
            </article>
          ))}
        </div>

        {autres.length > 0 && (
          <>
            <h2>Historique</h2>
            <div className="ks-card cf-list">
              {autres.map((p) => (
                <div key={p.id} className="cf-row ep-hist">
                  <div className="cf-month">
                    <b>{p.demande.matiere}</b>
                    <span>{p.demande.classe_niveau} · {p.demande.localisation_ville}</span>
                  </div>
                  <span className="ks-sm">{fcfa(p.tarif_horaire_propose)}/h</span>
                  <Bd s={status(p)} />
                </div>
              ))}
            </div>
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
