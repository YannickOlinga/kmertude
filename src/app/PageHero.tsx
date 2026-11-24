import type { ReactNode } from 'react'

// Bandeau de titre des pages des espaces connectés (aplat violet)
export default function PageHero({ eyebrow = 'Espace famille', title, text, action }: {
  eyebrow?: string
  title: ReactNode
  text?: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="ch-hero">
      <div>
        <span className="ch-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {action}
    </section>
  )
}
