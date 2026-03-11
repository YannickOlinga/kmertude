import './PourAdultes.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PourAdultes() {
  return (
    <>
      <Navbar />
      <div className="pour-adultes-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <div className="hero-content">
            <h1>Cours particuliers pour adultes</h1>
            <p>Formation continue et perfectionnement professionnel pour tous niveaux</p>
            <button className="btn-hero">COMMENCER MAINTENANT</button>
          </div>
        </section>

        {/* Blog-style section */}
        <section className="blog-section">
          <div className="blog-container">
            <div className="blog-content">
              <div className="blog-text">
                <h2>Un apprentissage adapté aux adultes professionnels</h2>
                <p>Nos cours particuliers pour adultes sont conçus pour répondre aux besoins spécifiques de la formation continue et du perfectionnement professionnel. Avec des formateurs experts et une approche flexible, nous vous aidons à atteindre vos objectifs professionnels et personnels.</p>
                <button className="btn-blog">Découvrir nos tarifs</button>
              </div>
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&crop=center" alt="Cours particuliers adultes" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <h2>Pourquoi choisir nos cours particuliers ?</h2>
            <p>Une méthode éprouvée qui a déjà aidé des milliers d'adultes à progresser</p>
            
            <div className="features-cards">
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center" alt="Formation continue" />
                </div>
                <h3>Formation continue</h3>
                <p>Des cours adaptés aux besoins professionnels des adultes</p>
              </div>
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center" alt="Flexibilité totale" />
                </div>
                <h3>Flexibilité totale</h3>
                <p>Horaires modulables selon vos disponibilités</p>
              </div>
              <div className="feature-card">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=center" alt="Experts métiers" />
                </div>
                <h3>Experts métiers</h3>
                <p>Des formateurs spécialisés dans chaque domaine professionnel</p>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
