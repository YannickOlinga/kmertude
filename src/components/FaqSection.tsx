import { useState } from 'react'
import './FaqSection.css'

type Qa = { q: string; a: string }

const FAQ: Qa[] = [
  {
    q: 'Combien coûtent les cours et puis-je bénéficier d’un avantage fiscal ?',
    a: "Le tarif dépend du niveau et de la formule choisie. Les cours à domicile ouvrent droit à un crédit d'impôt de 50 % des sommes engagées : vous ne payez réellement que la moitié du prix.",
  },
  {
    q: 'Suis-je engagé sur une durée minimale ?',
    a: "Non. Nos accompagnements sont flexibles et sans engagement de durée. Vous ajustez le rythme et le volume de cours selon les besoins de votre enfant.",
  },
  {
    q: 'Sous combien de temps mon enfant commence-t-il ses cours ?',
    a: "Après votre bilan avec un conseiller, nous vous mettons en relation avec un enseignant sélectionné sous 72 heures en moyenne.",
  },
  {
    q: 'Comment sont choisis vos enseignants ?',
    a: "Chaque enseignant justifie d'un diplôme de niveau bac+3 minimum et a réussi nos entretiens de sélection et mises en situation, qui évaluent ses connaissances, ses aptitudes pédagogiques et sa motivation.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="km-faq" aria-labelledby="km-faq-title">
      <div className="km-faq-inner">
        <header className="km-faq-header">
          <h2 id="km-faq-title">Vos questions, nos réponses</h2>
          <span className="km-faq-underline" aria-hidden="true" />
        </header>

        <ul className="km-faq-list">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={i} className={`km-faq-item${isOpen ? ' open' : ''}`}>
                <button
                  type="button"
                  className="km-faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`km-faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="km-faq-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`km-faq-a-${i}`}
                  className="km-faq-a"
                  role="region"
                  aria-labelledby={`km-faq-q-${i}`}
                  hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
