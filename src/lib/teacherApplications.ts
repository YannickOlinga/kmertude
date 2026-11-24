// Inscription enseignant — champs alignés sur le cahier des charges MVP :
// POST /auth/register (user_type ENSEIGNANT), POST /zones-intervention, PUT /coordonnees-paiement/me,
// POST /documents-enseignants/upload. Voir submitApplication en bas de fichier.
import { api } from './api'
import { adoptSession } from './session'

export type MomoOperator = 'mtn_momo' | 'orange_money'
export type DocumentType = 'cni' | 'diplome' | 'justificatif_etudes' | 'casier_judiciaire' | 'autre'

export type TeacherApplication = {
  first_name: string
  last_name: string
  email: string
  phone: string
  specialites: string[]
  niveaux_enseignes: string[]
  niveau_etudes: string
  tarif_horaire: string // saisi en texte, converti en entier FCFA à l'envoi
  ville: string
  ville_autre: string
  arrondissement: string
  quartier: string
  rayon_km: number
  operateur: MomoOperator
  numero_momo: string
  nom_titulaire_compte: string
  documents: Partial<Record<DocumentType, File>>
  username: string
  password: string
  consent: boolean
}

export const OTHER = 'Autre (à préciser)'

export const VILLES = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Limbe', 'Kribi', 'Ebolowa', OTHER]

export const SPECIALITES = ['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais', 'Allemand', 'Espagnol', 'Histoire-Géo', 'Philosophie', 'Informatique', 'Économie', 'Aide aux devoirs']

export const NIVEAUX_ENSEIGNES = ['Primaire', 'Collège', 'Lycée', 'Supérieur', 'Adultes']

export const NIVEAUX_ETUDES = ['Licence en cours', 'Licence', 'Master en cours', 'Master', 'Doctorat', 'Enseignant diplômé (ENS)', OTHER]

export const DOCUMENTS: { type: DocumentType; label: string; required: boolean }[] = [
  { type: 'cni', label: 'Carte nationale d’identité', required: true },
  { type: 'justificatif_etudes', label: 'Attestation ou certificat de scolarité', required: true },
  { type: 'diplome', label: 'Dernier diplôme obtenu', required: false },
  { type: 'casier_judiciaire', label: 'Extrait de casier judiciaire', required: false },
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const ACCEPTED_FILES = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'

export const EMPTY_APPLICATION: TeacherApplication = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  specialites: [],
  niveaux_enseignes: [],
  niveau_etudes: '',
  tarif_horaire: '',
  ville: '',
  ville_autre: '',
  arrondissement: '',
  quartier: '',
  rayon_km: 10,
  operateur: 'mtn_momo',
  numero_momo: '',
  nom_titulaire_compte: '',
  documents: {},
  username: '',
  password: '',
  consent: false,
}

// Format canonique camerounais : +2376XXXXXXXX
export function normalizePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, '').replace(/^\+?237/, '')
  return /^6\d{8}$/.test(digits) ? `+237${digits}` : raw.trim()
}
export const isCanonicalPhone = (raw: string) => /^\+2376\d{8}$/.test(normalizePhone(raw))

export const parseFcfa = (raw: string) => Number.parseInt(raw.replace(/\D/g, ''), 10)
export const formatFcfa = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ')} FCFA`

export function fileError(file: File) {
  if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) return 'Formats acceptés : PDF, JPG ou PNG.'
  if (file.size > MAX_FILE_SIZE) return 'Fichier trop lourd (10 Mo maximum).'
  return ''
}

type RegisterResponse = {
  user: { id: number; username: string; email: string; user_type: 'enseignant' }
  access_token: string
  refresh_token: string
}
type CoordonneesResponse = { enseignant_id: number }

// Garde le jeton entre deux tentatives : si une étape après l'inscription échoue,
// un nouvel envoi reprend sans recréer le compte (sinon « email déjà utilisé »).
export type SubmitSession = { token?: string; register?: RegisterResponse; enseignantId?: number; zoneDone?: boolean; uploaded: DocumentType[] }
export const newSession = (): SubmitSession => ({ uploaded: [] })

// Envoi du dossier enseignant, dans l'ordre imposé par le backend :
// 1. POST /auth/register   2. PUT /coordonnees-paiement/me (renvoie enseignant_id)
// 3. POST /zones-intervention/enseignants/{id}   4. POST /documents-enseignants/upload (un appel par fichier)
export async function submitApplication(a: TeacherApplication, session: SubmitSession) {
  if (!session.token) {
    const res = await api<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: a.username.trim(),
        email: a.email.trim(),
        password: a.password,
        user_type: 'enseignant',
        first_name: a.first_name.trim(),
        last_name: a.last_name.trim(),
        phone: normalizePhone(a.phone),
        // Le backend n'a pas de champ « niveaux enseignés » : on les ajoute aux spécialités
        specialites: `${a.specialites.join(', ')} — Niveaux : ${a.niveaux_enseignes.join(', ')}`,
        niveau_etudes: a.niveau_etudes,
        tarif_horaire: parseFcfa(a.tarif_horaire),
      }),
    })
    session.token = res.access_token
    session.register = res
  }
  const token = session.token

  if (!session.enseignantId) {
    const coord = await api<CoordonneesResponse>('/coordonnees-paiement/me', {
      method: 'PUT',
      token,
      body: JSON.stringify({
        operateur: a.operateur,
        numero_mobile_money: normalizePhone(a.numero_momo),
        nom_titulaire_compte: a.nom_titulaire_compte.trim(),
      }),
    })
    session.enseignantId = coord.enseignant_id
  }

  if (!session.zoneDone) {
    await api(`/zones-intervention/enseignants/${session.enseignantId}`, {
      method: 'POST',
      token,
      body: JSON.stringify({
        ville: a.ville === OTHER ? a.ville_autre.trim() : a.ville,
        commune_arrondissement: a.arrondissement.trim() || null,
        quartier: a.quartier.trim(),
        rayon_km: a.rayon_km,
      }),
    })
    session.zoneDone = true
  }

  for (const [type, file] of Object.entries(a.documents) as [DocumentType, File | undefined][]) {
    if (!file || session.uploaded.includes(type)) continue
    const form = new FormData()
    form.append('type_document', type)
    form.append('file', file)
    await api('/documents-enseignants/upload', { method: 'POST', token, body: form })
    session.uploaded.push(type)
  }

  // Le dossier est complet : l'enseignant est connecté et peut suivre sa validation dans son espace
  if (session.register) await adoptSession(session.register).catch(() => null)
  return { first_name: a.first_name.trim(), email: a.email.trim(), reference: `ENS-${session.enseignantId}` }
}
