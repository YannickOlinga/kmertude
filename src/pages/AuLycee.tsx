import './AuLycee.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AuLycee() {
  return (
    <>
      <Navbar />
      <div className="au-lycee-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <div className="hero-content">
            <h1>Cours particuliers au lycée</h1>
            <p>Préparation au baccalauréat et accompagnement personnalisé</p>
            <button className="btn-hero">COMMENCER MAINTENANT</button>
          </div>
        </section>

        {/* Blog-style section */}
        <section className="blog-section">
          <div className="blog-container">
            <div className="blog-content">
              <div className="blog-text">
                <h2>Un accompagnement complet pour la réussite du lycée</h2>
                <p>Nos cours particuliers au lycée sont conçus pour aider chaque élève à maîtriser les matières complexes et à préparer le baccalauréat. Avec une approche pédagogique adaptée et des professeurs qualifiés, nous assurons un suivi personnalisé pour garantir les meilleurs résultats.</p>
                <button className="btn-blog">Découvrir nos tarifs</button>
              </div>
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&crop=center" alt="Cours particuliers lycée" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <h2>Pourquoi choisir nos cours particuliers ?</h2>
            <p>Une méthode éprouvée qui a déjà aidé des milliers d'élèves à réussir</p>
            
            <div className="features-cards">
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center" alt="Professeurs experts" />
                </div>
                <h3>Professeurs experts</h3>
                <p>Des professeurs qualifiés et expérimentés pour vous accompagner</p>
              </div>
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center" alt="Programme personnalisé" />
                </div>
                <h3>Programme personnalisé</h3>
                <p>Un apprentissage adapté à vos besoins et votre rythme</p>
              </div>
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=center" alt="Résultats garantis" />
                </div>
                <h3>Résultats garantis</h3>
                <p>Une méthode éprouvée pour garantir votre succès</p>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
