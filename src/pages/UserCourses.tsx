import UserNavbar from '../components/UserNavbar'
import './UserCourses.css'

export default function UserCourses() {
  return (
    <div className="user-courses">
      <UserNavbar />
      
      <div className="user-courses-container">
        {/* Header Section */}
        <section className="courses-header">
          <h1>Mes cours</h1>
          <div className="header-actions">
            <button className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Réserver un cours
            </button>
            <div className="filter-tabs">
              <button className="tab active">Tous les cours</button>
              <button className="tab">À venir</button>
              <button className="tab">Terminés</button>
              <button className="tab">Annulés</button>
            </div>
          </div>
        </section>

        {/* Calendar View */}
        <section className="calendar-section">
          <div className="calendar-header">
            <h2>Décembre 2024</h2>
            <div className="calendar-nav">
              <button className="calendar-nav-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <button className="calendar-nav-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div>Lun</div>
              <div>Mar</div>
              <div>Mer</div>
              <div>Jeu</div>
              <div>Ven</div>
              <div>Sam</div>
              <div>Dim</div>
            </div>
            <div className="calendar-days">
              {[...Array(31)].map((_, i) => (
                <div key={i} className={`calendar-day ${i === 14 ? 'today' : ''} ${[5, 12, 19, 26].includes(i + 1) ? 'has-course' : ''}`}>
                  {i + 1}
                  {[5, 12, 19, 26].includes(i + 1) && <div className="course-dot"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses List */}
        <section className="courses-list">
          <h2>Cours de cette semaine</h2>
          
          <div className="course-card upcoming">
            <div className="course-time">
              <div className="time-badge">Aujourd'hui</div>
              <div className="time-details">15:00 - 16:30</div>
            </div>
            <div className="course-content">
              <div className="course-header">
                <h3>Mathématiques - 3ème</h3>
                <div className="course-type">En visioconférence</div>
              </div>
              <div className="course-info">
                <div className="teacher-info">
                  <img src="/teacher1.jpg" alt="Professeur" className="teacher-avatar" />
                  <div>
                    <div className="teacher-name">Prof. Martin</div>
                    <div className="subject">Algèbre et géométrie</div>
                  </div>
                </div>
                <div className="student-info">
                  <span>Élève: Marie Dupont</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn-join">Rejoindre le cours</button>
                <button className="btn-reschedule">Reporter</button>
                <button className="btn-cancel">Annuler</button>
              </div>
            </div>
          </div>

          <div className="course-card upcoming">
            <div className="course-time">
              <div className="time-badge">Demain</div>
              <div className="time-details">14:00 - 15:30</div>
            </div>
            <div className="course-content">
              <div className="course-header">
                <h3>Physique-Chimie - 3ème</h3>
                <div className="course-type">En présentiel</div>
              </div>
              <div className="course-info">
                <div className="teacher-info">
                  <img src="/teacher2.jpg" alt="Professeur" className="teacher-avatar" />
                  <div>
                    <div className="teacher-name">Prof. Bernard</div>
                    <div className="subject">Mécanique et électricité</div>
                  </div>
                </div>
                <div className="student-info">
                  <span>Élève: Marie Dupont</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn-view-details">Voir les détails</button>
                <button className="btn-reschedule">Reporter</button>
                <button className="btn-cancel">Annuler</button>
              </div>
            </div>
          </div>

          <div className="course-card completed">
            <div className="course-time">
              <div className="time-badge">Hier</div>
              <div className="time-details">16:00 - 17:30</div>
            </div>
            <div className="course-content">
              <div className="course-header">
                <h3>Français - 5ème</h3>
                <div className="course-type">En visioconférence</div>
              </div>
              <div className="course-info">
                <div className="teacher-info">
                  <img src="/teacher3.jpg" alt="Professeur" className="teacher-avatar" />
                  <div>
                    <div className="teacher-name">Prof. Dubois</div>
                    <div className="subject">Analyse de texte</div>
                  </div>
                </div>
                <div className="student-info">
                  <span>Élève: Lucas Dupont</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn-review">Laisser un avis</button>
                <button className="btn-report">Voir le rapport</button>
                <button className="btn-book-again">Réserver à nouveau</button>
              </div>
            </div>
          </div>

          <div className="course-card">
            <div className="course-time">
              <div className="time-badge">Vendredi</div>
              <div className="time-details">10:00 - 11:30</div>
            </div>
            <div className="course-content">
              <div className="course-header">
                <h3>Histoire-Géo - 5ème</h3>
                <div className="course-type">En visioconférence</div>
              </div>
              <div className="course-info">
                <div className="teacher-info">
                  <img src="/teacher4.jpg" alt="Professeur" className="teacher-avatar" />
                  <div>
                    <div className="teacher-name">Prof. Leroy</div>
                    <div className="subject">Géographie européenne</div>
                  </div>
                </div>
                <div className="student-info">
                  <span>Élève: Lucas Dupont</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn-view-details">Voir les détails</button>
                <button className="btn-reschedule">Reporter</button>
                <button className="btn-cancel">Annuler</button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="courses-stats">
          <h2>Statistiques des cours</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>48</h3>
                <p>Cours totaux</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <h3>85%</h3>
                <p>Taux de présence</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>4.8</h3>
                <p>Note moyenne</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <h3>12h</h3>
                <p>Durée moyenne</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
