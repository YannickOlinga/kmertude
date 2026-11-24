// Session utilisateur : jetons JWT + utilisateur courant, persistés dans localStorage.
// POST /auth/login, POST /auth/refresh, GET /auth/me, POST /auth/logout
import { useSyncExternalStore } from 'react'
import { api, ApiError, registerAuthHooks } from './api'

export type UserType = 'famille' | 'enseignant' | 'administrateur'

export type User = {
  id: number
  username: string
  email: string
  phone: string | null
  first_name: string | null
  last_name: string | null
  user_type: UserType
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  full_name: string
}

type Session = { accessToken: string; refreshToken: string; user: User }
type AuthResponse = {
  access_token: string
  refresh_token: string
  user: Pick<User, 'id' | 'username' | 'email' | 'user_type'> & Partial<User>
}

const STORAGE_KEY = 'kmertude:session'
const listeners = new Set<() => void>()

let current: Session | null = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
})()

function setSession(next: Session | null) {
  current = next
  try {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // stockage indisponible : la session reste en mémoire
  }
  listeners.forEach((l) => l())
}

export const getSession = () => current

// Un seul refresh à la fois, même si plusieurs requêtes reçoivent un 401 en parallèle
let refreshing: Promise<string | undefined> | null = null
async function refresh(): Promise<string | undefined> {
  if (!current) return undefined
  refreshing ??= api<{ access_token: string; refresh_token: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: current.refreshToken }),
  })
    .then((t) => {
      if (current) setSession({ ...current, accessToken: t.access_token, refreshToken: t.refresh_token })
      return t.access_token
    })
    .catch(() => {
      setSession(null)
      return undefined
    })
    .finally(() => { refreshing = null })
  return refreshing
}

registerAuthHooks({ getToken: () => current?.accessToken, refresh })

// Après login/register : on récupère le profil complet via /auth/me
async function openSession(res: AuthResponse) {
  const me = await api<User>('/auth/me', { token: res.access_token })
  setSession({ accessToken: res.access_token, refreshToken: res.refresh_token, user: me })
  return me
}

export async function login(usernameOrEmail: string, password: string) {
  try {
    const res = await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username_or_email: usernameOrEmail.trim(), password }),
    })
    return await openSession(res)
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) throw new ApiError(401, 'Identifiant ou mot de passe incorrect.')
    throw e
  }
}

export type FamilleRegistration = {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  nombre_enfants: number
}

export async function registerFamille(data: FamilleRegistration) {
  const res = await api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, user_type: 'famille' }),
  })
  return openSession(res)
}

// Inscription enseignant courte (écran 1B) : le dossier (zones, Mobile Money, documents) se complète ensuite
export type EnseignantRegistration = Omit<FamilleRegistration, 'nombre_enfants'> & {
  specialites: string
  niveau_etudes: string
  tarif_horaire: number
}
export async function registerEnseignant(data: EnseignantRegistration) {
  const res = await api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, user_type: 'enseignant' }),
  })
  return openSession(res)
}

// Ouvre une session à partir d'une inscription déjà faite ailleurs (ex. dossier enseignant)
export const adoptSession = (res: AuthResponse) => openSession(res)

export async function refreshMe() {
  if (!current) return null
  const me = await api<User>('/auth/me', { auth: true })
  if (current) setSession({ ...current, user: me })
  return me
}

export function updateStoredUser(user: User) {
  if (current) setSession({ ...current, user })
}

export async function logout() {
  try {
    if (current) await api('/auth/logout', { method: 'POST', auth: true })
  } catch {
    // jeton expiré ou serveur injoignable : on déconnecte localement quand même
  }
  setSession(null)
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useSession() {
  return useSyncExternalStore(subscribe, () => current)
}

export const HOME_BY_ROLE: Record<UserType, string> = {
  famille: '/client',
  enseignant: '/enseignant',
  administrateur: '/admin',
}

export const displayName = (u: User) => u.full_name?.trim() || [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username
export const ROLE_LABEL: Record<UserType, string> = { famille: 'Parent / Apprenant', enseignant: 'Enseignant', administrateur: 'Administrateur' }
