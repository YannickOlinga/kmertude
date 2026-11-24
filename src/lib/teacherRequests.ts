import type { SearchFilters } from './savedSearches'
import { api } from './api'

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

// Numéro mobile camerounais : 9 chiffres commençant par 6, indicatif +237 facultatif
// (même règle que normalize_cameroon_phone_number côté backend)
export const isValidPhone = (phone: string) => /^(\+?237)?6\d{8}$/.test(phone.replace(/[\s.-]/g, ''))
export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim())

// Correspondances front → enums du backend (ProspectLeadConseillerCreate)
const PROFIL_API: Record<Profile, 'parent' | 'eleve_adulte'> = {
  parent: 'parent',
  eleve: 'eleve_adulte',
  etudiant: 'eleve_adulte',
  adulte: 'eleve_adulte',
}
const MODALITE_API: Record<Format, string> = { domicile: 'presentiel', 'en-ligne': 'en_ligne', stage: 'presentiel' }
const CRENEAU_API = ['immediat', 'matin', 'midi', 'apres_midi', 'soir']

type LeadResponse = { id: number; created_at: string }

// Demande publique sans compte : POST /leads/conseiller
export async function saveRequest(request: TeacherRequest): Promise<StoredRequest> {
  const cycle = LEVELS[request.profile].find((g) => g.options.includes(request.level))?.group
  const lead = await api<LeadResponse>('/leads/conseiller', {
    method: 'POST',
    body: JSON.stringify({
      prenom: request.firstName.trim(),
      nom: request.lastName.trim(),
      telephone: request.phone,
      email: request.email.trim() || null,
      profil: PROFIL_API[request.profile],
      creneau_rappel: CRENEAU_API[CALLBACK_SLOTS.indexOf(request.callbackSlot)] ?? null,
      message: request.format === 'stage' ? 'Souhaite un stage en petit groupe.' : null,
      prenom_eleve: request.childFirstName.trim() || null,
      modalite: MODALITE_API[request.format],
      ville: request.format === 'en-ligne' ? null : request.city.trim() || null,
      cycle: cycle ?? null,
      classe_niveau: request.level,
      matieres: request.subjects.join(', '),
      objectif_principal: request.goal || null,
      rythme: request.frequency || null,
    }),
  })
  return { ...request, reference: `KM-${lead.id}`, createdAt: Date.parse(lead.created_at) || Date.now() }
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
