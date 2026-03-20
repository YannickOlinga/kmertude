import './FormSection.css'

export default function FormSection() {
  return (
    <section className="form-section">
      <div className="form-section-header">
        <h2>Découvrir l'offre Kmertude !</h2>
      </div>
      <div className="cards-container">
        <div className="service-card">
          <img src="../../public/d.jpg" alt="Cours Particuliers" />
          <h3>COURS PARTICULIERS</h3>
          <p>Avancer en confiance et à son rythme avec son prof particulier dès la rentrée, ça fait toute la différence pour réussir son année scolaire au Cameroun. En avant pour les progrès !</p>
          <button className="button primary">VOIR MON TARIF</button>
        </div>

        <div className="service-card">
          <img src="../../public/a.jpg" alt="Stages d'Hiver" />
          <h3>STAGES DE VACANCES</h3>
          <p>Réviser pendant les vacances avec un prof, en voilà une bonne idée pour se remettre à niveau ou réussir ses contrôles continus et préparer les examens camerounais !</p>
          <div className="button-group">
              <button className="button primary">VOIR MON TARIF</button>
      </div>
        </div>

        <div className="service-card">
          <img src="../../public/e.jpg" alt="Stages de Printemps" />
          <h3>STAGES INTENSIFS</h3>
          <p>Entre 3 et 5 jours pour désamorcer les sujets difficiles et poser toutes ses questions, c'est efficace pour réussir les épreuves finales du BEPC, Probatoire et Baccalauréat !</p>
          <div className="button-group">
             <button className="button primary">VOIR MON TARIF</button>
      </div>
        </div>
      </div>
    </section>
  )
}
