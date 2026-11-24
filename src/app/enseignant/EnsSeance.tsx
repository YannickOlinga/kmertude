import { useState, type FormEvent } from 'react'
import AppShell from '../AppShell'
import MissionChat from '../MissionChat'
import { Alert, Bd, Field, Loadable, Msg, type Status } from '../ui'
import {
  SEANCE_STATUT, createCourse, dateFr, declarerSeance, listCourses, listMissions, type Course,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'

const ASSIMILATION = ['Excellent', 'Satisfaisant', 'Partiel', 'Insuffisant']
const ATTITUDE = ['Très attentif', 'Correct', 'Dissipé', 'Fatigué']
const status = (c: Course): Status => (c.status === 'contestee' ? { label: 'Contestée', tone: 'er' } : SEANCE_STATUT[c.status])

// Formulaire post-cours en une colonne. heures_declarees = durée réelle en MINUTES (15–480).
function Declaration({ course, onDone, onCancel }: { course: Course; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ minutes: String(course.duree_minutes), absence: false, notions: '', assimilation: '', attitude: '', blocage: '', exercices: '', parents: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const minutes = Number.parseInt(f.minutes, 10)
    if (!(minutes >= 15 && minutes <= 480)) { setErr('Durée entre 15 et 480 minutes.'); return }
    const notions = f.absence && !f.notions.trim() ? 'Élève absent' : f.notions.trim()
    if (notions.length < 3) { setErr('Notions abordées : 3 caractères minimum.'); return }
    setBusy(true)
    setErr('')
    try {
      await declarerSeance(course.id, {
        heures_declarees: minutes,
        is_absence_eleve: f.absence,
        notions_abordees: notions,
        niveau_assimilation: f.assimilation || null,
        attitude_concentration: f.attitude || null,
        points_blocage: f.blocage.trim() || null,
        exercices_recommandes: f.exercices.trim() || null,
        remarques_parents: f.parents.trim() || null,
      })
      onDone()
    } catch (x) {
      setErr(errorMessage(x))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <h2>Déclarer la séance du {dateFr(course.date_heure_debut, true)}</h2>
      <Field label="Durée réelle (minutes)"><input type="number" min={15} max={480} value={f.minutes} onChange={(e) => set('minutes', e.target.value)} /></Field>
      <label className="ks-check"><input type="checkbox" checked={f.absence} onChange={(e) => set('absence', e.target.checked)} />Absence de l’élève</label>
      <Field label="Notions abordées"><textarea rows={2} value={f.notions} onChange={(e) => set('notions', e.target.value)} placeholder="Min. 3 caractères" /></Field>
      <Field label="Niveau d’assimilation">
        <select value={f.assimilation} onChange={(e) => set('assimilation', e.target.value)}>
          <option value="">Choisir…</option>{ASSIMILATION.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Attitude / concentration">
        <select value={f.attitude} onChange={(e) => set('attitude', e.target.value)}>
          <option value="">Choisir…</option>{ATTITUDE.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Points de blocage"><textarea rows={2} value={f.blocage} onChange={(e) => set('blocage', e.target.value)} /></Field>
      <Field label="Exercices recommandés"><textarea rows={2} value={f.exercices} onChange={(e) => set('exercices', e.target.value)} /></Field>
      <Field label="Message aux parents"><textarea rows={2} value={f.parents} onChange={(e) => set('parents', e.target.value)} /></Field>
      <Msg error={err} />
      <div className="ks-row">
        <button type="button" className="ks-btn" onClick={onCancel}>Annuler</button>
        <button type="submit" className="ks-btn p" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer le compte rendu'}</button>
      </div>
    </form>
  )
}

function Planifier({ missionId, onDone }: { missionId: number; onDone: () => void }) {
  const [date, setDate] = useState('')
  const [heure, setHeure] = useState('16:00')
  const [minutes, setMinutes] = useState('120')
  const [sujet, setSujet] = useState('')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const m = Number.parseInt(minutes, 10)
    const debut = new Date(`${date}T${heure}`)
    if (!date || Number.isNaN(debut.getTime())) { setMsg({ error: 'Date et heure requises.' }); return }
    if (!(m >= 15 && m <= 480)) { setMsg({ error: 'Durée entre 15 et 480 minutes.' }); return }
    setBusy(true)
    setMsg({})
    try {
      await createCourse({
        mission_id: missionId,
        date_heure_debut: debut.toISOString(),
        date_heure_fin: new Date(debut.getTime() + m * 60_000).toISOString(),
        duree_minutes: m,
        sujet: sujet.trim() || null,
      })
      setSujet('')
      setMsg({ ok: 'Séance planifiée.' })
      onDone()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="ks-card soft" noValidate>
      <h3>Planifier une séance</h3>
      <div className="ks-g2">
        <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Heure"><input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} /></Field>
      </div>
      <Field label="Durée prévue (minutes)"><input type="number" min={15} max={480} value={minutes} onChange={(e) => setMinutes(e.target.value)} /></Field>
      <Field label="Sujet (facultatif)"><input value={sujet} onChange={(e) => setSujet(e.target.value)} placeholder="Ex. équations du 2nd degré" /></Field>
      <Msg {...msg} />
      <button type="submit" className="ks-btn p w" disabled={busy}>Planifier</button>
    </form>
  )
}

// 3D — Séances : planification, déclaration post-cours, chat de mission
export default function EnsSeance() {
  const data = useApi(async () => {
    const [missions, courses] = await Promise.all([listMissions(), listCourses()])
    return { missions, courses }
  })
  const [missionId, setMissionId] = useState<number | null>(null)
  const [declaring, setDeclaring] = useState<Course | null>(null)
  const [sent, setSent] = useState(false)
  const [chat, setChat] = useState(false)

  const missions = data.data?.missions ?? []
  const mission = missions.find((m) => m.id === missionId) ?? missions.find((m) => m.status === 'active') ?? missions[0]
  const seances = (data.data?.courses ?? []).filter((c) => c.mission_id === mission?.id)
    .sort((a, b) => b.date_heure_debut.localeCompare(a.date_heure_debut))

  if (declaring) {
    return (
      <AppShell>
        <Declaration course={declaring} onCancel={() => setDeclaring(null)} onDone={() => { setDeclaring(null); setSent(true); void data.reload() }} />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <h1>Mes séances</h1>
      {sent && <Alert tone="ok"><b>Compte rendu envoyé.</b> Le parent a 72 h pour confirmer.</Alert>}
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload} empty={!missions.length} emptyText="Aucune mission active : acceptez une proposition pour commencer.">
        {mission && (
          <>
            {missions.length > 1 && (
              <Field label="Mission">
                <select value={mission.id} onChange={(e) => { setMissionId(Number(e.target.value)); setSent(false) }}>
                  {missions.map((m) => <option key={m.id} value={m.id}>{m.beneficiaire?.prenom ?? m.titre} — {m.matiere}</option>)}
                </select>
              </Field>
            )}
            <div className="ks-card">
              <div className="ks-sp">
                <div>
                  <b>{mission.beneficiaire ? `${mission.beneficiaire.prenom} ${mission.beneficiaire.nom}` : mission.titre}</b> · {mission.matiere}
                  <div className="ks-mu ks-sm">{mission.beneficiaire?.classe_niveau ?? mission.niveau} · {mission.nombre_heures_realisees} h réalisée(s)</div>
                </div>
                <button type="button" className="ks-btn sm" onClick={() => setChat(true)}>Chat de mission</button>
              </div>
            </div>

            {mission.status === 'active' && <Planifier missionId={mission.id} onDone={data.reload} />}

            <h3>Séances</h3>
            {seances.length === 0 && <p className="ks-state">Aucune séance planifiée.</p>}
            {seances.map((c) => (
              <div key={c.id} className="ks-card">
                <div className="ks-sp">
                  <span>{dateFr(c.date_heure_debut, true)} · {Math.round(c.duree_minutes / 6) / 10} h{c.sujet ? ` · ${c.sujet}` : ''}</span>
                  <Bd s={status(c)} />
                </div>
                {c.motif_contestation && <p className="ks-err">Contestation de la famille : {c.motif_contestation}</p>}
                {c.status === 'planifiee' && (
                  c.is_past
                    ? <div className="ks-row"><button type="button" className="ks-btn p" onClick={() => { setDeclaring(c); setSent(false) }}>Déclarer la séance</button></div>
                    : <p className="ks-mu ks-sm">À déclarer après le cours.</p>
                )}
              </div>
            ))}
            {chat && <MissionChat missionId={mission.id} title={mission.beneficiaire?.prenom ?? mission.matiere} onClose={() => setChat(false)} />}
          </>
        )}
      </Loadable>
    </AppShell>
  )
}
