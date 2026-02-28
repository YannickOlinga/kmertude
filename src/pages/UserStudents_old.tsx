import UserNavbar from '../components/UserNavbar'
import './UserStudents.css'

export default function UserStudents() {
  return (
    <div className="user-students">
      <UserNavbar />
      
      <div className="user-students-container">
        {/* Header Section */}
        <section className="students-header">
          <h1>Mes élèves</h1>
          <button className="btn-add-student">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Ajouter un élève
          </button>
        </section>

        {/* Students List */}
        <section className="students-list">

          <div className="student-row">
            <div className="student-main">
              <h3 className="student-name">Marie Dupont</h3>
              <p className="student-address">12 rue Victor Hugo, Paris</p>
              <p className="student-level">3ème • Mathématiques</p>
            </div>

            <div className="student-meta">
              <span className="student-hours">17 heures réglées</span>
              <span className="student-status finished">Cours terminé</span>
            </div>
          </div>

          <div className="student-row">
            <div className="student-main">
              <h3 className="student-name">Lucas Dupont</h3>
              <p className="student-address">5 avenue République, Paris</p>
              <p className="student-level">5ème • Français</p>
            </div>

            <div className="student-meta">
              <span className="student-hours">0 heure réglée</span>
              <span className="student-status cancelled">Cours annulé</span>
            </div>
          </div>

        </section>
          <div className="student-card">
            <div className="student-header">
              <div className="student-avatar">
                <img src="/student1.jpg" alt="Marie Dupont" />
              </div>
              <div className="student-info">
                <h3>Marie Dupont</h3>
                <p>3ème • Collège Jean Jaurès</p>
              </div>
              <div className="student-actions">
                <button className="btn-edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="btn-delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="student-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Niveau</span>
                  <span className="detail-value">3ème</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Établissement</span>
                  <span className="detail-value">Collège Jean Jaurès</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Professeur principal</span>
                  <span className="detail-value">Prof. Martin</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Matières suivies</span>
                  <span className="detail-value">Maths, Français, Physique</span>
                </div>
              </div>
            </div>

            <div className="student-progress">
              <h4>Progression générale</h4>
              <div className="progress-circle">
                <div className="progress-value">78%</div>
              </div>
              <p>Bonne progression</p>
            </div>

            <div className="student-actions-bottom">
              <button className="btn-primary">Voir le détail</button>
              <button className="btn-secondary">Contacter le professeur</button>
            </div>
          </div>

          <div className="student-card">
            <div className="student-header">
              <div className="student-avatar">
                <img src="/student2.jpg" alt="Lucas Dupont" />
              </div>
              <div className="student-info">
                <h3>Lucas Dupont</h3>
                <p>5ème • Collège Jean Jaurès</p>
              </div>
              <div className="student-actions">
                <button className="btn-edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="btn-delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="student-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Niveau</span>
                  <span className="detail-value">5ème</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Établissement</span>
                  <span className="detail-value">Collège Jean Jaurès</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Professeur principal</span>
                  <span className="detail-value">Prof. Bernard</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Matières suivies</span>
                  <span className="detail-value">Maths, Français, Histoire</span>
                </div>
              </div>
            </div>

            <div className="student-progress">
              <h4>Progression générale</h4>
              <div className="progress-circle">
                <div className="progress-value">82%</div>
              </div>
              <p>Très bonne progression</p>
            </div>

            <div className="student-actions-bottom">
              <button className="btn-primary">Voir le détail</button>
              <button className="btn-secondary">Contacter le professeur</button>
            </div>
          </div>

          <div className="student-card">
            <div className="student-header">
              <div className="student-avatar">
                <img src="/student3.jpg" alt="Sophie Dupont" />
              </div>
              <div className="student-info">
                <h3>Sophie Dupont</h3>
                <p>CM2 • École Primaire Lafayette</p>
              </div>
              <div className="student-actions">
                <button className="btn-edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="btn-delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="student-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Niveau</span>
                  <span className="detail-value">CM2</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Établissement</span>
                  <span className="detail-value">École Primaire Lafayette</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Professeur principal</span>
                  <span className="detail-value">Prof. Dubois</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Matières suivies</span>
                  <span className="detail-value">Maths, Français, Sciences</span>
                </div>
              </div>
            </div>

            <div className="student-progress">
              <h4>Progression générale</h4>
              <div className="progress-circle">
                <div className="progress-value">91%</div>
              </div>
              <p>Excellente progression</p>
            </div>

            <div className="student-actions-bottom">
              <button className="btn-primary">Voir le détail</button>
              <button className="btn-secondary">Contacter le professeur</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
