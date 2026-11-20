import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RequestFlow from '../components/RequestFlow'
import { asset } from '../lib/asset'
import { requestFromParams } from '../lib/teacherRequests'
import './DemandePage.css'

const PROMISES = [
  'Bilan personnalisé offert',
  'Rappel gratuit par un conseiller',
  'Enseignant présenté sous 72 h',
  'Sans engagement',
]

export default function DemandePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initial = requestFromParams(params)

  return (
    <>
      <Navbar />
      <main className="dm-page">
        <div className="dm-wrap">
          <header className="dm-head">
            <span className="dm-eyebrow">Demande d’enseignant</span>
            <h1>Trouvons ensemble le bon enseignant</h1>
            <p>Répondez à quelques questions : un conseiller pédagogique vous rappelle avec un bilan et un devis personnalisés.</p>
          </header>

          <div className="dm-grid">
            <section className="dm-card" aria-label="Formulaire de demande">
              <RequestFlow initial={initial} onCancel={() => navigate(-1)} />
            </section>

            <aside className="dm-aside">
              <div className="dm-advisor">
                <img src={asset('/p.jpg')} alt="" loading="lazy" decoding="async" />
                <div>
                  <strong>Votre conseiller pédagogique</strong>
                  <span>vous accompagne de la demande jusqu’au premier cours.</span>
                </div>
              </div>
              <ul className="dm-promises">
                {PROMISES.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <div className="dm-phone">
                <span>Vous préférez nous appeler ?</span>
                <a href="tel:+237622244994">+237 622 244 994</a>
                <small>Du lundi au samedi, de 8h à 19h</small>
              </div>
              <div className="dm-rating">
                <strong>4,5/5</strong>
                <span aria-hidden="true">★★★★★</span>
                <small>sur la base de nos premiers avis</small>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
