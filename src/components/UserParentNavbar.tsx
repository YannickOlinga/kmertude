import { NavLink } from 'react-router-dom'
import SavedSearchesMenu from './SavedSearchesMenu'
import './UserParentNavbar.css'

const links = [
  { to: '/user-parent', label: 'Tableau de bord' },
  { to: '/user-parent/offers', label: 'Mes offres' },
  { to: '/user-parent/teachers', label: 'Enseignants recrutés' },
  { to: '/user-parent/applications', label: 'Candidatures' },
  { to: '/user-parent/payments', label: 'Paiements' },
]

export default function UserParentNavbar() {
  return (
    <header className="parent-navbar">
      <div className="parent-navbar-inner">
        <a href="/" className="parent-brand">Kmertude Parent</a>
        <nav className="parent-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/user-parent'}
              className={({ isActive }) => `parent-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <SavedSearchesMenu />
      </div>
    </header>
  )
}
