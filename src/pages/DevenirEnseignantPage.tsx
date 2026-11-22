import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TeacherSignupFlow from '../components/TeacherSignupFlow'
import { asset } from '../lib/asset'
import './DemandePage.css'

const PERKS = [
  'Des missions près de chez vous',
  'Vous choisissez les propositions acceptées',
  'Rémunération par MTN MoMo ou Orange Money',
  'Un conseiller pédagogique à vos côtés',
]

export default function DevenirEnseignantPage() {
  return (
    <>
      <Navbar />
      <main className="dm-page">
        <div className="dm-wrap">
          <header className="dm-head">
            <span className="dm-eyebrow">Devenir enseignant</span>
            <h1>Rejoignez l’équipe pédagogique Kmertude</h1>
            <p>Étudiant du supérieur ou enseignant qualifié ? Créez votre dossier en quelques minutes : nous le vérifions puis vous proposons des missions adaptées.</p>
          </header>

          <div className="dm-grid">
            <section className="dm-card" aria-label="Inscription enseignant">
              <TeacherSignupFlow />
            </section>

            <aside className="dm-aside">
              <div className="dm-advisor">
                <img src={asset('/z.jpg')} alt="" loading="lazy" decoding="async" />
                <div>
                  <strong>Enseigner avec Kmertude</strong>
                  <span>Nous trouvons les élèves, vous vous concentrez sur les cours.</span>
                </div>
              </div>
              <ul className="dm-promises">
                {PERKS.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <div className="dm-phone">
                <span>Une question sur votre dossier ?</span>
                <a href="tel:+237622244994">+237 622 244 994</a>
                <small>Du lundi au samedi, de 8h à 19h</small>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
