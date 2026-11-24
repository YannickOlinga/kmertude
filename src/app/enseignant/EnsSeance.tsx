import { useState, type FormEvent } from 'react'
import AppShell from '../AppShell'
import MissionChat from '../MissionChat'
import PageHero from '../PageHero'
import { Icon } from '../icons'
import { Bd, Field, Loadable, Msg, type Status } from '../ui'
import {
  MISSION_STATUS, SEANCE_STATUT, createCourse, dateFr, declarerSeance, fcfa, listCourses, listMissions, type Course,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'
import './ens.css'

const ASSIMILATION = ['Excellent', 'Satisfaisant', 'Partiel', 'Insuffisant']
const ATTITUDE = ['Très attentif', 'Correct', 'Dissipé', 'Fatigué']
const jour = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' })
const mois = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
const heureDe = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

// Choix en pastilles (assimilation, attitude)
function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="es-chips">
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={value === o} className={value === o ? 'on' : ''} onClick={() => onChange(value === o ? '' : o)}>{o}</button>
      ))}
    </div>
  )
}

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
    <form onSubmit={submit} noValidate className="ks-card ch-form es-decl">
      <button type="button" className="ch-back" onClick={onCancel}>← Retour aux séances</button>
      <h1>Compte rendu de séance</h1>
      <p className="ks-mu ks-sm ch-form-lead">Séance du {dateFr(course.date_heure_debut, true)}. Le parent le lit avant de confirmer la séance.</p>
      <Field label="Durée réelle (minutes)"><input type="number" min={15} max={480} value={f.minutes} onChange={(e) => set('minutes', e.target.value)} /></Field>
      <label className="ks-check"><input type="checkbox" checked={f.absence} onChange={(e) => set('absence', e.target.checked)} />Absence de l’élève</label>
      <Field label="Notions abordées"><textarea rows={2} value={f.notions} onChange={(e) => set('notions', e.target.value)} placeholder="Min. 3 caractères" /></Field>
      <div className="ks-f">Niveau d’assimilation</div>
      <Chips options={ASSIMILATION} value={f.assimilation} onChange={(v) => set('assimilation', v)} />
      <div className="ks-f">Attitude / concentration</div>
      <Chips options={ATTITUDE} value={f.attitude} onChange={(v) => set('attitude', v)} />
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
    <form onSubmit={submit} className="ks-card es-plan" noValidate>
      <h2><Icon name="calendar" /> Planifier une séance</h2>
      <div className="ks-g2">
        <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Heure"><input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} /></Field>
      </div>
      <div className="ks-g2">
        <Field label="Durée prévue (minutes)"><input type="number" min={15} max={480} step={15} value={minutes} onChange={(e) => setMinutes(e.target.value)} /></Field>
        <Field label="Sujet (facultatif)"><input value={sujet} onChange={(e) => setSujet(e.target.value)} placeholder="Ex. équations du 2nd degré" /></Field>
      </div>
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

  const aDeclarer = seances.filter((c) => c.status === 'planifiee' && c.is_past).length

  return (
    <AppShell>
      <PageHero eyebrow="Espace enseignant" title="Mes séances"
        text={aDeclarer > 0
          ? `${aDeclarer} séance${aDeclarer > 1 ? 's' : ''} à déclarer : envoyez le compte rendu pour être rémunéré.`
          : 'Planifiez vos cours, déclarez-les après chaque séance et échangez avec la famille.'} />
      {sent && (
        <div className="ch-todo es-sent" role="status">
          <span className="ch-todo-ico"><Icon name="check" /></span>
          <span><b>Compte rendu envoyé</b><small>La famille a 72 h pour confirmer la séance.</small></span>
        </div>
      )}
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {missions.length === 0 && (
          <div className="ks-card cp-empty">
             <b>Aucune mission active</b>
            <p className="ks-mu ks-sm">Acceptez une proposition pour commencer vos cours.</p>
          </div>
        )}
        {mission && (
          <>
            {missions.length > 1 && (
              <div className="es-missions" role="tablist" aria-label="Missions">
                {missions.map((m) => (
                  <button key={m.id} type="button" role="tab" aria-selected={m.id === mission.id} className={m.id === mission.id ? 'on' : ''}
                    onClick={() => { setMissionId(m.id); setSent(false) }}>
                    <b>{m.beneficiaire?.prenom ?? m.titre}</b>
                    <span>{m.matiere}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="ks-card cm-head">
              <div className="cm-id">
                <span className="cm-av">{(mission.beneficiaire?.prenom?.[0] ?? '?').toUpperCase()}</span>
                <div>
                  <b>{mission.beneficiaire ? `${mission.beneficiaire.prenom} ${mission.beneficiaire.nom}` : mission.titre}</b>
                  <span className="ks-mu ks-sm">{mission.matiere} · {mission.beneficiaire?.classe_niveau ?? mission.niveau}</span>
                </div>
                <Bd s={MISSION_STATUS[mission.status]} />
              </div>
              <div className="cm-facts">
                <div><span>Depuis le</span><b>{dateFr(mission.date_debut)}</b></div>
                <div><span>Heures réalisées</span><b>{mission.nombre_heures_realisees} h</b></div>
                <div><span>Votre tarif</span><b>{mission.tarif_horaire_enseignant ? `${fcfa(mission.tarif_horaire_enseignant)}/h` : '—'}</b></div>
              </div>
              <button type="button" className="ks-btn cm-chat" onClick={() => setChat(true)}>💬 Écrire à la famille</button>
            </div>

            {mission.status === 'active' && <Planifier missionId={mission.id} onDone={data.reload} />}

            <h2>Séances</h2>
            {seances.length === 0 && <p className="ks-mu ks-sm">Aucune séance planifiée.</p>}
            <div className="cm-list">
              {seances.map((c) => {
                const todo = c.status === 'planifiee' && c.is_past
                return (
                  <article key={c.id} className={`ks-card cm-seance ${todo ? 'todo' : ''}`}>
                    <div className="cm-date"><b>{jour(c.date_heure_debut)}</b><span>{mois(c.date_heure_debut)}</span></div>
                    <div className="cm-body">
                      <div className="ks-sp">
                        <span><b>{heureDe(c.date_heure_debut)}</b> · {Math.round(c.duree_minutes / 6) / 10} h{c.sujet ? ` · ${c.sujet}` : ''}</span>
                        <Bd s={todo ? { label: 'À déclarer', tone: 'wn' } : status(c)} />
                      </div>
                      {c.motif_contestation && <p className="ks-sm cm-contest"><b>Contestation de la famille :</b> {c.motif_contestation}</p>}
                      {c.status === 'planifiee' && (
                        todo
                          ? <div className="ks-row"><button type="button" className="ks-btn p" onClick={() => { setDeclaring(c); setSent(false) }}>Déclarer la séance</button></div>
                          : <p className="ks-mu ks-sm" style={{ marginBottom: 0 }}>À déclarer après le cours.</p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
            {chat && <MissionChat missionId={mission.id} title={mission.beneficiaire?.prenom ?? mission.matiere} onClose={() => setChat(false)} />}
          </>
        )}
      </Loadable>
    </AppShell>
  )
}
