import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { displayName, logout, useSession, type UserType } from '../lib/session'
import './app.css'

const NAV: Record<UserType, [string, string][]> = {
  famille: [['/client', 'Accueil'], ['/client/demande', 'Demande'], ['/client/missions', 'Missions'], ['/client/factures', 'Factures']],
  enseignant: [['/enseignant', 'Accueil'], ['/enseignant/dossier', 'Dossier'], ['/enseignant/propositions', 'Propositions'], ['/enseignant/seance', 'Séance'], ['/enseignant/gains', 'Gains']],
  administrateur: [['/admin', 'Cockpit'], ['/admin/demandes', 'Demandes'], ['/admin/finance', 'Finance']],
}
const ROOTS = ['/client', '/enseignant', '/admin']

function UserBox() {
  const session = useSession()
  const navigate = useNavigate()
  if (!session) return null
  return (
    <div className="ks-user">
      <Link to="/profil">{displayName(session.user)}</Link>
      <button type="button" className="ks-btn sm" onClick={async () => { await logout(); navigate('/login', { replace: true }) }}>
        Déconnexion
      </button>
    </div>
  )
}

// Gabarit des espaces connectés : onglets en haut (desktop), barre en bas (mobile), sidebar (admin)
export default function AppShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  const session = useSession()
  const role = session?.user.user_type ?? 'famille'
  const links = NAV[role].map(([to, label]) => (
    <NavLink key={to} to={to} end={ROOTS.includes(to)} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
  ))
  const brand = <Link to="/" className="ks-brand">Kmer<span>tude</span></Link>

  if (role === 'administrateur') {
    return (
      <div className="ks ks-admin">
        <aside className="ks-side" aria-label="Back-office">
          {brand}
          <strong className="ks-sm ks-mu">Back-office</strong>
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
