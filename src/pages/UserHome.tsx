 
import './UserHome.css'

  import UserNavbar from '@/components/UserNavbar';
export default function UserHome() {
  
  return (
    <div className="user-home-page">
       
     <UserNavbar></UserNavbar>
       
      <section className="content-section">
        <div className="content-container">
          <div>
            <div className="section-header">
              <h2>Rejoignez notre équipe d'experts</h2>
              <p>Des opportunités exceptionnelles pour les professeurs passionnés qui veulent faire la différence</p>
            </div>
            
            {/* Job Offers Section */}
            <div className="offers-grid">
              {/* Offer 1 */}
              <div className="offer-card">
                <div className="offer-image">
                  <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&crop=center" alt="Professeur de Mathématiques" />
                  <div className="offer-badge">Urgent</div>
                </div>
                <div className="offer-content">
                  <h3>Professeur de Mathématiques</h3>
                  <p className="offer-company">Demande parent - Douala</p>
                  <div className="offer-meta">
                    <span className="offer-location">Douala, Cameroun</span>
                    <span className="offer-contract">2h/semaine</span>
                    <span className="offer-salary">15-25€/heure</span>
                  </div>
                  <div className="offer-tags">
                    <span>Mathématiques</span>
                    <span>Tle</span>
                    <span>Garçon 12 ans</span>
                  </div>
                  <p className="offer-description">
                    "Je recherche un professeur de mathématiques pour mon garçon de 12 ans en classe de Tle. 
                    Il a besoin d'un soutien pour préparer son examen final. Disponible les week-ends."
                  </p>
                  <div className="offer-actions">
                    <button className="btn-outline">Voir le profil</button>
                    <button className="btn-primary">Postuler</button>
                  </div>
                </div>
              </div>

              {/* Offer 2 */}
              <div className="offer-card">
                <div className="offer-image">
                  <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop&crop=center" alt="Professeur de Physique-Chimie" />
                  <div className="offer-badge featured">Premium</div>
                </div>
                <div className="offer-content">
                  <h3>Professeur de Physique-Chimie</h3>
                  <p className="offer-company">Demande parent - Yaoundé</p>
                  <div className="offer-meta">
                    <span className="offer-location">Yaoundé, Cameroun</span>
                    <span className="offer-contract">3h/semaine</span>
                    <span className="offer-salary">20-30€/heure</span>
                  </div>
                  <div className="offer-tags">
                    <span>Physique-Chimie</span>
                    <span>1ère</span>
                    <span>Fille 15 ans</span>
                  </div>
                  <p className="offer-description">
                    "Ma fille de 15 ans en classe de 1ère a besoin d'aide en physique-chimie. 
                    Elle prépare le bac et souhaite renforcer ses bases. Sessions à domicile préférées."
                  </p>
                  <div className="offer-actions">
                    <button className="btn-outline">Voir le profil</button>
                    <button className="btn-primary">Postuler</button>
                  </div>
                </div>
              </div>

              {/* Offer 3 */}
              <div className="offer-card">
                <div className="offer-image">
                  <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&crop=center" alt="Tuteur en Anglais" />
                  <div className="offer-badge">Nouveau</div>
                </div>
                <div className="offer-content">
                  <h3>Tuteur en Ligne - Anglais</h3>
                  <p className="offer-company">Demande parent - Bafoussam</p>
                  <div className="offer-meta">
                    <span className="offer-location">Télétravail</span>
                    <span className="offer-contract">2h/semaine</span>
                    <span className="offer-salary">12-20€/heure</span>
                  </div>
                  <div className="offer-tags">
                    <span>Anglais</span>
                    <span>4ème</span>
                    <span>Fille 13 ans</span>
                  </div>
                  <p className="offer-description">
                    "Je cherche un tuteur d'anglais en ligne pour ma fille de 13 ans en 4ème. 
                    Elle a besoin d'améliorer sa conversation et sa grammaire. Flexible sur les horaires."
                  </p>
                  <div className="offer-actions">
                    <button className="btn-outline">Voir le profil</button>
                    <button className="btn-primary">Postuler</button>
                  </div>
                </div>
              </div>

              {/* Offer 4 */}
              <div className="offer-card">
                <div className="offer-image">
                  <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop&crop=center" alt="Professeur de Français" />
                </div>
                <div className="offer-content">
                  <h3>Professeur de Français</h3>
                  <p className="offer-company">Demande parent - Garoua</p>
                  <div className="offer-meta">
                    <span className="offer-location">Garoua, Cameroun</span>
                    <span className="offer-contract">1.5h/semaine</span>
                    <span className="offer-salary">10-18€/heure</span>
                  </div>
                  <div className="offer-tags">
                    <span>Français</span>
                    <span>6ème</span>
                    <span>Garçon 11 ans</span>
                  </div>
                  <p className="offer-description">
                    "Mon fils de 11 ans en 6ème a des difficultés en français, notamment en rédaction. 
                    Je cherche quelqu'un de patient pour l'aider à progresser. Sessions en semaine après 17h."
                  </p>
                  <div className="offer-actions">
                    <button className="btn-outline">Voir le profil</button>
                    <button className="btn-primary">Postuler</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Kmertude</h3>
            <p>La plateforme leader du soutien scolaire au Cameroun. Excellence académique et réussite garantie.</p>
             
          </div>
          
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>Cours particuliers</li>
              <li>Stages en groupes</li>
              <li>Soutien en ligne</li>
              <li>Préparation examens</li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Ressources</h3>
            <ul>
              <li>Blog pédagogique</li>
              <li>Guides d'étude</li>
              <li>Conseils d'experts</li>
              <li>Méthodologies</li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li>+237 622 244 994</li>
              <li>contact@kmertude.com</li>
              <li>Douala, Cameroun</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom"> 
        </div>
      </footer>
    </div>
  )
}
