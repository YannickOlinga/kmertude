// Petits composants partagés par les espaces client / enseignant / admin
import { useState, type ReactNode } from 'react'

export type Tone = 'ok' | 'wn' | 'er' | undefined
export type Status = { label: string; tone?: 'ok' | 'warn' | 'wn' | 'er' }

export function Bd({ s }: { s: Status | undefined }) {
  if (!s) return null
  const tone = s.tone === 'warn' ? 'wn' : s.tone
  return <span className={`ks-bd ${tone ?? ''}`}>{s.label}</span>
}

export function Alert({ tone, children }: { tone: 'ok' | 'wn' | 'er'; children: ReactNode }) {
  return <div className={`ks-al ${tone}`} role={tone === 'er' ? 'alert' : 'status'}>{children}</div>
}

export function Loadable({ loading, error, empty, emptyText, onRetry, children }: {
  loading: boolean
  error: string
  empty?: boolean
  emptyText?: string
  onRetry?: () => void
  children: ReactNode
}) {
  if (loading) return <p className="ks-state" role="status">Chargement…</p>
  if (error) {
    return (
      <p className="ks-state err" role="alert">
        {error} {onRetry && <button type="button" className="ks-btn sm" onClick={onRetry}>Réessayer</button>}
      </p>
    )
  }
  if (empty) return <p className="ks-state">{emptyText ?? 'Rien à afficher pour le moment.'}</p>
  return <>{children}</>
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="ks-ov" onClick={onClose}>
      <div className="ks-sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}

export function Seg<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="ks-seg" role="radiogroup">
      {options.map(([v, l]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  )
}

export const OTHER = 'Autre (à préciser)'

// Liste déroulante avec dernière option « Autre (à préciser) » qui révèle un champ texte.
// value contient la valeur finale (option choisie ou texte saisi).
export function SelectOther({ label, options, value, onChange, other = true, placeholder = 'Choisir…' }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  other?: boolean
  placeholder?: string
}) {
  const isOther = other && value !== '' && !options.includes(value)
  const [otherMode, setOtherMode] = useState(isOther)
  return (
    <label className="ks-f">
      {label}
      <select
        value={otherMode ? OTHER : value}
        onChange={(e) => {
          if (e.target.value === OTHER) { setOtherMode(true); onChange('') }
          else { setOtherMode(false); onChange(e.target.value) }
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
        {other && <option value={OTHER}>{OTHER}</option>}
      </select>
      {otherMode && <input className="oth" placeholder="Précisez…" value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="ks-f">{label}{children}</label>
}

export const Msg = ({ ok, error }: { ok?: string; error?: string }) => (
  <>
    {error && <p className="ks-err" role="alert">{error}</p>}
    {ok && <p className="ks-okmsg" role="status">{ok}</p>}
  </>
)
