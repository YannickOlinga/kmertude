import { Link } from 'react-router-dom'
import { asset } from '../lib/asset'
import './TeacherSelectionSection.css'

const CRITERIA = [
  <>Pouvant justifier d’un diplôme <strong>de niveau bac+3 minimum</strong>.</>,
  <>
    Ayant passé avec succès nos entretiens de sélection et nos mises en situation, durant lesquels nous
    nous sommes assurés de ses connaissances, de <strong>ses aptitudes pédagogiques et de sa motivation</strong>.
  </>,
  <>Manifestant une <strong>véritable envie de transmettre</strong>.</>,
]

export default function TeacherSelectionSection() {
  return (
    <section className="km-teacher" aria-labelledby="km-teacher-title">
      <div className="km-teacher-inner">
        <header className="km-teacher-header">
          <h2 id="km-teacher-title">L’accompagnement Kmertude</h2>
          <span className="km-teacher-underline" aria-hidden="true" />
        </header>

        <div className="km-teacher-grid">
          <div className="km-teacher-copy">
            <h3>
              <mark>L’enseignant sélectionné</mark> selon vos besoins et le profil de votre enfant
            </h3>
            <p>
              Nous apportons le plus grand soin au recrutement de chacun de nos enseignants. Quelle que soit
              votre demande, nous nous engageons à vous proposer un enseignant :
            </p>
            <ul className="km-teacher-list">
              {CRITERIA.map((item, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#1f8fe0" strokeWidth="1.8" />
                    <path d="M8 12.5l2.5 2.5L16 9.5" fill="none" stroke="#1f8fe0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth?role=teacher" className="km-teacher-link">Découvrir nos enseignants</Link>
          </div>

          <img
            className="km-teacher-photo"
            src={asset('/g.jpg')}
            alt="Des élèves accompagnés par un enseignant Kmertude"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
