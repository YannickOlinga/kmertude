import './FormSection.css'

export default function FormSection() {
  return (
    <section className="form-section">
      <div className="form-section-header">
        <h2>Découvrir l'offre Complétude !</h2>
      </div>
      <div className="cards-container">
        <div className="service-card">
          <img src="../../public/d.jpg" alt="Cours Particuliers" />
          <h3>COURS PARTICULIERS</h3>
          <p>Avancer en confiance et à son rythme avec son prof particulier dès la rentrée, ça fait toute la différence pour réussir son année. En avant pour les progrès !</p>
          <button className="button primary">VOIR MON TARIF</button>
        </div>

        <div className="service-card">
          <img src="../../public/a.jpg" alt="Stages d'Hiver" />
          <h3>STAGES D'HIVER</h3>
          <p>Réviser pendant les vacances de février avec un prof, en voilà une bonne idée pour se remettre à niveau ou réussir son contrôle continu pour les enseignements de spécialité !</p>
          <div className="button-group">
              <button className="button primary">VOIR MON TARIF</button>
      </div>
        </div>

        <div className="service-card">
          <img src="../../public/e.jpg" alt="Stages de Printemps" />
          <h3>STAGES DE PRINTEMPS</h3>
          <p>Entre 3 et 5 jours pour désamorcer les sujets difficiles et poser toutes ses questions, c'est efficace pour réussir les épreuves finales de français, les enseignements de spécialité et la philo !</p>
          <div className="button-group">
             <button className="button primary">VOIR MON TARIF</button>
      </div>
        </div>
      </div>
    </section>
  )
}
