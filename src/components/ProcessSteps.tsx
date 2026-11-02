import { asset } from '../lib/asset'
import './ProcessSteps.css'

type Step = { n: string; title: string; text: string }

const STEPS: Step[] = [
  {
    n: '1',
    title: 'Un bilan personnalisé',
    text: "Gratuit et sans engagement, pour cerner les besoins et les objectifs de votre enfant.",
  },
  {
    n: '2',
    title: 'Une proposition adaptée',
    text: "Votre conseiller vous présente l'accompagnement le mieux adapté à votre situation.",
  },
  {
    n: '3',
    title: 'La mise en relation sous 72h',
    text: "Nous vous présentons l'enseignant sélectionné selon le profil de votre enfant.",
  },
  {
    n: '4',
    title: 'Un suivi régulier',
    text: "Des points d'étape réguliers pour mesurer les progrès et ajuster l'accompagnement.",
  },
]

export default function ProcessSteps() {
  return (
    <section className="km-process" aria-labelledby="km-process-title">
      <div className="km-process-inner">
        <aside className="km-process-aside">
          <img
            className="km-process-photo"
            src={asset('/j.jpg')}
            alt="Une conseillère pédagogique Kmertude à votre écoute"
            loading="lazy"
            decoding="async"
          />
          <div className="km-process-callout">
            <p className="km-process-note">400 conseillers à votre écoute</p>
            <h2 id="km-process-title">Comment se déroule votre accompagnement&nbsp;?</h2>
            <a className="km-process-phone" href="tel:+237600000000">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2z"
                  fill="currentColor"
                />
              </svg>
              Échanger avec un conseiller
            </a>
          </div>
        </aside>

        <ol className="km-process-steps">
          {STEPS.map((step) => (
            <li key={step.n} className="km-process-step">
              <span className="km-process-num" aria-hidden="true">{step.n}</span>
              <div className="km-process-step-body">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
