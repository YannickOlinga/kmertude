import { Link } from 'react-router-dom'
import './Footer.css'

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Nos cours',
    links: [
      ['En primaire', '/en-primaire'],
      ['Au collège', '/au-college'],
      ['Au lycée', '/au-lycee'],
      ['Dans le supérieur', '/dans-superieur'],
      ['Pour adultes', '/pour-adultes'],
    ],
  },
  {
    title: 'Kmertude',
    links: [
      ['Demander un cours', '/demande'],
      ['Devenir enseignant', '/devenir-enseignant'],
      ['Espace famille', '/login'],
      ['Espace enseignant', '/login?profil=enseignant'],
    ],
  },
]

const LEGAL: [string, string][] = [
  ['Mentions légales', '/mentions-legales'],
  ['Conditions générales', '/conditions-generales'],
  ['Données personnelles', '/donnees-personnelles'],
  ['Cookies', '/cookies'],
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-brand">
          <Link to="/" className="ft-logo">Kmer<span>tude</span></Link>
          <p>
            Cours particuliers à domicile et en ligne au Cameroun, avec des enseignants
            vérifiés et un suivi après chaque séance.
          </p>
          <Link to="/demande" className="ft-cta">Demander un cours</Link>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className="ft-col" aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map(([label, to]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="ft-col">
          <h3>Paiement</h3>
          <ul className="ft-pay">
            <li><span className="ft-chip mtn">MTN MoMo</span></li>
            <li><span className="ft-chip orange">Orange Money</span></li>
          </ul>
          <h3 className="ft-follow">Suivez-nous</h3>
          <div className="ft-social">
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="ft-inner ft-bottom-inner">
          <span>© {year} Kmertude · Soutien scolaire au Cameroun</span>
          <ul className="ft-legal">
            {LEGAL.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  )
}
