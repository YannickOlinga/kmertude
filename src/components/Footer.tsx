import { asset } from '../lib/asset'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-left">
            <div className="ifop-section">
              <img src={asset('/ifop-logo.png')} alt="IFOP" className="ifop-logo" />
              <p className="ifop-text">Enquête IFOP 2025</p>
              <a href="#" className="footer-link">Voir tous les résultats</a>
            </div>
          </div>
          
          <div className="footer-right">
            <div className="certification-section">
              <img src={asset('/qualicert-logo.png')} alt="Qualicert SGS" className="certification-logo" />
              <p className="certification-text">Certification Qualicert</p>
              <a href="#" className="footer-link">En savoir plus</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-links">
            <a href="#" className="footer-link">À propos de Kmertude</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Nous rejoindre</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Contact Presse</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">CGS Cours particuliers</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">CGS Stages en petits groupes</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Données personnelles</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Cookies</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Mentions légales</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Plan du site</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Espace famille</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Espace prof</a>
          </div>
          
          <div className="social-icons">
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="social-icon services-icon">
              <span className="services-text">services à la personne</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
