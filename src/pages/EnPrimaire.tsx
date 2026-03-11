import './EnPrimaire.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function EnPrimaire() {
  return (
    <>
      <Navbar />
      <div className="en-primaire-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <div className="hero-content">
            <h1>Cours particuliers en primaire</h1>
            <p>Soutien scolaire personnalisé pour les élèves du CP au CM2</p>
            <button className="btn-hero">COMMENCER MAINTENANT</button>
          </div>
        </section>

        {/* Blog-style section */}
        <section className="blog-section">
          <div className="blog-container">
            <div className="blog-content">
              <div className="blog-text">
                <h2>Un accompagnement personnalisé pour la réussite de votre enfant</h2>
                <p>Nos cours particuliers en primaire sont conçus pour aider chaque élève à progresser à son rythme. Avec une approche pédagogique adaptée et des professeurs qualifiés, nous assurons un suivi personnalisé pour garantir les meilleurs résultats.</p>
                <button className="btn-blog">Découvrir nos tarifs</button>
              </div>
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&crop=center" alt="Cours particuliers primaire" />
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
                <p>Des professeurs qualifiés et expérimentés pour accompagner votre enfant</p>
              </div>
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center" alt="Programme personnalisé" />
                </div>
                <h3>Programme personnalisé</h3>
                <p>Un apprentissage adapté aux besoins et au rythme de chaque enfant</p>
              </div>
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=center" alt="Suivi régulier" />
                </div>
                <h3>Suivi régulier</h3>
                <p>Un accompagnement constant pour garantir la progression</p>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
