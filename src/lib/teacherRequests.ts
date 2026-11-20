import type { SearchFilters } from './savedSearches'

export type Profile = NonNullable<SearchFilters['profile']>
export type Format = 'domicile' | 'en-ligne' | 'stage'

export type TeacherRequest = {
  profile: Profile
  format: Format
  city: string
  level: string
  subjects: string[]
  goal: string
  frequency: string
  firstName: string
  lastName: string
  childFirstName: string
  phone: string
  email: string
  callbackSlot: string
  consent: boolean
}

export type StoredRequest = TeacherRequest & { reference: string; createdAt: number }

export const PROFILES: { id: Profile; title: string; subtitle: string }[] = [
  { id: 'parent', title: 'Parent', subtitle: 'Je cherche des cours pour mon enfant' },
  { id: 'eleve', title: 'Élève', subtitle: 'Je cherche des cours pour moi' },
  { id: 'etudiant', title: 'Étudiant', subtitle: 'Je suis dans le supérieur' },
  { id: 'adulte', title: 'Adulte', subtitle: 'Je cherche des cours ou une formation' },
]

export const FORMATS: { id: Format; title: string; subtitle: string }[] = [
  { id: 'domicile', title: 'À domicile', subtitle: 'L’enseignant se déplace chez vous' },
  { id: 'en-ligne', title: 'En ligne', subtitle: 'Cours en visioconférence' },
  { id: 'stage', title: 'Stage en petit groupe', subtitle: 'Pendant les vacances ou avant un examen' },
]

const SCHOOL_LEVELS = [
  { group: 'Primaire', options: ['SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'] },
  { group: 'Collège', options: ['6e', '5e', '4e', '3e'] },
  { group: 'Lycée', options: ['2nde', '1ère', 'Tle'] },
]

export const LEVELS: Record<Profile, { group: string; options: string[] }[]> = {
  parent: SCHOOL_LEVELS,
  eleve: SCHOOL_LEVELS,
  etudiant: [{ group: 'Supérieur', options: ['Licence 1', 'Licence 2', 'Licence 3', 'Master', 'Prépa / Concours'] }],
  adulte: [{ group: 'Objectif', options: ['Remise à niveau', 'Langues', 'Informatique', 'Concours administratif'] }],
}

export const SUBJECTS = ['Mathématiques', 'Français', 'Anglais', 'Physique-Chimie', 'SVT', 'Histoire-Géo', 'Philosophie', 'Informatique', 'Aide aux devoirs', 'Autre']

export const GOALS = ['Combler des lacunes', 'Maintenir son niveau', 'Préparer un examen', 'Viser l’excellence']

export const FREQUENCIES = ['1h par semaine', '2h par semaine', '3h ou plus par semaine', 'Ponctuellement']

export const CALLBACK_SLOTS = ['Dès que possible', 'Matin (8h – 12h)', 'Midi (12h – 14h)', 'Après-midi (14h – 18h)', 'Soir (18h – 20h)']

export const EMPTY_REQUEST: TeacherRequest = {
  profile: 'parent',
  format: 'domicile',
  city: '',
  level: '',
  subjects: [],
  goal: '',
  frequency: '',
  firstName: '',
  lastName: '',
  childFirstName: '',
  phone: '',
  email: '',
  callbackSlot: CALLBACK_SLOTS[0],
  consent: false,
}

// Numéro camerounais : 9 chiffres commençant par 6 ou 2, indicatif +237 facultatif
export const isValidPhone = (phone: string) => /^(\+?237)?[26]\d{8}$/.test(phone.replace(/[\s.-]/g, ''))
export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim())

const STORAGE_KEY = 'kmertude:teacherRequests'

// Pas encore de backend : la demande est conservée localement sur l'appareil.
export function saveRequest(request: TeacherRequest): StoredRequest {
  const stored: StoredRequest = {
    ...request,
    reference: `KM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: Date.now(),
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? (JSON.parse(raw) as StoredRequest[]) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify([stored, ...list].slice(0, 20)))
  } catch {
    // stockage indisponible (navigation privée…) : la confirmation s'affiche quand même
  }
  return stored
}

const PROFILE_IDS = PROFILES.map((p) => p.id)

// Préremplit la demande à partir des paramètres d'URL (hero, pages niveaux, recherches enregistrées)
export function requestFromParams(params: URLSearchParams): Partial<TeacherRequest> {
  const out: Partial<TeacherRequest> = {}
  const profile = params.get('profile') as Profile | null
  if (profile && PROFILE_IDS.includes(profile)) out.profile = profile
  const offer = params.get('offer')
  if (offer === 'group') out.format = 'stage'
  if (offer === 'individual') out.format = 'domicile'
  const city = params.get('city')
  if (city) out.city = city
  const level = params.get('level')
  if (level) out.level = level
  const subjects = params.get('subjects')
  if (subjects) out.subjects = subjects.split(',').filter(Boolean)
  return out
}
