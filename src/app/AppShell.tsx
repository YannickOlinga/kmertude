import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { displayName, logout, useSession, type UserType } from '../lib/session'
import { Icon, type IconName } from './icons'
import './app.css'

const NAV: Record<UserType, [string, string, IconName][]> = {
  famille: [['/client', 'Accueil', 'home'], ['/client/demande', 'Demande', 'plus'], ['/client/missions', 'Missions', 'book'], ['/client/factures', 'Factures', 'receipt']],
  enseignant: [
    ['/enseignant', 'Accueil', 'home'], ['/enseignant/dossier', 'Dossier', 'folder'], ['/enseignant/propositions', 'Propositions', 'inbox'],
    ['/enseignant/seance', 'Séance', 'pen'], ['/enseignant/gains', 'Gains', 'wallet'],
  ],
  administrateur: [['/admin', 'Cockpit', 'chart'], ['/admin/demandes', 'Demandes', 'list'], ['/admin/finance', 'Finance', 'wallet']],
}
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?'
const ROOTS = ['/client', '/enseignant', '/admin']

function UserBox() {
  const session = useSession()
  const navigate = useNavigate()
  if (!session) return null
  const name = displayName(session.user)
  return (
    <div className="ks-user">
      <Link to="/profil" title="Mon profil">
        <span className="ks-avatar" aria-hidden="true">{initials(name)}</span>
        <span className="ks-uname">{name}</span>
      </Link>
      <button type="button" className="ks-logout" title="Déconnexion" aria-label="Déconnexion"
        onClick={async () => { await logout(); navigate('/login', { replace: true }) }}>
        <Icon name="logout" />
      </button>
    </div>
  )
}

// Gabarit des espaces connectés : onglets en haut (desktop), barre en bas (mobile), sidebar (admin)
export default function AppShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  const session = useSession()
  const role = session?.user.user_type ?? 'famille'
  const links = NAV[role].map(([to, label, icon]) => (
    <NavLink key={to} to={to} end={ROOTS.includes(to)} className={({ isActive }) => (isActive ? 'active' : '')}>
      <Icon name={icon} />
      <span>{label}</span>
    </NavLink>
  ))
  const brand = <Link to="/" className="ks-brand">Kmer<span>tude</span></Link>

  if (role === 'administrateur') {
    return (
      <div className="ks ks-admin">
        <aside className="ks-side" aria-label="Back-office">
          {brand}
          <span className="ks-side-tag">Back-office</span>
          {links}
          <UserBox />
        </aside>
        <div className="ks-content"><main className="ks-main wide">{children}</main></div>
      </div>
    )
  }

  return (
    <div className="ks">
      <header className="ks-top">
        {brand}
        <nav className="ks-tabs" aria-label="Navigation principale">{links}</nav>
        <UserBox />
      </header>
      <main className={`ks-main ${wide ? 'wide' : ''}`}>{children}</main>
      <nav className="ks-bottom" aria-label="Navigation">{links}</nav>
    </div>
  )
}
