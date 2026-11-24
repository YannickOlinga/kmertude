import { Link, Navigate, NavLink } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { LEGAL_DOCS } from './legalContent'
import './LegalPage.css'

export default function LegalPage({ slug }: { slug: string }) {
  const doc = LEGAL_DOCS.find((d) => d.slug === slug)
  if (!doc) return <Navigate to="/" replace />

  return (
    <>
      <Navbar />
      <main className="lg-page">
        <div className="lg-wrap">
          <nav className="lg-nav" aria-label="Informations légales">
            {LEGAL_DOCS.map((d) => (
              <NavLink key={d.slug} to={`/${d.slug}`}>{d.title}</NavLink>
            ))}
          </nav>

          <article className="lg-doc">
            <span className="lg-eyebrow">Informations légales</span>
            <h1>{doc.title}</h1>
            <p className="lg-updated">Dernière mise à jour : {doc.updated}</p>
            <p className="lg-intro">{doc.intro}</p>
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.body}
              </section>
            ))}
            <p className="lg-back"><Link to="/">← Retour à l’accueil</Link></p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
