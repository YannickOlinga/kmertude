import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AcadomiaInspiredSection.css'

type OfferType = 'individual' | 'group'

export default function AcadomiaInspiredSection() {
  const [offerType, setOfferType] = useState<OfferType>('individual')
  const [city, setCity] = useState('')
  const [level, setLevel] = useState('')
  const navigate = useNavigate()

  const startSearch = () => {
    const params = new URLSearchParams({ role: 'parent' })
    if (city.trim()) params.set('city', city.trim())
    if (level) params.set('level', level)
    params.set('offer', offerType)
    navigate(`/auth?${params.toString()}`)
  }

  return (
    <section className="km-academia-section" aria-labelledby="km-academia-title">
      <div className="km-academia-inner">
        <div className="km-academia-copy">
          <span className="km-academia-eyebrow">LA RÉUSSITE COMMENCE ICI</span>
          <h2 id="km-academia-title">À vos côtés pour faire réussir chaque élève</h2>
          <p>
            Avec Kmertude, chaque élève camerounais bénéficie d’un accompagnement
            adapté à son niveau, à ses objectifs et à son rythme.
          </p>
          <div className="km-academia-proof">
            <div className="km-academia-avatars" aria-hidden="true">
              <span>É</span><span>P</span><span>K</span>
            </div>
            <div>
              <strong>Un accompagnement qui vous ressemble</strong>
              <span>Des solutions pour progresser avec confiance</span>
            </div>
          </div>
          <div className="km-academia-images">
            <img src="/d.jpg" alt="Un environnement d’apprentissage" loading="lazy" decoding="async" />
            <img src="/a.jpg" alt="Des élèves qui apprennent ensemble" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="km-academia-panel">
          <div className="km-academia-panel-heading">
            <span className="km-academia-dot" />
            <span>Construisons son parcours de réussite</span>
          </div>
          <h3>Quel accompagnement recherchez-vous ?</h3>
          <div className="km-academia-tabs" role="group" aria-label="Type d’accompagnement">
            <button
              type="button"
              className={offerType === 'individual' ? 'active' : ''}
              aria-pressed={offerType === 'individual'}
              onClick={() => setOfferType('individual')}
            >
              Cours particuliers
            </button>
            <button
              type="button"
              className={offerType === 'group' ? 'active' : ''}
              aria-pressed={offerType === 'group'}
              onClick={() => setOfferType('group')}
            >
              Cours collectifs & stages
            </button>
          </div>
          <label className="km-academia-label" htmlFor="km-academia-city">Votre ville</label>
          <input
            id="km-academia-city"
            className="km-academia-input"
            type="text"
            placeholder="Ex. : Yaoundé, Douala…"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <label className="km-academia-label" htmlFor="km-academia-level">Niveau scolaire</label>
          <select
            id="km-academia-level"
            className="km-academia-input"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="">Sélectionnez le niveau</option>
            <option value="primaire">Primaire</option>
            <option value="college">Collège</option>
            <option value="lycee">Lycée</option>
            <option value="superieur">Supérieur</option>
          </select>
          <button className="km-academia-submit" type="button" onClick={startSearch}>
            Trouver mon accompagnement <span aria-hidden="true">→</span>
          </button>
          <p className="km-academia-note">Un parcours adapté aux besoins de votre enfant.</p>
        </div>
      </div>
    </section>
  )
}
