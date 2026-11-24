import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import MissionChat from '../MissionChat'
import PageHero from '../PageHero'
import { Icon } from '../icons'
import { Bd, Field, Loadable, Modal, Msg, type Status } from '../ui'
import {
  MISSION_STATUS, SEANCE_STATUT, confirmerSeance, contesterSeance, dateFr, fcfa, getPresentationEnseignant, heuresRestantes,
  listCourses, listMissions, type Course,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'

const seanceStatus = (c: Course): Status => {
  if (c.status === 'declaree') {
    const h = heuresRestantes(c.date_expiration_validation)
    return { label: h != null ? `À confirmer · ${h} h restantes` : 'À confirmer', tone: 'wn' }
  }
  if (c.status === 'contestee') return { label: 'Contestée', tone: 'er' }
  return SEANCE_STATUT[c.status]
}
const heuresDe = (c: Course) => Math.round(((c.heures_declarees ?? c.duree_minutes) / 60) * 10) / 10
const jour = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' })
const mois = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
const heure = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

// 2C — Mission, séances & chat
export default function ClientMissions() {
  const data = useApi(async () => {
    const [missions, courses] = await Promise.all([listMissions(), listCourses()])
    const ids = [...new Set(missions.map((m) => m.enseignant_id))]
    const profs = new Map(await Promise.all(ids.map(async (id) => [id, await getPresentationEnseignant(id).catch(() => null)] as const)))
    return { missions, courses, profs }
  })
  const [chat, setChat] = useState<{ id: number; title: string } | null>(null)
  const [contest, setContest] = useState<Course | null>(null)
  const [motif, setMotif] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState<number | null>(null)

  const confirm = async (c: Course) => {
    setBusy(c.id)
    try { await confirmerSeance(c.id); await data.reload() } catch (x) { window.alert(errorMessage(x)) } finally { setBusy(null) }
  }
  const sendContest = async () => {
    if (!contest) return
    if (motif.trim().length < 10) { setErr('Le motif doit contenir au moins 10 caractères.'); return }
    setBusy(contest.id)
    try {
      await contesterSeance(contest.id, motif.trim())
      setContest(null)
      await data.reload()
    } catch (x) {
      setErr(errorMessage(x))
    } finally {
      setBusy(null)
    }
  }

  const missions = data.data?.missions ?? []
  const nbConfirmer = (data.data?.courses ?? []).filter((c) => c.status === 'declaree').length

  return (
    <AppShell>
      <PageHero
        title={missions.length > 1 ? 'Mes missions' : 'Ma mission'}
        text={nbConfirmer > 0
          ? `${nbConfirmer} séance${nbConfirmer > 1 ? 's' : ''} attend${nbConfirmer > 1 ? 'ent' : ''} votre confirmation.`
          : 'Suivez les séances, lisez les comptes rendus et échangez avec l’enseignant.'}
      />

      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {missions.length === 0 && (
          <div className="ks-card cp-empty"> 
            <b>Aucune mission pour le moment</b>
            <p className="ks-mu ks-sm">Elle apparaît dès qu’un enseignant est affecté à votre demande.</p>
            <Link to="/client/demande" className="ks-btn p">Demander un cours</Link>
          </div>
        )}

        {missions.map((m) => {
          const prof = data.data?.profs.get(m.enseignant_id)
          const seances = (data.data?.courses ?? []).filter((c) => c.mission_id === m.id)
            .sort((a, b) => b.date_heure_debut.localeCompare(a.date_heure_debut))
          const eleve = m.beneficiaire?.prenom ?? ''
          const prevues = m.nombre_heures_prevues ?? 0
          const pct = prevues > 0 ? Math.min(100, Math.round((m.nombre_heures_realisees / prevues) * 100)) : 0
          return (
            <section key={m.id} className="cm-mission">
              <div className="ks-card cm-head">
                <div className="cm-id">
                  <span className="cm-av">{(prof?.prenom?.[0] ?? '?').toUpperCase()}</span>
                  <div>
                    <b>{prof?.prenom ?? 'Votre enseignant'}</b>
                    <span className="ks-mu ks-sm">{m.matiere} · {[m.niveau ?? m.beneficiaire?.classe_niveau, eleve].filter(Boolean).join(' · ')}</span>
                  </div>
                  <Bd s={MISSION_STATUS[m.status]} />
                </div>

                <div className="cm-facts">
                  <div><span>Tarif</span><b>{fcfa(m.tarif_horaire)}/h</b></div>
                  <div><span>Depuis le</span><b>{dateFr(m.date_debut)}</b></div>
                  <div>
                    <span>Heures réalisées</span>
                    <b>{m.nombre_heures_realisees} h{prevues > 0 ? ` / ${prevues} h` : ''}</b>
                    {prevues > 0 && <i className="cm-bar"><i style={{ width: `${pct}%` }} /></i>}
                  </div>
                </div>

                <button type="button" className="ks-btn cm-chat" onClick={() => setChat({ id: m.id, title: eleve || m.matiere })}>
                  💬 Écrire à {prof?.prenom ?? 'l’enseignant'}
                </button>
              </div>

              <h2>Séances</h2>
              {seances.length === 0 && <p className="ks-mu ks-sm">Aucune séance planifiée pour l’instant.</p>}
              <div className="cm-list">
                {seances.map((c) => (
                  <article key={c.id} className={`ks-card cm-seance ${c.status === 'declaree' ? 'todo' : ''}`}>
                    <div className="cm-date">
                      <b>{jour(c.date_heure_debut)}</b>
                      <span>{mois(c.date_heure_debut)}</span>
                    </div>
                    <div className="cm-body">
                      <div className="ks-sp">
                        <span><b>{heure(c.date_heure_debut)}</b> · {heuresDe(c)} h{c.sujet ? ` · ${c.sujet}` : ''}</span>
                        <Bd s={seanceStatus(c)} />
                      </div>
                      {c.compte_rendu && (
                        <div className="cm-report">
                          <b>Compte rendu{prof ? ` de ${prof.prenom}` : ''}</b>
                          <p>{c.compte_rendu}</p>
                        </div>
                      )}
                      {c.motif_contestation && <p className="ks-sm cm-contest"><b>Votre contestation :</b> {c.motif_contestation}</p>}
                      {c.status === 'declaree' && (
                        <div className="ks-row">
                          <button type="button" className="ks-btn ok" disabled={busy === c.id} onClick={() => confirm(c)}>
                            <Icon name="check" size={16} /> Confirmer la séance
                          </button>
                          <button type="button" className="ks-btn er" disabled={busy === c.id} onClick={() => { setContest(c); setMotif(''); setErr('') }}>Contester</button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </Loadable>

      {chat && <MissionChat missionId={chat.id} title={chat.title} onClose={() => setChat(null)} />}
      {contest && (
        <Modal title="Contester la séance" onClose={() => setContest(null)}>
          <p className="ks-mu ks-sm">Notre équipe examine chaque contestation et revient vers vous.</p>
          <Field label="Motif (obligatoire, min. 10 caractères)">
            <textarea rows={3} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Expliquez le problème" autoFocus />
          </Field>
          <Msg error={err} />
          <div className="ks-row">
            <button type="button" className="ks-btn" onClick={() => setContest(null)}>Annuler</button>
            <button type="button" className="ks-btn er" disabled={busy === contest.id} onClick={sendContest}>Envoyer la contestation</button>
          </div>
        </Modal>
      )}
    </AppShell>
  )
}
