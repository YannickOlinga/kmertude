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
        className="pfm-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pfm-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hors de la zone qui défile : la croix reste visible en permanence */}
        <button type="button" className="pfm-close" onClick={onClose} aria-label="Fermer" title="Fermer">
          <span className="pfm-x" aria-hidden="true" />
        </button>
        <div className="pfm-dialog">

        <img className="pfm-photo" src={asset('/h.jpg')} alt="" loading="lazy" decoding="async" />

        <div className="pfm-content">
          <h2 id="pfm-title">{TITLES[profile]}</h2>
          <p className="pfm-lead">
            Bénéficiez d’un <mark>bilan personnalisé</mark> en remplissant ce formulaire !
          </p>

          <RequestFlow initial={{ ...initial, profile }} profileChosen onCancel={onClose} />
        </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
