import './UserNavbar.css'

export default function UserNavbar() {
  return (
    <header className="user-navbar">
      <div className="user-navbar-container">
        <div className="user-navbar-left">
          <div className="logo">
            <h1>complétude</h1>
            <span>soutien scolaire</span>
          </div>
        </div>

        <div className="user-navbar-center">
          <nav className="user-nav">
            <a href="/user-home" className="nav-link">Accueil</a>
            <a href="/user-students" className="nav-link">Mes élèves</a>
            <a href="/user-accounts" className="nav-link">Mes acomptes</a>
            <a href="/user-courses" className="nav-link">Mes bulletins de paie</a>
            <a href="#" className="nav-link">Mes récapitulatifs annuels</a>
            <a href="#" className="nav-link">Mes vidéos</a>
            <a href="#" className="nav-link">Mes documents utiles</a>
          </nav>
        </div>

        <div className="user-navbar-right">
          <div className="user-info">
            <div className="user-avatar">
              <img src="/yannick.jpg" alt="Avatar" />
            </div>
            <div className="user-details">
              <span className="user-name">Yannick olinga</span>
              <span className="user-role">Parent</span>
            </div>
          </div>
          <div className="user-actions">
            <button className="btn-notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <button className="btn-settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 8.54l4.24 4.24M20.46 15.46l-4.24 4.24M8.54 1.54l4.24 4.24"></path>
              </svg>
            </button>
            <button className="btn-logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
