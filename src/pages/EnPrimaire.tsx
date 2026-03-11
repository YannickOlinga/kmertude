import './EnPrimaire.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function EnPrimaire() {
  return (
    <>
      <Navbar />
      <div className="en-primaire-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Cours particuliers en primaire</h1>
            <p>Soutien scolaire personnalisé pour les élèves du CP au CM2</p>
            <div className="hero-cta">
              <button className="btn-primary">Commencer maintenant</button>
              <button className="btn-secondary">En savoir plus</button>
            </div>
          </div>
          <div className="hero-background"></div>
        </div>

        {/* Blog-style section */}
        <section className="blog-section">
          <div className="blog-container">
            <div className="blog-content">
              <h2>Un accompagnement personnalisé pour la réussite de votre enfant</h2>
              <p>Nos cours particuliers en primaire sont conçus pour aider chaque élève à progresser à son rythme. Avec une approche pédagogique adaptée et des professeurs qualifiés, nous assurons un suivi personnalisé pour garantir les meilleurs résultats.</p>
              
              <button className="btn-blog">Découvrir notre méthode</button>
            </div>
            <div className="blog-image">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&crop=center" alt="Cours particuliers" />
            </div>
          </div>
        </section>

        {/* New Features Section */}
        <section className="features-section">
          <div className="features-container">
            <h2>Pourquoi choisir nos cours particuliers ?</h2>
            <p>Une méthode éprouvée qui a déjà aidé des milliers d'élèves à réussir</p>
            
            <div className="features-cards">
              <div className="feature-card-row">
                <div className="feature-image-card">
                  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop&crop=center" alt="Professeurs experts" />
                  <div className="feature-content">
                    <h3>Professeurs experts</h3>
                    <p>Nos enseignants sont tous diplômés et expérimentés dans l'enseignement primaire</p>
                  </div>
                </div>
                
                <div className="feature-image-card">
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center" alt="Programme sur mesure" />
                  <div className="feature-content">
                    <h3>Programme sur mesure</h3>
                    <p>Chaque cours est adapté aux besoins spécifiques de votre enfant</p>
                  </div>
                </div>
              </div>
              
              <div className="feature-card-row">
                <div className="feature-image-card">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center" alt="Suivi détaillé" />
                  <div className="feature-content">
                    <h3>Suivi détaillé</h3>
                    <p>Rapports réguliers pour suivre les progrès et ajuster la méthode</p>
                  </div>
                </div>
                
                <div className="feature-image-card">
                  <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop&crop=center" alt="Résultats garantis" />
                  <div className="feature-content">
                    <h3>Résultats garantis</h3>
                    <p>Amélioration visible des notes et de la confiance en soi</p>
                  </div>
                </div>
              </div>
            </div>
            
          
          </div>
        </section>

       
      </div> 
      <Footer></Footer>
    </>
  )
}
