import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { SearchFilters } from '../lib/savedSearches'
import RequestFlow from './RequestFlow'
import { asset } from '../lib/asset'
import './ProfileFormModal.css'

export type { Profile } from '../lib/teacherRequests'
import type { Profile } from '../lib/teacherRequests'

type Props = {
  profile: Profile
  initial?: Pick<SearchFilters, 'city' | 'level' | 'subjects'>
  onClose: () => void
}

const TITLES: Record<Profile, string> = {
  parent: 'Trouver le bon accompagnement pour votre enfant',
  eleve: 'Trouver le bon accompagnement pour vos cours',
  etudiant: 'Trouver le bon accompagnement pour vos études',
  adulte: 'Trouver la bonne formation pour vous',
}

export default function ProfileFormModal({ profile, initial, onClose }: Props) {
  const [navOffset, setNavOffset] = useState(0)

  // La popup démarre sous la navbar (sticky) pour ne pas la masquer ni être masquée par elle
  useLayoutEffect(() => {
    const nav = document.querySelector<HTMLElement>('.navbar')
    if (!nav) return
    const update = () => setNavOffset(Math.max(0, nav.getBoundingClientRect().bottom))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(nav)
    window.addEventListener('resize', update)
    return () => { observer.disconnect(); window.removeEventListener('resize', update) }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  // Rendu dans <body> : la popup échappe aux contextes d'empilement des sections (animations, z-index)
  return createPortal(
    <div className="pfm-backdrop" style={{ top: navOffset }} onClick={onClose} role="presentation">
      <div
        className="pfm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pfm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pfm-close" onClick={onClose} aria-label="Fermer">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>

        <img className="pfm-photo" src={asset('/h.jpg')} alt="" loading="lazy" decoding="async" />

        <div className="pfm-content">
          <h2 id="pfm-title">{TITLES[profile]}</h2>
          <p className="pfm-lead">
            Bénéficiez d’un <mark>bilan personnalisé</mark> en remplissant ce formulaire !
          </p>

          <RequestFlow initial={{ ...initial, profile }} profileChosen onCancel={onClose} />

          <div className="pfm-trust">
            <div className="pfm-trust-row">
              <span className="pfm-trust-brand">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#22c55e" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
                Trustpilot
              </span>
              <span className="pfm-trust-line" aria-hidden="true" />
              <span className="pfm-trust-score">4.5 <small>★</small></span>
            </div>
            <p>4.5/5 sur la base de nos premiers avis</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
