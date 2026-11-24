// Client HTTP du backend FastAPI (repo plateforme-educative-backend).
// L'URL vient de VITE_API_URL (.env.development / .env.production), préfixe /api/v1 inclus.
const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// FastAPI renvoie { detail: "..." } ou, pour une erreur de validation (422),
// { detail: [{ loc: [...], msg: "..." }] }
function readDetail(body: unknown): string {
  const detail = (body as { detail?: unknown })?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((d: { loc?: (string | number)[]; msg?: string }) => {
        const field = d.loc?.filter((l) => l !== 'body').join('.')
        return field ? `${field} : ${d.msg}` : d.msg
      })
      .join(' · ')
  }
  return ''
}

// Fournisseur de jeton enregistré par lib/session (évite un import circulaire).
type AuthHooks = { getToken: () => string | undefined; refresh: () => Promise<string | undefined> }
let authHooks: AuthHooks | null = null
export const registerAuthHooks = (hooks: AuthHooks) => { authHooks = hooks }

type ApiInit = RequestInit & {
  token?: string
  // true : ajoute le jeton de la session courante et retente une fois après refresh sur 401
  auth?: boolean
  query?: Record<string, string | number | boolean | null | undefined>
}

const buildUrl = (path: string, query?: ApiInit['query']) => {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  const s = qs.toString()
  return `${BASE}${path}${s ? `?${s}` : ''}`
}

async function rawFetch(path: string, init: ApiInit, token: string | undefined): Promise<Response> {
  // token / auth sont propres à ce client : on ne les transmet pas à fetch
  const { headers, query, ...rest } = init
  delete (rest as ApiInit).token
  delete (rest as ApiInit).auth
  try {
    return await fetch(buildUrl(path, query), {
      ...rest,
      headers: {
        ...(rest.body instanceof FormData || rest.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    })
  } catch {
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.')
  }
}

async function send(path: string, init: ApiInit): Promise<Response> {
  const token = init.token ?? (init.auth ? authHooks?.getToken() : undefined)
  let res = await rawFetch(path, init, token)
  if (res.status === 401 && init.auth && !init.token && authHooks) {
    const fresh = await authHooks.refresh()
    if (fresh) res = await rawFetch(path, init, fresh)
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, readDetail(body) || `Erreur serveur (${res.status}).`)
  }
  return res
}

export async function api<T>(path: string, init: ApiInit = {}): Promise<T> {
  const res = await send(path, init)
  if (res.status === 204) return null as T
  return (await res.json().catch(() => null)) as T
}

// Téléchargement authentifié (ex. documents enseignants) : renvoie le fichier en Blob
export async function apiBlob(path: string, init: ApiInit = {}): Promise<Blob> {
  const res = await send(path, init)
  return res.blob()
}
