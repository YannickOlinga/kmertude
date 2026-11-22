import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail } from '../lib/teacherRequests'
import './NewsletterSection.css'

const LEVELS = ['Primaire', 'Collège', 'Lycée', 'Supérieur', 'Adulte']
const STORAGE_KEY = 'kmertude:newsletter'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [level, setLevel] = useState('')
  const [touched, setTouched] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const emailOk = isValidEmail(email)
  const canSubmit = emailOk && level !== ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit) return
    // Pas encore de backend d'emailing : l'inscription est conservée localement
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list = raw ? (JSON.parse(raw) as { email: string }[]) : []
      const next = [{ email: email.trim(), level, createdAt: Date.now() }, ...list.filter((s) => s.email !== email.trim())]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 20)))
    } catch {
      // stockage indisponible
    }
    setSubscribed(true)
  }

  return (
    <section className="nl-section" aria-labelledby="nl-title">
      <div className="nl-inner">
        <div className="nl-advice">
          <h2>Bénéficiez d’un bilan personnalisé et offert</h2>
          <Link to="/demande" className="nl-advice-btn">Je contacte un conseiller</Link>
          <p className="nl-hand">
            <svg viewBox="0 0 24 40" width="20" height="34" aria-hidden="true">
              <path d="M12 38C10 26 9 14 12 3m0 0L5 10m7-7l6 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Nos conseillers pédagogiques sont à votre écoute
          </p>
        </div>

        <div className="nl-panel">
          <svg className="nl-envelope" viewBox="0 0 170 120" aria-hidden="true">
            <path d="M6 112c18-24 34-40 58-52M24 112c14-16 26-28 44-38" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            <g transform="rotate(-16 120 50)">
              <rect x="82" y="22" width="78" height="52" rx="5" fill="#fff" stroke="#1a1a1a" strokeWidth="3" />
              <path d="M82 26l39 28 39-28" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
              <text x="121" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="#6b46c1">@</text>
            </g>
          </svg>

          <div className="nl-body">
            <h2 id="nl-title">
              Inscrivez-vous à notre <mark>newsletter</mark> et recevez nos conseils pour booster la réussite de votre enfant
            </h2>

            {subscribed ? (
              <div className="nl-success" role="status">
                <strong>Merci, c’est noté !</strong>
                <span>Vous recevrez nos conseils {level === 'Adulte' ? 'pour adultes' : `pour le niveau ${level.toLowerCase()}`} à l’adresse {email.trim()}.</span>
                <button type="button" className="nl-link" onClick={() => { setSubscribed(false); setEmail(''); setLevel(''); setTouched(false) }}>
                  Inscrire une autre adresse
                </button>
              </div>
            ) : (
              <form className="nl-form" onSubmit={submit} noValidate>
                <div className="nl-field">
                  <label htmlFor="nl-email">Email<span aria-hidden="true">*</span></label>
                  <input
                    id="nl-email"
                    type="email"
                    placeholder="email@domaine.cm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={touched && !emailOk}
                    autoComplete="email"
                  />
                </div>
                <div className="nl-field nl-field-level">
                  <label htmlFor="nl-level">Niveau<span aria-hidden="true">*</span></label>
                  <select id="nl-level" value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="">Je sélectionne</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <button type="submit" className="nl-submit" disabled={!canSubmit}>Je m’inscris</button>
                {touched && email && !emailOk && <p className="nl-error" role="alert">Vérifiez votre adresse email.</p>}
              </form>
            )}

            <p className="nl-legal">
              <span aria-hidden="true">*</span> Champs obligatoires<br />
              En soumettant ce formulaire, j’accepte que Kmertude utilise mon email uniquement pour m’envoyer sa newsletter. Désinscription possible à tout moment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
