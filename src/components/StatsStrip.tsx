import './StatsStrip.css'

const STATS = [
  { value: '+2 000', label: 'élèves accompagnés' },
  { value: '+350', label: 'enseignants qualifiés' },
  { value: '96 %', label: 'de familles satisfaites' },
  { value: '10', label: 'villes au Cameroun' },
]

export default function StatsStrip() {
  return (
    <section className="km-stats" aria-label="Kmertude en chiffres">
      <div className="km-stats-inner">
        <p className="km-stats-title">Le soutien scolaire qui fait progresser, partout au Cameroun</p>
        <ul className="km-stats-list">
          {STATS.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
