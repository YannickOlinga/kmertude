import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearSearches,
  relativeDate,
  removeSearch,
  searchChips,
  searchTitle,
  useSavedSearches,
  type SavedSearch,
} from '../lib/savedSearches'
import './SavedSearchesMenu.css'

export default function SavedSearchesMenu() {
  const searches = useSavedSearches()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  const relaunch = (s: SavedSearch) => {
    setOpen(false)
    navigate(`/?relaunch=${s.id}`)
  }

  return (
    <div className="ssm" ref={ref}>
      <button
        type="button"
        className={`ssm-trigger${open ? ' open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>Mes recherches</span>
        {searches.length > 0 && <span className="ssm-badge">{searches.length}</span>}
      </button>

      {open && (
        <div className="ssm-panel" role="menu" aria-label="Mes recherches">
          <div className="ssm-head">
            <strong>Mes recherches</strong>
            {searches.length > 0 && (
              <button type="button" className="ssm-clear" onClick={clearSearches}>Tout effacer</button>
            )}
          </div>

          {searches.length === 0 ? (
            <p className="ssm-empty">
              Aucune recherche enregistrée. Lancez une recherche depuis l’accueil, elle apparaîtra ici avec ses filtres.
            </p>
          ) : (
            <ul className="ssm-list">
              {searches.map((s) => (
                <li key={s.id} className="ssm-item">
                  <button type="button" className="ssm-item-main" onClick={() => relaunch(s)} role="menuitem">
                    <span className="ssm-item-title">{searchTitle(s)}</span>
                    <span className="ssm-chips">
                      {searchChips(s).map((chip) => (
                        <span key={chip} className="ssm-chip">{chip}</span>
                      ))}
                    </span>
                    <span className="ssm-date">{relativeDate(s.createdAt)}</span>
                  </button>
                  <button
                    type="button"
                    className="ssm-remove"
                    aria-label="Supprimer cette recherche"
                    onClick={() => removeSearch(s.id)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
