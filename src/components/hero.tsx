import './hero.css'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSearch } from '../lib/savedSearches'
import { asset } from '../lib/asset'

const LEVELS: { group: string; options: string[] }[] = [
  { group: 'Primaire', options: ['SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'] },
  { group: 'Collège', options: ['6e', '5e', '4e', '3e'] },
  { group: 'Lycée', options: ['2nde', '1ère', 'Tle'] },
]

export default function Hero() {
  const navigate = useNavigate()
  const [offerType, setOfferType] = useState<'individual' | 'group'>('individual')
  const [city, setCity] = useState('')
  const [level, setLevel] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    saveSearch({ profile: 'parent', offerType, city, level })
    const params = new URLSearchParams({ role: 'parent', offer: offerType })
    if (city.trim()) params.set('city', city.trim())
    if (level) params.set('level', level)
    navigate(`/auth?${params.toString()}`)
  }

  return (
    <section className="main-hero" aria-labelledby="hero-title">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={asset('/d.jpg')}
        aria-hidden="true"
      >
        <source src={asset('/12724010-uhd_4096_2160_60fps.mp4')} type="video/mp4" />
      </video>

      <div className="hero-inner">
        <div className="hero-headline">
          <h1 id="hero-title">
            Avec <span>des enseignants vérifiés près de chez vous</span>, combien me coûte 1h de cours particulier ?
          </h1>
          <svg className="hero-arrow" viewBox="0 0 40 80" aria-hidden="true">
            <path d="M8 6c18 4 26 24 18 62" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M14 56l12 14 8-17" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="hero-search">
          <div className="hero-tabs" role="tablist" aria-label="Type d'accompagnement">
            <button
              type="button"
              role="tab"
              aria-selected={offerType === 'individual'}
              className={`hero-tab${offerType === 'individual' ? ' active' : ''}`}
              onClick={() => setOfferType('individual')}
            >
              Cours particuliers à domicile
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={offerType === 'group'}
              className={`hero-tab${offerType === 'group' ? ' active' : ''}`}
              onClick={() => setOfferType('group')}
            >
              Stages intensifs
            </button>
          </div>

          <form className="hero-form" onSubmit={submit}>
            <label className="hero-sr" htmlFor="hero-city">Lieu des cours</label>
            <input
              id="hero-city"
              type="text"
              placeholder="Lieu des cours*"
              className="hero-field"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
            <label className="hero-sr" htmlFor="hero-level">Classe</label>
            <select id="hero-level" className="hero-field hero-select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Classe*</option>
              {LEVELS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </optgroup>
              ))}
            </select>
            <button className="hero-submit" type="submit">Voir mon tarif</button>
          </form>
        </div>
      </div>
    </section>
  )
}
