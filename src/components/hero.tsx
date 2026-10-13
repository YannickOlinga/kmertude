
import './hero.css'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero-section main-hero">
      {/* Vidéo en background */}
      <video 
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/public/12724010-uhd_4096_2160_60fps.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas les vidéos HTML5.
      </video>
      
      <div className="herocontainer">
        <div className="toptext">
          <h1>Devenez le prochain <span>Kmertude</span> qui excelle</h1>
          <p className="hero-subtitle">Rejoignez des milliers d'élèves camerounais qui excellent grâce à notre soutien scolaire de qualité</p>
        </div>
        <div className="bottomtext">
          <div className="tab-selector">
              <button className="tab-button active">Cours particuliers</button>
              <button className="tab-button">Stages intensifs</button>
            </div>
            <div className="form-container">
              <input name="city" type="text" placeholder="Votre ville*" className="form-input" autoComplete="address-level2" minLength={2} maxLength={100} required />
              <select name="schoolLevel" className="form-input" required>
                <option value="">Niveau scolaire*</option>
                <option value="SIL">SIL</option>
                <option value="CP">CP</option>
                <option value="CE1">CE1</option>
                <option value="CE2">CE2</option>
                <option value="CM1">CM1</option>
                <option value="CM2">CM2</option>
                <option value="6e">6e</option>
                <option value="5e">5e</option>
                <option value="4e">4e</option>
                <option value="3e">3e</option>
                <option value="2nd">2nd</option>
                <option value="1ere">1ère</option>
                <option value="Tle">Tle</option>
              </select>
              <button
                className="submit-button"
                type="button"
                onClick={() => navigate('/auth?role=parent')}
              >
                <p className='button_text'>VOIR MON TARIF</p>
              </button>
            </div>
        </div>
      </div>
    </section>
  )
}
