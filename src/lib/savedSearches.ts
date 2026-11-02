import { useSyncExternalStore } from 'react'

export type SearchFilters = {
  profile?: 'parent' | 'eleve' | 'etudiant' | 'adulte'
  offerType?: 'individual' | 'group'
  city?: string
  level?: string
  subjects?: string[]
}

export type SavedSearch = SearchFilters & {
  id: string
  createdAt: number
}

const STORAGE_KEY = 'kmertude:savedSearches'
const MAX_ITEMS = 10
const listeners = new Set<() => void>()
let cache: SavedSearch[] | null = null

function read(): SavedSearch[] {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as SavedSearch[]) : []
  } catch {
    cache = []
  }
  return cache
}

function write(next: SavedSearch[]) {
  cache = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

function normalize(f: SearchFilters): SearchFilters {
  return {
    profile: f.profile,
    offerType: f.offerType,
    city: f.city?.trim() || undefined,
    level: f.level || undefined,
    subjects: f.subjects?.length ? [...f.subjects].sort() : undefined,
  }
}

function sameFilters(a: SearchFilters, b: SearchFilters) {
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b))
}

export function saveSearch(filters: SearchFilters): SavedSearch {
  const clean = normalize(filters)
  const existing = read().find((s) => sameFilters(s, clean))
  const item: SavedSearch = { ...clean, id: existing?.id ?? crypto.randomUUID(), createdAt: Date.now() }
  write([item, ...read().filter((s) => s.id !== item.id)].slice(0, MAX_ITEMS))
  return item
}

export function removeSearch(id: string) {
  write(read().filter((s) => s.id !== id))
}

export function clearSearches() {
  write([])
}

export function getSearch(id: string) {
  return read().find((s) => s.id === id)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) { cache = null; listener() }
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}

const EMPTY: SavedSearch[] = []

export function useSavedSearches() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export const PROFILE_LABELS: Record<NonNullable<SearchFilters['profile']>, string> = {
  parent: 'Parent',
  eleve: 'Élève',
  etudiant: 'Étudiant',
  adulte: 'Adulte',
}

export const OFFER_LABELS: Record<NonNullable<SearchFilters['offerType']>, string> = {
  individual: 'Cours particuliers',
  group: 'Stages intensifs',
}

export function searchTitle(s: SearchFilters) {
  const parts = [s.offerType && OFFER_LABELS[s.offerType], s.level, s.city].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Recherche'
}

export function searchChips(s: SearchFilters) {
  return [
    s.profile && PROFILE_LABELS[s.profile],
    s.offerType && OFFER_LABELS[s.offerType],
    s.city,
    s.level,
    ...(s.subjects ?? []),
  ].filter((x): x is string => Boolean(x))
}

export function toSearchParams(s: SearchFilters) {
  const p = new URLSearchParams()
  if (s.profile) p.set('profile', s.profile)
  if (s.offerType) p.set('offer', s.offerType)
  if (s.city) p.set('city', s.city)
  if (s.level) p.set('level', s.level)
  if (s.subjects?.length) p.set('subjects', s.subjects.join(','))
  return p
}

export function relativeDate(ts: number) {
  const diff = Date.now() - ts
  const m = Math.round(diff / 60000)
  if (m < 1) return 'à l’instant'
  if (m < 60) return `il y a ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `il y a ${h} h`
  const d = Math.round(h / 24)
  return d === 1 ? 'hier' : `il y a ${d} j`
}
