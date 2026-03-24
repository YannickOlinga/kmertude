import './AuthCTA.css'
import { useNavigate } from 'react-router-dom'

export default function AuthCTA() {
  const navigate = useNavigate()

  const handleAuthClick = () => {
    navigate('/auth')
  }

  return (
    <section className="auth-cta-section">
      <div className="auth-cta-container">
        <div className="auth-cta-header">
          <h2>Rejoignez la communauté Kmertude</h2>
          <p>Choisissez votre profil pour accéder à des opportunités d'excellence académique</p>
        </div>

        <div className="auth-cta-cards">
          {/* Parent Card */}
          <div className="auth-card-parent">
            <div className="card-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 >Je suis Parent</h3>
            <p>Trouvez le professeur idéal pour vos enfants et suivez leur progression académique</p>
            <ul className="card-features">
              <li>👨‍👩‍👧‍👦 Accès aux meilleurs professeurs</li>
              <li>📊 Suivi personnalisé de la progression</li>
              <li>🔒 Sécurité et confiance garanties</li>
              <li>💬 Communication directe avec les enseignants</li>
            </ul>
            <button 
              className="cta-btn parent-btn"
              onClick={handleAuthClick}
            >
              Se connecter en tant que Parent
            </button>
          </div>

          {/* Teacher Card */}
          <div className="auth-card-teacher">
            <div className="card-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h3>Je suis Enseignant</h3>
            <p>Partagez votre expertise et développez votre activité d'enseignement</p>
            <ul className="card-features">
              <li>🎯 Accès à des opportunités variées</li>
              <li>💰 Rémunération attractive et flexible</li>
              <li>📈 Développement professionnel continu</li>
              <li>🌐 Flexibilité de travail (présentiel/online)</li>
            </ul>
            <button 
              className="cta-btn teacher-btn"
              onClick={handleAuthClick}
            >
              Se connecter en tant qu'Enseignant
            </button>
          </div>
        </div>

        <div className="auth-cta-bottom">
          <p>Vous avez déjà un compte ?</p>
          <button 
            className="login-link-btn"
            onClick={() => navigate('/auth')}
          >
            Se connecter maintenant
          </button>
        </div>
      </div>
    </section>
  )
}
