
import './hero.css'

export default function Hero() {
  return (
    <section className="hero-section">
        <div className="herocontainer">
      <div className="toptext">
        <h1>Apprenez à votre rythme avec <span>Kmertude</span> </h1> 
      </div>
      <div className="bottomtext">
        <div className="tab-selector">
            <button className="tab-button active">Cours particuliers</button>
            <button className="tab-button">Stages intensifs</button>
          </div>
          <div className="form-container">
            <input type="text" placeholder="Lieu des cours*" className="form-input" />
            <select className="form-input">
              <option value="">Classe*</option>
              <option value="SIL">SIL</option>
              <option value="SIL">CP</option>
              <option value="SIL">CE1</option>
              <option value="SIL">CE2</option>
              <option value="SIL">CM1</option>
              <option value="SIL">CM2</option>
              <option value="SIL">6e</option>
              <option value="SIL">5e</option>
              <option value="SIL">4e</option>
              <option value="SIL">3e</option>
              <option value="SIL">2ND</option>
              <option value="SIL">1er</option>
            </select>
            <button className="submit-button"><p className='button_text'>VOIR MON TARIF</p></button>
          </div>
      </div>
      </div>
    </section>
  )
}
