import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SavedSearchesMenu from './SavedSearchesMenu'
import { ROLE_LABEL, displayName, logout, useSession } from '../lib/session'
import './UserNavbar.css'

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const session = useSession()
  const navigate = useNavigate()
  const name = session ? displayName(session.user) : ''
  const role = session ? ROLE_LABEL[session.user.user_type] : ''
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const signOut = async () => { await logout(); navigate('/login', { replace: true }) }

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
            <Link to="/" className="logo-link">
              <h1>Kmertude</h1>
              <span>soutien scolaire</span>
            </Link>
          </div>
        </div>

        <div className="user-navbar-center">
          <nav className="user-nav">
            <Link to="/enseignant" className="nav-link">Propositions</Link>
            <Link to="/enseignant/seance" className="nav-link">Séance</Link>
            <Link to="/enseignant/gains" className="nav-link">Gains</Link>
            <Link to="/enseignant/dossier" className="nav-link">Dossier</Link>
            <Link to="/user-videos" className="nav-link">Mes vidéos</Link>
          </nav>
        </div>

        <div className="user-navbar-right">
          <SavedSearchesMenu />
          <div className="user-info">
            <div className="user-avatar">
              <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', fontWeight: 700 }}>{initials}</span>
            </div>
            <div className="user-details">
              <Link to="/profil" className="user-name">{name}</Link>
              <span className="user-role">{role}</span>
            </div>
          </div>
          <div className="user-actions">
            <button className="btn-logout" type="button" onClick={signOut} aria-label="Se déconnecter" title="Se déconnecter">
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
                <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', fontWeight: 700 }}>{initials}</span>
              </div>
              <div className="user-mobile-details">
                <h4>{name}</h4>
                <p>{role}</p>
              </div>
            </div>
          </div>

          <div className="user-mobile-searches">
            <SavedSearchesMenu />
          </div>

          <ul className="user-mobile-nav">
            <li><Link to="/enseignant" onClick={closeMenu}>Propositions</Link></li>
            <li><Link to="/enseignant/seance" onClick={closeMenu}>Séance</Link></li>
            <li><Link to="/enseignant/gains" onClick={closeMenu}>Gains</Link></li>
            <li><Link to="/enseignant/dossier" onClick={closeMenu}>Dossier</Link></li>
            <li><Link to="/user-videos" onClick={closeMenu}>Mes vidéos</Link></li>
            <li><Link to="/profil" onClick={closeMenu}>Mon profil</Link></li>
            <li><button type="button" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }} onClick={signOut}>Se déconnecter</button></li>
          </ul>
        </div>
      </aside>
    </header>
  )
}
