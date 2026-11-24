import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { HOME_BY_ROLE, useSession, type UserType } from '../lib/session'

// Protège une page : redirige vers /login si non connecté, ou vers l'espace du bon rôle.
export default function RequireAuth({ role, children }: { role?: UserType; children: ReactNode }) {
  const session = useSession()
  const { pathname, search } = useLocation()
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(pathname + search)}`} replace />
  if (role && session.user.user_type !== role) return <Navigate to={HOME_BY_ROLE[session.user.user_type]} replace />
  return <>{children}</>
}
