import './TestimonialSection.css'

export default function TestimonialSection() {
  return (
    <section className="testimonial-section">
      <div className="testimonial-header">
        <h2>Ils nous ont fait confiance</h2>
      </div>
      
      <div className="testimonials-container">
        <div className="testimonial-card">
          <div className="testimonial-header-info">
            <div className="reviewer-info">
              <span className="reviewer-name">Marie-Claire</span>
              <span className="review-date">il y a 2 jours</span>
            </div>
            <div className="trustpilot-info">
              <img src="/trustpilot-logo.png" alt="Trustpilot" className="trustpilot-logo" />
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
            </div>
          </div>
          <h3 className="testimonial-title">Super prof et super méthode</h3>
          <p className="testimonial-text">
            Ma fille est en Terminale et avait beaucoup de mal avec la philosophie. Nous avons trouvé un prof super compétent qui a su la mettre en confiance et lui donner une méthode. Les résultats sont là. Merci Kmertude !
          </p>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-header-info">
            <div className="reviewer-info">
              <span className="reviewer-name">Jean-Pierre</span>
              <span className="review-date">il y a 1 semaine</span>
            </div>
            <div className="trustpilot-info">
              <img src="/trustpilot-logo.png" alt="Trustpilot" className="trustpilot-logo" />
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
            </div>
          </div>
          <h3 className="testimonial-title">Excellente prise en charge</h3>
          <p className="testimonial-text">
            Mon fils en 3ème avait beaucoup de difficultés en mathématiques. Le prof que Kmertude nous a trouvé est patient et pédagogue. Les progrès sont visibles après seulement quelques semaines. Je recommande vivement !
          </p>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-header-info">
            <div className="reviewer-info">
              <span className="reviewer-name">Aïssatou</span>
              <span className="review-date">il y a 2 semaines</span>
            </div>
            <div className="trustpilot-info">
              <img src="/trustpilot-logo.png" alt="Trustpilot" className="trustpilot-logo" />
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
            </div>
          </div>
          <h3 className="testimonial-title">Stage de vacances réussi</h3>
          <p className="testimonial-text">
            Ma fille a suivi un stage de préparation au BEPC pendant les vacances. Le format intensif lui a beaucoup plu et elle se sent beaucoup plus confiante pour l'examen. Merci à l'équipe Kmertude !
          </p>
        </div>
      </div>
    </section>
  )
}
