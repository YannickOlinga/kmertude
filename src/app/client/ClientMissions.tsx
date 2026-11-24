import { useState } from 'react'
import AppShell from '../AppShell'
import MissionChat from '../MissionChat'
import { Bd, Field, Loadable, Modal, Msg, type Status } from '../ui'
import {
  MISSION_STATUS, SEANCE_STATUT, confirmerSeance, contesterSeance, dateFr, fcfa, getPresentationEnseignant, heuresRestantes,
  listCourses, listMissions, type Course,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'

const seanceStatus = (c: Course): Status => {
  if (c.status === 'declaree') {
    const h = heuresRestantes(c.date_expiration_validation)
    return { label: h != null ? `À confirmer — ${h} h restantes` : 'À confirmer', tone: 'wn' }
  }
  if (c.status === 'contestee') return { label: 'Contestée', tone: 'er' }
  return SEANCE_STATUT[c.status]
}
const duree = (c: Course) => `${Math.round(((c.heures_declarees ?? c.duree_minutes) / 60) * 10) / 10} h`

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

  return (
    <AppShell>
      <h1>{missions.length > 1 ? 'Mes missions' : 'Ma mission'}</h1>
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload} empty={!missions.length}
        emptyText="Aucune mission pour le moment : elle apparaît dès qu’un enseignant est affecté à votre demande.">
        {missions.map((m) => {
          const prof = data.data?.profs.get(m.enseignant_id)
          const seances = (data.data?.courses ?? []).filter((c) => c.mission_id === m.id)
            .sort((a, b) => b.date_heure_debut.localeCompare(a.date_heure_debut))
          const eleve = m.beneficiaire?.prenom ?? ''
          return (
            <section key={m.id} style={{ marginBottom: 20 }}>
              <div className="ks-card">
                <div className="ks-sp">
                  <div>
                    <b>{prof?.prenom ?? 'Votre enseignant'}</b> · {m.matiere}
                    <div className="ks-mu ks-sm">{[m.niveau ?? m.beneficiaire?.classe_niveau, eleve].filter(Boolean).join(' · ')}</div>
                  </div>
                  <Bd s={MISSION_STATUS[m.status]} />
                </div>
                <div className="ks-sp" style={{ marginTop: 8 }}>
                  <b>{fcfa(m.tarif_horaire)}/h</b>
                  <button type="button" className="ks-btn sm" onClick={() => setChat({ id: m.id, title: eleve || m.matiere })}>Ouvrir le chat de mission</button>
                </div>
              </div>

              <h3>Séances</h3>
              {seances.length === 0 && <p className="ks-state">Aucune séance planifiée pour l’instant.</p>}
              {seances.map((c) => (
                <div key={c.id} className="ks-card">
                  <div className="ks-sp">
                    <span>{dateFr(c.date_heure_debut, true)} · {duree(c)}</span>
                    <Bd s={seanceStatus(c)} />
                  </div>
                  {c.compte_rendu && (
                    <div className="ks-card soft" style={{ marginTop: 8, marginBottom: 0 }}>
                      <b>Compte rendu{prof ? ` de ${prof.prenom}` : ''}</b>
                      <p className="ks-sm" style={{ whiteSpace: 'pre-line' }}>{c.compte_rendu}</p>
                    </div>
                  )}
                  {c.motif_contestation && <p className="ks-sm"><b>Votre contestation :</b> {c.motif_contestation}</p>}
                  {c.status === 'declaree' && (
                    <div className="ks-row">
                      <button type="button" className="ks-btn ok" disabled={busy === c.id} onClick={() => confirm(c)}>Confirmer la séance</button>
                      <button type="button" className="ks-btn er" disabled={busy === c.id} onClick={() => { setContest(c); setMotif(''); setErr('') }}>Contester</button>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )
        })}
      </Loadable>

      {chat && <MissionChat missionId={chat.id} title={chat.title} onClose={() => setChat(null)} />}
      {contest && (
        <Modal title="Contester la séance" onClose={() => setContest(null)}>
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
