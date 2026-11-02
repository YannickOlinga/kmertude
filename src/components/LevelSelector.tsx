import { useState } from 'react'
import './LevelSelector.css'

type Level = {
  id: string
  label: string
  intro: string
  points: string
  solutions: { title: string; text: string }[]
}

const LEVELS: Level[] = [
  {
    id: 'primaire',
    label: 'Primaire',
    intro: "On pose les fondamentaux : lecture, écriture et logique. L'envie d'apprendre se construit maintenant.",
    points: '+4 points',
    solutions: [
      { title: 'Cours particuliers', text: 'Un accompagnement sur-mesure, à domicile ou en ligne.' },
      { title: 'Soutien méthodologie', text: 'Apprendre à apprendre et gagner en autonomie.' },
      { title: 'Stages vacances', text: 'Consolider les acquis pendant les congés.' },
    ],
  },
  {
    id: 'college',
    label: 'Collège',
    intro: "De la 6e à la 3e, on structure le travail et on prépare sereinement le brevet.",
    points: '+4 points',
    solutions: [
      { title: 'Cours particuliers', text: 'Reprendre les bases et combler les lacunes.' },
      { title: 'Prépa Brevet', text: 'Un entraînement ciblé sur les épreuves du DNB.' },
      { title: 'Cours en groupe', text: 'Progresser à plusieurs, à prix réduit.' },
    ],
  },
  {
    id: 'lycee',
    label: 'Lycée',
    intro: "Seconde, Première, Terminale : chaque choix compte pour le bac et pour Parcoursup.",
    points: '+4 points',
    solutions: [
      { title: 'Spécialités', text: 'Un enseignant expert de chaque spécialité.' },
      { title: 'Prépa Bac & Grand oral', text: 'S’entraîner dans les conditions de l’examen.' },
      { title: 'Orientation Parcoursup', text: 'Construire un dossier solide et cohérent.' },
    ],
  },
  {
    id: 'superieur',
    label: 'Supérieur',
    intro: "Prépa, licence, concours : un cap exigeant qui demande méthode et régularité.",
    points: 'Réussite',
    solutions: [
      { title: 'Prépa concours', text: 'Un accompagnement intensif et personnalisé.' },
      { title: 'Soutien universitaire', text: 'Combler les écarts avec le rythme du supérieur.' },
      { title: 'Méthodologie', text: 'Organiser son travail et gérer la charge.' },
    ],
  },
  {
    id: 'adulte',
    label: 'Adulte',
    intro: "Reprise d'études, langues, reconversion : apprendre à tout âge, à votre rythme.",
    points: 'Objectifs',
    solutions: [
      { title: 'Langues', text: 'Progresser à l’oral comme à l’écrit.' },
      { title: 'Formations', text: 'Monter en compétences pour votre projet pro.' },
      { title: 'Cours en ligne', text: 'Des créneaux flexibles, où que vous soyez.' },
    ],
  },
]

export default function LevelSelector() {
  const [active, setActive] = useState(LEVELS[0].id)
  const level = LEVELS.find((l) => l.id === active) ?? LEVELS[0]

  return (
    <section className="km-levels" aria-labelledby="km-levels-title">
      <div className="km-levels-inner">
        <header className="km-levels-header">
          <h2 id="km-levels-title">Un accompagnement pour chaque niveau</h2>
          <span className="km-levels-underline" aria-hidden="true" />
        </header>

        <div className="km-levels-tabs" role="tablist" aria-label="Niveaux">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              role="tab"
              id={`km-tab-${l.id}`}
              aria-selected={active === l.id}
              aria-controls={`km-panel-${l.id}`}
              className={`km-levels-tab${active === l.id ? ' active' : ''}`}
              onClick={() => setActive(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div
          className="km-levels-panel"
          role="tabpanel"
          id={`km-panel-${level.id}`}
          aria-labelledby={`km-tab-${level.id}`}
        >
          <div className="km-levels-lead">
            <p className="km-levels-intro">{level.intro}</p>
            <span className="km-levels-badge">{level.points}</span>
          </div>

          <div className="km-levels-grid">
            {level.solutions.map((s) => (
              <article key={s.title} className="km-levels-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="km-levels-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
