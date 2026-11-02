import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import NearYouSection from './NearYouSection'
import { asset } from '../lib/asset'
import type { LevelData } from '../lib/levels'
import './LevelPage.css'

export default function LevelPage({ level }: { level: LevelData }) {
  const navigate = useNavigate()
  const [classId, setClassId] = useState(level.classes[0].id)
  const current = level.classes.find((c) => c.id === classId) ?? level.classes[0]
  const contact = () => navigate(`/auth?role=${level.role}`)

  return (
    <>
      <Navbar />
      <main className="lv-page">
        {/* Fil d'Ariane + hero */}
        <section className="lv-hero">
          <div className="lv-wrap">
            <nav className="lv-breadcrumb" aria-label="Fil d'Ariane">
              <Link to="/">Accueil</Link>
              <span aria-hidden="true">›</span>
              <span>Votre niveau</span>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{level.label}</span>
            </nav>

            <div className="lv-hero-grid">
              <div className="lv-hero-text">
                <span className="lv-eyebrow">Soutien scolaire {level.inLabel}</span>
                <h1>{level.hero.title}</h1>
                <p>{level.hero.lead}</p>
                <div className="lv-actions">
                  <button type="button" className="lv-btn lv-btn-dark" onClick={contact}>Je contacte un conseiller</button>
                  <button type="button" className="lv-btn lv-btn-outline" onClick={contact}>Voir nos tarifs</button>
                </div>
              </div>
              <div className="lv-hero-media">
                <img src={asset(level.hero.image)} alt="" />
                <span className="lv-hand-tag">{level.hero.tag}</span>
              </div>
            </div>

            <div className="lv-challenges">
              {level.challenges.map((c) => (
                <article key={c.title} className="lv-challenge">
                  <img src={asset(c.image)} alt="" />
                  <div className="lv-challenge-body">
                    <h2>{c.title}</h2>
                    <p>{c.text}</p>
                    <ul className="lv-pills">
                      {c.offers.map((o) => <li key={o}>{o}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Sélecteur de classe */}
        <section className="lv-classes" aria-labelledby="lv-classes-title">
          <div className="lv-wrap">
            <h2 id="lv-classes-title" className="lv-title">{level.classesTitle}</h2>
            <div className="lv-tabs" role="tablist" aria-label={level.classesTitle}>
              {level.classes.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  id={`lv-tab-${c.id}`}
                  aria-selected={c.id === current.id}
                  aria-controls="lv-class-panel"
                  className={`lv-tab${c.id === current.id ? ' active' : ''}`}
                  onClick={() => setClassId(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="lv-class-panel" id="lv-class-panel" role="tabpanel" aria-labelledby={`lv-tab-${current.id}`}>
              <h3>{current.title}</h3>
              <p className="lv-class-intro">{current.intro}</p>
              <div className="lv-class-cols">
                <div>
                  <h4>Les objectifs</h4>
                  <ul>{current.goals.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
                <div>
                  <h4>Les matières clés</h4>
                  <ul>{current.subjects.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
                <div>
                  <h4>Notre accompagnement</h4>
                  <ul>{current.support.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </div>
              <button type="button" className="lv-btn lv-btn-yellow" onClick={contact}>Je me renseigne</button>
            </div>
          </div>
        </section>

        {/* Matières */}
        <section className="lv-subjects" aria-labelledby="lv-subjects-title">
          <div className="lv-wrap">
            <h2 id="lv-subjects-title" className="lv-title">Les matières les plus demandées {level.inLabel}</h2>
            <div className="lv-subjects-grid">
              {level.subjects.map((s) => (
                <div key={s.name} className="lv-subject">
                  <h3>{s.name}</h3>
                  <p>{s.tagline}</p>
                  <button type="button" className="lv-link" onClick={contact}>Trouver un enseignant →</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Appel à l'action conseiller */}
        <section className="lv-cta">
          <div className="lv-wrap lv-cta-grid">
            <img src={asset(level.cta.image)} alt="" loading="lazy" decoding="async" />
            <div className="lv-cta-text">
              <span className="lv-hand">Bilan offert</span>
              <h2>{level.cta.title}</h2>
              <p>{level.cta.text}</p>
              <button type="button" className="lv-btn lv-btn-dark" onClick={contact}>Je remplis le formulaire</button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="lv-faq" aria-labelledby="lv-faq-title">
          <div className="lv-wrap lv-faq-wrap">
            <h2 id="lv-faq-title" className="lv-title">Questions fréquentes</h2>
            {level.faq.map((f) => (
              <details key={f.q} className="lv-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <NearYouSection />
      </main>
      <Footer />
    </>
  )
}
