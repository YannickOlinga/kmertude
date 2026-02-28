import UserNavbar from '../components/UserNavbar'
import './UserHome.css'

export default function UserHome() {
  return (
    <div className="user-home">
      <UserNavbar />
      
      <div className="user-home-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Bonjour Yannick olinga 👋</h1>
            <p>Bienvenue dans votre espace parent</p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="cards-section">
          <div className="cards-grid">
            <div className="card">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Mes élèves</h3>
              <p>Gérez le profil et le suivi de vos enfants</p>
              <button className="card-btn">Accéder</button>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M7 15h.01"></path>
                  <path d="M12 15h.01"></path>
                  <path d="M17 15h.01"></path>
                  <path d="M7 11h.01"></path>
                  <path d="M12 11h.01"></path>
                  <path d="M17 11h.01"></path>
                  <path d="M7 7h.01"></path>
                  <path d="M12 7h.01"></path>
                  <path d="M17 7h.01"></path>
                </svg>
              </div>
              <h3>Mes comptes</h3>
              <p>Consultez vos factures et paiements</p>
              <button className="card-btn">Accéder</button>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e91e63" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3>Ma progression</h3>
              <p>Suivez les progrès de vos enfants</p>
              <button className="card-btn">Accéder</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
