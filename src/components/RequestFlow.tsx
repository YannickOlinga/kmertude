import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { saveSearch } from '../lib/savedSearches'
import {
  CALLBACK_SLOTS, EMPTY_REQUEST, FORMATS, FREQUENCIES, GOALS, LEVELS, PROFILES, SUBJECTS,
  isValidEmail, isValidPhone, saveRequest, type StoredRequest, type TeacherRequest,
} from '../lib/teacherRequests'
import './RequestFlow.css'

const STEPS = ['Profil', 'Lieu', 'Besoin', 'Coordonnées'] as const
const PHONE = '+237 622 244 994'

type Props = {
  initial?: Partial<TeacherRequest>
  // Le profil a déjà été choisi (ex. depuis la home) : on démarre à l'étape suivante
  profileChosen?: boolean
  onCancel?: () => void
}

function firstStep(r: TeacherRequest, profileChosen: boolean) {
  if (!profileChosen) return 0
  if (r.format !== 'en-ligne' && r.city.trim().length < 2) return 1
  return 2
}

export default function RequestFlow({ initial, profileChosen = false, onCancel }: Props) {
  const [data, setData] = useState<TeacherRequest>(() => ({ ...EMPTY_REQUEST, ...initial }))
  const [step, setStep] = useState(() => firstStep({ ...EMPTY_REQUEST, ...initial }, profileChosen || Boolean(initial?.profile)))
  const [done, setDone] = useState<StoredRequest | null>(null)
  const [showErrors, setShowErrors] = useState(false)

  const set = <K extends keyof TeacherRequest>(key: K, value: TeacherRequest[K]) => setData((d) => ({ ...d, [key]: value }))
  const toggleSubject = (s: string) =>
    set('subjects', data.subjects.includes(s) ? data.subjects.filter((x) => x !== s) : [...data.subjects, s])

  const errors: Partial<Record<keyof TeacherRequest, string>> = {}
  if (step === 1 && data.format !== 'en-ligne' && data.city.trim().length < 2) errors.city = 'Indiquez une ville ou un quartier.'
  if (step === 2) {
    if (!data.level) errors.level = 'Choisissez un niveau.'
    if (data.subjects.length === 0) errors.subjects = 'Choisissez au moins une matière.'
    if (!data.goal) errors.goal = 'Choisissez un objectif.'
    if (!data.frequency) errors.frequency = 'Choisissez un rythme.'
  }
  if (step === 3) {
    if (!data.firstName.trim()) errors.firstName = 'Prénom requis.'
    if (!data.lastName.trim()) errors.lastName = 'Nom requis.'
    if (!isValidPhone(data.phone)) errors.phone = 'Numéro camerounais à 9 chiffres (ex. 6 90 00 00 00).'
    if (!isValidEmail(data.email)) errors.email = 'Adresse email invalide.'
    if (!data.consent) errors.consent = 'Votre accord est nécessaire pour être recontacté(e).'
  }
  const err = (key: keyof TeacherRequest) =>
    showErrors && errors[key] ? <p className="rf-error" role="alert">{errors[key]}</p> : null

  const next = (e: FormEvent) => {
    e.preventDefault()
    if (Object.keys(errors).length) { setShowErrors(true); return }
    setShowErrors(false)
    if (step < STEPS.length - 1) { setStep(step + 1); return }
    saveSearch({
      profile: data.profile,
      offerType: data.format === 'stage' ? 'group' : 'individual',
      city: data.city,
      level: data.level,
      subjects: data.subjects,
    })
    setDone(saveRequest(data))
  }

  const back = () => {
    setShowErrors(false)
    if (step === 0) onCancel?.()
    else setStep(step - 1)
  }

  if (done) return <Confirmation request={done} />

  const levels = LEVELS[data.profile]

  return (
    <div className="rf">
      <ol className="rf-stepper" aria-label="Étapes de la demande">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="rf-dot" aria-hidden="true">{i < step ? '✓' : i + 1}</span>
            <span className="rf-step-label">{label}</span>
          </li>
        ))}
      </ol>

      <form className="rf-form" onSubmit={next} noValidate>
        {step === 0 && (
          <fieldset>
            <legend>Vous êtes ?</legend>
            <div className="rf-cards">
              {PROFILES.map((p) => (
                <label key={p.id} className={`rf-card${data.profile === p.id ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="profile"
                    checked={data.profile === p.id}
                    onChange={() => setData((d) => ({ ...d, profile: p.id, level: '' }))}
                  />
                  <strong>{p.title}</strong>
                  <span>{p.subtitle}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <>
            <fieldset>
              <legend>Vérifions la disponibilité de nos enseignants</legend>
              <p className="rf-question">Comment souhaitez-vous suivre les cours ?</p>
              <div className="rf-cards rf-cards-3">
                {FORMATS.map((f) => (
                  <label key={f.id} className={`rf-card${data.format === f.id ? ' selected' : ''}`}>
                    <input type="radio" name="format" checked={data.format === f.id} onChange={() => set('format', f.id)} />
                    <strong>{f.title}</strong>
                    <span>{f.subtitle}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="rf-question" htmlFor="rf-city">
              {data.format === 'en-ligne' ? 'Votre ville (facultatif)' : 'Où vont se dérouler les cours ?'}
            </label>
            <input
              id="rf-city"
              className="rf-input"
              type="text"
              placeholder="Ville ou quartier (ex. Douala, Bonapriso)"
              value={data.city}
              onChange={(e) => set('city', e.target.value)}
              autoComplete="address-level2"
            />
            {err('city')}
          </>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend>Précisons votre besoin</legend>
              <p className="rf-question">{data.profile === 'adulte' ? 'Quel est votre objectif ?' : 'Quelle classe ?'}</p>
              {levels.map((g) => (
                <div key={g.group} className="rf-chip-group">
                  {levels.length > 1 && <span className="rf-chip-title">{g.group}</span>}
                  <div className="rf-chips">
                    {g.options.map((o) => (
                      <button key={o} type="button" aria-pressed={data.level === o} className={data.level === o ? 'selected' : ''} onClick={() => set('level', o)}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              {err('level')}
            </fieldset>

            <fieldset>
              <p className="rf-question">Quelle(s) matière(s) ?</p>
              <div className="rf-chips">
                {SUBJECTS.map((s) => (
                  <button key={s} type="button" aria-pressed={data.subjects.includes(s)} className={data.subjects.includes(s) ? 'selected' : ''} onClick={() => toggleSubject(s)}>{s}</button>
                ))}
              </div>
              {err('subjects')}
            </fieldset>

            <div className="rf-split">
              <fieldset>
                <p className="rf-question">Objectif principal</p>
                <div className="rf-chips">
                  {GOALS.map((g) => (
                    <button key={g} type="button" aria-pressed={data.goal === g} className={data.goal === g ? 'selected' : ''} onClick={() => set('goal', g)}>{g}</button>
                  ))}
                </div>
                {err('goal')}
              </fieldset>
              <fieldset>
                <p className="rf-question">Rythme souhaité</p>
                <div className="rf-chips">
                  {FREQUENCIES.map((f) => (
                    <button key={f} type="button" aria-pressed={data.frequency === f} className={data.frequency === f ? 'selected' : ''} onClick={() => set('frequency', f)}>{f}</button>
                  ))}
                </div>
                {err('frequency')}
              </fieldset>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rf-almost">
              <strong>Vous y étiez presque !</strong>
              <span>Laissez vos coordonnées pour recevoir votre bilan et votre devis personnalisés, gratuitement.</span>
            </div>
            <div className="rf-grid">
              <div>
                <label className="rf-label" htmlFor="rf-first">Prénom</label>
                <input id="rf-first" className="rf-input" value={data.firstName} onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" />
                {err('firstName')}
              </div>
              <div>
                <label className="rf-label" htmlFor="rf-last">Nom</label>
                <input id="rf-last" className="rf-input" value={data.lastName} onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" />
                {err('lastName')}
              </div>
              <div>
                <label className="rf-label" htmlFor="rf-phone">Téléphone</label>
                <input id="rf-phone" className="rf-input" type="tel" placeholder="6 90 00 00 00" value={data.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
                {err('phone')}
              </div>
              <div>
                <label className="rf-label" htmlFor="rf-email">Email</label>
                <input id="rf-email" className="rf-input" type="email" value={data.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                {err('email')}
              </div>
              {data.profile === 'parent' && (
                <div>
                  <label className="rf-label" htmlFor="rf-child">Prénom de votre enfant (facultatif)</label>
                  <input id="rf-child" className="rf-input" value={data.childFirstName} onChange={(e) => set('childFirstName', e.target.value)} />
                </div>
              )}
              <div>
                <label className="rf-label" htmlFor="rf-slot">Quand souhaitez-vous être rappelé(e) ?</label>
                <select id="rf-slot" className="rf-input" value={data.callbackSlot} onChange={(e) => set('callbackSlot', e.target.value)}>
                  {CALLBACK_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <label className="rf-consent">
              <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} />
              <span>J’accepte d’être recontacté(e) par un conseiller pédagogique Kmertude au sujet de ma demande. Mes données ne sont utilisées que pour cette demande.</span>
            </label>
            {err('consent')}
          </>
        )}

        <div className="rf-actions">
          {(step > 0 || onCancel) && (
            <button type="button" className="rf-btn rf-btn-ghost" onClick={back}>
              ← {step === 0 ? 'Annuler' : 'Précédent'}
            </button>
          )}
          <button type="submit" className="rf-btn rf-btn-primary">
            {step === STEPS.length - 1 ? 'Envoyer ma demande' : 'Continuer →'}
          </button>
        </div>
      </form>
    </div>
  )
}

const NEXT_STEPS = [
  { title: 'Un bilan personnalisé', text: 'Gratuit et sans engagement, pour cerner les besoins et les objectifs.' },
  { title: 'Une proposition adaptée', text: 'Votre conseiller vous présente l’accompagnement et le tarif.' },
  { title: 'Votre enseignant sous 72 h', text: 'Nous vous présentons l’enseignant sélectionné pour votre profil.' },
  { title: 'Un suivi régulier', text: 'Des points d’étape pour mesurer les progrès et ajuster les cours.' },
]

function Confirmation({ request }: { request: StoredRequest }) {
  const format = FORMATS.find((f) => f.id === request.format)?.title
  const when = request.callbackSlot === CALLBACK_SLOTS[0] ? 'très rapidement' : `sur le créneau « ${request.callbackSlot} »`
  return (
    <div className="rf rf-done" role="status">
      <div className="rf-done-icon" aria-hidden="true">✓</div>
      <h2>Merci {request.firstName}, votre demande est bien enregistrée !</h2>
      <p className="rf-done-lead">
        Un conseiller pédagogique vous rappelle {when} au <strong>{request.phone}</strong>. Référence : <strong>{request.reference}</strong>
      </p>

      <ul className="rf-summary">
        <li><span>Cours</span>{format}{request.city && ` · ${request.city}`}</li>
        <li><span>Niveau</span>{request.level}</li>
        <li><span>Matières</span>{request.subjects.join(', ')}</li>
        <li><span>Objectif</span>{request.goal} · {request.frequency}</li>
      </ul>

      <h3>Et ensuite ?</h3>
      <ol className="rf-next">
        {NEXT_STEPS.map((s) => (
          <li key={s.title}><strong>{s.title}</strong><span>{s.text}</span></li>
        ))}
      </ol>

      <div className="rf-actions rf-actions-center">
        <Link to="/" className="rf-btn rf-btn-ghost">Retour à l’accueil</Link>
        <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="rf-btn rf-btn-pink">Appeler un conseiller</a>
      </div>
    </div>
  )
}
