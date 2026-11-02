import './SubjectsSection.css'

type Subject = { label: string; emoji: string }

const SUBJECTS: Subject[] = [
  { label: 'Mathématiques', emoji: '➗' },
  { label: 'Français', emoji: '📖' },
  { label: 'Anglais', emoji: '🇬🇧' },
  { label: 'Physique-Chimie', emoji: '⚗️' },
  { label: 'SVT', emoji: '🧬' },
  { label: 'Histoire-Géo', emoji: '🗺️' },
  { label: 'Philosophie', emoji: '💭' },
  { label: 'Espagnol', emoji: '🇪🇸' },
  { label: 'SES', emoji: '📊' },
  { label: 'Méthodologie', emoji: '🎯' },
  { label: 'Informatique', emoji: '💻' },
  { label: 'Allemand', emoji: '🇩🇪' },
]

export default function SubjectsSection() {
  return (
    <section className="km-subjects" aria-labelledby="km-subjects-title">
      <div className="km-subjects-inner">
        <header className="km-subjects-header">
          <h2 id="km-subjects-title">Toutes les matières, tous les niveaux</h2>
          <p>Un enseignant expert pour chaque discipline, du primaire au supérieur.</p>
        </header>

        <div className="km-subjects-grid">
          {SUBJECTS.map((s) => (
            <a key={s.label} href="#km-academia-title" className="km-subjects-card">
              <span className="km-subjects-emoji" aria-hidden="true">{s.emoji}</span>
              <span className="km-subjects-label">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
