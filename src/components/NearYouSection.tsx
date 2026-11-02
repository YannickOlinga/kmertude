import { useState, type FormEvent } from 'react'
import { asset } from '../lib/asset'
import './NearYouSection.css'

export default function NearYouSection() {
  const [city, setCity] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return
    document.getElementById('km-academia-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="km-near" aria-labelledby="km-near-title">
      <div className="km-near-inner">
        <div className="km-near-media">
          <img src={asset('/i.jpg')} alt="Un enseignant accompagne deux élèves" loading="lazy" decoding="async" />
          <span className="km-near-tag">Près de chez vous</span>
        </div>

        <div className="km-near-content">
          <span className="km-near-notch" aria-hidden="true" />
          <p className="km-near-note" aria-hidden="true">
            Notre centre
            <br />
            dans votre ville
            <svg viewBox="0 0 60 30" width="58" height="30">
              <path d="M50 4c4 10-6 18-22 18-6 0-12-1-18-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M16 12l-7 6 9 3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>

          <div className="km-near-body">
            <h2 id="km-near-title">Proches de chez vous</h2>
            <p className="km-near-sub">Nos enseignants disponibles sous 4 jours</p>
            <form className="km-near-form" role="search" onSubmit={handleSubmit}>
              <label htmlFor="km-near-city" className="km-near-sr">Votre ville ou code postal</label>
              <input
                id="km-near-city"
                type="text"
                placeholder="Votre ville ou code postal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
              />
              <button type="submit">Rechercher</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
