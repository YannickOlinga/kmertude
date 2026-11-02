import './StatsStrip.css'

export default function StatsStrip() {
  return (
    <section className="km-stats" aria-label="Conseil pour réussir">
      <div className="km-stats-inner">
        <div className="km-stats-card">
          <span className="km-stats-eyebrow">Pour réussir vos études</span>
          <p className="km-stats-text">
            La clé du succès, c'est la <strong>régularité</strong> : révisez chaque jour plutôt que de tout faire la veille des examens, et n'hésitez pas à demander de l'aide quand vous bloquez.
          </p>
          <div className="km-stats-footer">
            <span className="km-stats-icon">💡</span>
            <span className="km-stats-sub">Un accompagnement adapté change tout</span>
          </div>
        </div>
      </div>
    </section>
  )
}
