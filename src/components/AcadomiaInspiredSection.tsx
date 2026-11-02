import { useState } from 'react'
import ProfileFormModal, { type Profile } from './ProfileFormModal'
import './AcadomiaInspiredSection.css'

const PROFILES: { id: Profile; title: string; titleSuffix?: string; subtitle: string }[] = [
  { id: 'parent', title: 'PARENT', subtitle: 'souhaitant des cours pour mon enfant' },
  { id: 'eleve', title: 'ÉLÈVE', subtitle: 'souhaitant des cours' },
  { id: 'etudiant', title: 'ÉTUDIANT', titleSuffix: 'du supérieur', subtitle: 'souhaitant des cours' },
  { id: 'adulte', title: 'ADULTE', subtitle: 'souhaitant des cours ou une formation' },
]

export default function AcadomiaInspiredSection() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)

  const selectProfile = (item: (typeof PROFILES)[number]) => {
    setProfile(item.id)
    setOpen(true)
  }

  return (
    <section className="km-academia-section" aria-labelledby="km-academia-title">
      {open && profile && <ProfileFormModal profile={profile} onClose={() => setOpen(false)} />}
      <img className="km-academia-bg" src="/h.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="km-academia-overlay" aria-hidden="true" />

      <div className="km-academia-inner">
        <h2 id="km-academia-title">
          Remplissez le formulaire pour échanger avec un conseiller pédagogique
        </h2>

        <div className="km-academia-card" role="radiogroup" aria-label="Sélectionnez votre profil">
          <p className="km-academia-card-title">Sélectionnez votre profil</p>
          {PROFILES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={profile === item.id}
              className={`km-academia-option${profile === item.id ? ' selected' : ''}`}
              onClick={() => selectProfile(item)}
            >
              <span className="km-academia-radio" aria-hidden="true" />
              <span className="km-academia-option-text">
                <strong>
                  {item.title}
                  {item.titleSuffix && <span className="km-academia-suffix"> {item.titleSuffix}</span>}
                </strong>
                <span>{item.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <a className="km-academia-chevron" href="#km-offres" aria-label="Voir la suite">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <aside className="km-academia-reviews" aria-label="Les avis de nos familles">
        <h3>Les avis de nos familles</h3>
        <div className="km-academia-trust">
          <span className="km-academia-trust-star" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#00b67a" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
          </span>
          Trustpilot
        </div>
        <div className="km-academia-rating">
          <div className="km-academia-stars" aria-label="Note 4,5 sur 5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="km-academia-star full">
                <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#fff" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
              </span>
            ))}
            <span className="km-academia-star half">
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#fff" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
            </span>
          </div>
          <a href="#avis" className="km-academia-reviews-link">Lire les avis</a>
        </div>
        <p className="km-academia-reviews-note">Note moyenne 4,5/5 | 0 avis</p>
      </aside>
    </section>
  )
}
