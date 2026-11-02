import './hero.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSearch } from '../lib/savedSearches'
import { asset } from '../lib/asset'

export default function Hero() {
  const navigate = useNavigate()
  const [offerType, setOfferType] = useState<'individual' | 'group'>('individual')
  const [city, setCity] = useState('')
  const [level, setLevel] = useState('')

  const submit = () => {
    saveSearch({ profile: 'parent', offerType, city, level })
    const params = new URLSearchParams({ role: 'parent', offer: offerType })
    if (city.trim()) params.set('city', city.trim())
    if (level) params.set('level', level)
    navigate(`/auth?${params.toString()}`)
  }

  return (
    <section className="hero-section main-hero">
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

      <div className="herocontainer">
        <div className="toptext">
          <h1>Devenez le prochain <span>Kmertude</span> qui excelle</h1>
          <p className="hero-subtitle">Rejoignez des milliers d'élèves camerounais qui excellent grâce à notre soutien scolaire de qualité</p>
        </div>
        <div className="bottomtext">
          <div className="tab-selector">
            <button
              type="button"
              className={`tab-button${offerType === 'individual' ? ' active' : ''}`}
              onClick={() => setOfferType('individual')}
            >
              Cours particuliers
            </button>
            <button
              type="button"
              className={`tab-button${offerType === 'group' ? ' active' : ''}`}
              onClick={() => setOfferType('group')}
            >
              Stages intensifs
            </button>
          </div>
          <div className="form-container">
            <input
              type="text"
              placeholder="Votre ville*"
              className="form-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select className="form-input" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Niveau scolaire*</option>
              <option value="SIL">SIL</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
              <option value="6e">6e</option>
              <option value="5e">5e</option>
              <option value="4e">4e</option>
              <option value="3e">3e</option>
              <option value="2nd">2nd</option>
              <option value="1ere">1ère</option>
              <option value="Tle">Tle</option>
            </select>
            <button
              className="submit-button"
              type="button"
              onClick={submit}
            >
              <p className="button_text">VOIR MON TARIF</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
