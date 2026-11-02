import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileFormModal.css'

export type Profile = 'parent' | 'eleve' | 'etudiant' | 'adulte'

type Props = {
  profile: Profile
  onClose: () => void
}

const TITLES: Record<Profile, string> = {
  parent: 'Trouver le bon accompagnement pour votre enfant',
  eleve: 'Trouver le bon accompagnement pour vos cours',
  etudiant: 'Trouver le bon accompagnement pour vos études',
  adulte: 'Trouver la bonne formation pour vous',
}

const LEVELS: Record<Profile, string[]> = {
  parent: ['Primaire (SIL – CM2)', 'Collège (6e – 3e)', 'Lycée (2nde – Terminale)'],
  eleve: ['Primaire (SIL – CM2)', 'Collège (6e – 3e)', 'Lycée (2nde – Terminale)'],
  etudiant: ['Licence 1', 'Licence 2', 'Licence 3', 'Master', 'Classes préparatoires / Grandes écoles'],
  adulte: ['Remise à niveau', 'Langues', 'Informatique / Bureautique', 'Préparation concours'],
}

const SUBJECTS = ['Mathématiques', 'Physique-Chimie', 'Français', 'Anglais', 'SVT', 'Histoire-Géographie', 'Philosophie', 'Informatique', 'Autre']

const STEPS = ['Profil', 'Besoin', 'Contact'] as const

export default function ProfileFormModal({ profile, onClose }: Props) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [city, setCity] = useState('')
  const [level, setLevel] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [contact, setContact] = useState({ firstName: '', lastName: '', phone: '', email: '' })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  const toggleSubject = (s: string) =>
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const canContinue =
    step === 0 ? city.trim().length > 1
    : step === 1 ? level !== '' && subjects.length > 0
    : contact.firstName.trim() && contact.lastName.trim() && /^\+?[0-9 ]{8,}$/.test(contact.phone) && /\S+@\S+\.\S+/.test(contact.email)

  const next = () => {
    if (!canContinue) return
    if (step < STEPS.length - 1) { setStep(step + 1); return }
    const params = new URLSearchParams({
      role: profile === 'parent' ? 'parent' : 'student',
      profile, city: city.trim(), level, subjects: subjects.join(','),
      firstName: contact.firstName.trim(), lastName: contact.lastName.trim(),
      phone: contact.phone.trim(), email: contact.email.trim(),
    })
    onClose()
    navigate(`/auth?${params.toString()}`)
  }

  return (
    <div className="pfm-backdrop" onClick={onClose} role="presentation">
      <div
        className="pfm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pfm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pfm-close" onClick={onClose} aria-label="Fermer">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>

        <img className="pfm-photo" src="/h.jpg" alt="" loading="lazy" decoding="async" />

        <div className="pfm-content">
          <h2 id="pfm-title">{TITLES[profile]}</h2>
          <p className="pfm-lead">
            Bénéficiez d’un <mark>bilan personnalisé</mark> en remplissant ce formulaire !
          </p>

          <ol className="pfm-stepper" aria-label="Étapes">
            {STEPS.map((label, i) => (
              <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
                <span className="pfm-dot" aria-hidden="true" />
                <span className="pfm-step-label">{label}</span>
              </li>
            ))}
          </ol>

          <form className="pfm-form" onSubmit={(e) => { e.preventDefault(); next() }}>
            {step === 0 && (
              <>
                <h3>Vérifions la disponibilité de nos enseignants</h3>
                <p className="pfm-question">
                  Où vont se dérouler les cours ?
                  <svg className="pfm-arrow" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M4 6c7 0 11 3 12 11m0 0l-3-3m3 3l3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </p>
                <input
                  className="pfm-input"
                  type="text"
                  placeholder="Indiquez la ville ou le quartier"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoFocus
                />
              </>
            )}

            {step === 1 && (
              <>
                <h3>Précisons le besoin</h3>
                <p className="pfm-question">Quel niveau ?</p>
                <div className="pfm-chips" role="radiogroup" aria-label="Niveau">
                  {LEVELS[profile].map((l) => (
                    <button key={l} type="button" role="radio" aria-checked={level === l} className={level === l ? 'selected' : ''} onClick={() => setLevel(l)}>{l}</button>
                  ))}
                </div>
                <p className="pfm-question">Quelle(s) matière(s) ?</p>
                <div className="pfm-chips" role="group" aria-label="Matières">
                  {SUBJECTS.map((s) => (
                    <button key={s} type="button" aria-pressed={subjects.includes(s)} className={subjects.includes(s) ? 'selected' : ''} onClick={() => toggleSubject(s)}>{s}</button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3>Vos coordonnées</h3>
                <p className="pfm-question">Un conseiller pédagogique vous rappelle rapidement.</p>
                <div className="pfm-grid">
                  <input className="pfm-input" type="text" placeholder="Prénom" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} autoComplete="given-name" />
                  <input className="pfm-input" type="text" placeholder="Nom" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} autoComplete="family-name" />
                  <input className="pfm-input" type="tel" placeholder="Téléphone (ex. 6 90 00 00 00)" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} autoComplete="tel" />
                  <input className="pfm-input" type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} autoComplete="email" />
                </div>
              </>
            )}

            <div className="pfm-actions">
              <button
                type="button"
                className="pfm-btn pfm-btn-prev"
                onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M19 12H5m0 0l6-6m-6 6l6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Précédent
              </button>
              <button type="submit" className="pfm-btn pfm-btn-next" disabled={!canContinue}>
                {step === STEPS.length - 1 ? 'Envoyer' : 'Continuer'}
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14m0 0l-6-6m6 6l-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </form>

          <div className="pfm-trust">
            <div className="pfm-trust-row">
              <span className="pfm-trust-brand">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#00b67a" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
                Trustpilot
              </span>
              <span className="pfm-trust-line" aria-hidden="true" />
              <span className="pfm-trust-score">4.5 <small>★</small></span>
            </div>
            <p>4.5/5 sur la base de nos premiers avis</p>
          </div>
        </div>
      </div>
    </div>
  )
}
