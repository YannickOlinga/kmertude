// Inscription enseignant — champs alignés sur le cahier des charges MVP :
// POST /auth/register (user_type ENSEIGNANT), POST /zones-intervention, PUT /coordonnees-paiement/me,
// POST /documents-enseignants/upload. Pas encore de backend : le dossier est conservé localement.

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

const STORAGE_KEY = 'kmertude:teacherApplications'

export function saveApplication(a: TeacherApplication) {
  const record = {
    reference: `ENS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: Date.now(),
    statut_validation: 'en_attente' as const,
    user_type: 'ENSEIGNANT' as const,
    first_name: a.first_name.trim(),
    last_name: a.last_name.trim(),
    email: a.email.trim(),
    phone: normalizePhone(a.phone),
    username: a.username.trim(),
    specialites: a.specialites,
    niveaux_enseignes: a.niveaux_enseignes,
    niveau_etudes: a.niveau_etudes,
    tarif_horaire: parseFcfa(a.tarif_horaire),
    zone: {
      ville: a.ville === OTHER ? a.ville_autre.trim() : a.ville,
      arrondissement: a.arrondissement.trim(),
      quartier: a.quartier.trim(),
      rayon_km: a.rayon_km,
      pays: 'Cameroun',
    },
    paiement: { operateur: a.operateur, numero_telephone: normalizePhone(a.numero_momo), nom_titulaire_compte: a.nom_titulaire_compte.trim() },
    // Le mot de passe et les fichiers ne sont jamais stockés localement
    documents: Object.entries(a.documents).map(([type, f]) => ({ type_document: type, nom_fichier_original: f?.name, statut: 'en_attente' })),
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...list].slice(0, 10)))
  } catch {
    // stockage indisponible : la confirmation s'affiche quand même
  }
  return record
}
