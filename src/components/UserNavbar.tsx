import { useEffect, useState } from 'react'
import './UserNavbar.css'

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="user-navbar">
      <div className="user-navbar-container">
        <div className="user-navbar-left">
          <div className="logo">
            <a href="/" className="logo-link">
              <h1>Kmertude</h1>
              <span>soutien scolaire</span>
            </a>
          </div>
        </div>

        <div className="user-navbar-center">
          <nav className="user-nav">
            {/* <a href="/user-home" className="nav-link">Accueil</a> */}
            <a href="/user-students" className="nav-link">Mes élèves</a>
            <a href="/user-accounts" className="nav-link">Mes acomptes</a>
            {/* <a href="/user-courses" className="nav-link">Mes bulletins de paie</a> */}
            <a href="#" className="nav-link">Mes récapitulatifs annuels</a>
            <a href="/user-videos" className="nav-link">Mes vidéos</a>
            <a href="/user-documents" className="nav-link">Mes documents utiles</a>
          </nav>
        </div>

        <div className="user-navbar-right">
          <div className="user-info">
            <div className="user-avatar">
              <img src="/yannick.jpg" alt="Avatar" />
            </div>
            <div className="user-details">
              <a href="/user-profile" className="user-name">Yannick olinga</a>
              <span className="user-role">Parent</span>
            </div>
          </div>
          <div className="user-actions">
            <button className="btn-logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        <button
          className={`user-mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`user-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      <aside className={`user-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="user-mobile-menu-header">
          <div className="user-mobile-menu-logo">
            <h1>Kmertude</h1>
            <span>soutien scolaire</span>
          </div>
          <button className="btn-logout" type="button" onClick={closeMenu} aria-label="Fermer le menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="user-mobile-menu-content">
          <div className="user-mobile-user-section">
            <div className="user-mobile-user-info">
              <div className="user-mobile-avatar">
                <img src="/yannick.jpg" alt="Avatar" />
              </div>
              <div className="user-mobile-details">
                <h4>Yannick olinga</h4>
                <p>Parent</p>
              </div>
            </div>
          </div>

          <ul className="user-mobile-nav">
            <li><a href="/user-students" onClick={closeMenu}>Mes eleves</a></li>
            <li><a href="/user-accounts" onClick={closeMenu}>Mes acomptes</a></li>
            <li><a href="/user-videos" onClick={closeMenu}>Mes videos</a></li>
            <li><a href="/user-documents" onClick={closeMenu}>Mes documents utiles</a></li>
            <li><a href="/user-profile" onClick={closeMenu}>Mon profil</a></li>
          </ul>
        </div>
      </aside>
    </header>
  )
}
