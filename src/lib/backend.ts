// Appels typés vers les endpoints métier du backend (tous authentifiés sauf mention contraire).
// Les listes sont filtrées côté serveur selon l'utilisateur connecté (famille / enseignant).
import { api, apiBlob } from './api'
import type { User } from './session'

const get = <T>(path: string, query?: Record<string, string | number | boolean | undefined>) =>
  api<T>(path, { auth: true, query })
const send = <T>(method: string, path: string, body?: unknown) =>
  api<T>(path, { auth: true, method, body: body === undefined ? undefined : JSON.stringify(body) })

/* ---------- Formatage ---------- */

export const fcfa = (n: number | null | undefined) =>
  n == null ? '—' : `${new Intl.NumberFormat('fr-FR').format(n).replace(/[\u00a0\u202f]/g, ' ')} FCFA`
export const dateFr = (iso: string | null | undefined, withTime = false) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR', withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ---------- Référentiels (public) ---------- */

export type Referentiels = {
  // communes_et_quartiers : { ville: { arrondissement: [quartiers] } }
  geographie: { regions: string[]; villes_principales: string[]; communes_et_quartiers: Record<string, Record<string, string[]>> }
  systeme_educatif: {
    cycles: Record<string, { nom: string; classes: string[] }>
    toutes_les_classes: string[]
    series_secondaire: string[]
    matieres_courantes: string[]
    rythmes_cours?: string[]
  }
  enums_techniques: { modalites_cours: string[]; operateurs_mobile_money: string[]; types_documents: string[] }
}
let refCache: Promise<Referentiels> | null = null
export const getReferentiels = () => {
  refCache ??= api<Referentiels>('/referentiels').catch((e) => { refCache = null; throw e })
  return refCache
}

/* ---------- Utilisateur / profils ---------- */

export type UserUpdate = Partial<Pick<User, 'username' | 'email' | 'phone' | 'first_name' | 'last_name'>>
export const updateUser = (id: number, data: UserUpdate) => send<User>('PUT', `/users/${id}`, data)

export type Enseignant = {
  id: number
  user_id: number
  specialites: string | null
  niveau_etudes: string | null
  experience_annees: number
  tarif_horaire: number | null
  bio: string | null
  methodologie: string | null
  disponibilites: string | null
  statut_validation: 'en_attente' | 'valide' | 'refuse' | 'suspendu'
  motif_statut_validation: string | null
  note_sur_5: number
  nombre_avis: number
  user: User
}
export type EnseignantUpdate = Partial<Pick<Enseignant, 'specialites' | 'niveau_etudes' | 'experience_annees' | 'tarif_horaire' | 'bio' | 'methodologie' | 'disponibilites'>>
export const getEnseignant = (id: number) => get<Enseignant>(`/users/enseignants/${id}`)
export const updateEnseignant = (id: number, data: EnseignantUpdate) => send<Enseignant>('PUT', `/users/enseignants/${id}`, data)

/* ---------- Bénéficiaires (famille) ---------- */

export type Beneficiaire = {
  id: number
  famille_id: number
  user_id: number | null
  prenom: string
  nom: string
  nom_complet: string
  classe_niveau: string
  serie: string | null
  etablissement_scolaire: string | null
  date_naissance: string | null
  besoins_specifiques: string | null
  is_active: boolean
}
export type BeneficiaireCreate = Pick<Beneficiaire, 'prenom' | 'nom' | 'classe_niveau'> &
  Partial<Pick<Beneficiaire, 'serie' | 'etablissement_scolaire' | 'date_naissance' | 'besoins_specifiques'>>
export const listBeneficiaires = () => get<Beneficiaire[]>('/beneficiaires')
export const createBeneficiaire = (data: BeneficiaireCreate) => send<Beneficiaire>('POST', '/beneficiaires', data)
// Apprenant adulte : le compte famille est lui-même bénéficiaire
export const createAutoBeneficiaire = (data: Partial<BeneficiaireCreate> & { classe_niveau: string }) =>
  send<Beneficiaire>('POST', '/beneficiaires/auto', data)
export const updateBeneficiaire = (id: number, data: Partial<BeneficiaireCreate>) => send<Beneficiaire>('PUT', `/beneficiaires/${id}`, data)
export const deleteBeneficiaire = (id: number) => send('DELETE', `/beneficiaires/${id}`)

/* ---------- Demandes de cours (famille) ---------- */

export type Modalite = 'presentiel' | 'en_ligne' | 'hybride'
export type DemandeStatut = 'soumise' | 'en_cours_traitement' | 'proposee' | 'affectee' | 'annulee' | 'cloturee'
export type DemandeCours = {
  id: number
  famille_id: number
  beneficiaire_id: number
  matiere: string
  niveau: string
  modalite: Modalite
  localisation_ville: string
  commune_arrondissement: string | null
  localisation_quartier: string
  localisation_point_repere: string | null
  heures_semaine_souhaitees: number
  tarif_horaire_client: number | null
  disponibilites: string | null
  objectifs: string | null
  rythme: string | null
  statut: DemandeStatut
  date_soumission: string
}
export type DemandeCreate = Pick<DemandeCours, 'beneficiaire_id' | 'matiere' | 'niveau' | 'modalite' | 'localisation_ville' | 'localisation_quartier' | 'heures_semaine_souhaitees'> &
  Partial<Pick<DemandeCours, 'commune_arrondissement' | 'localisation_point_repere' | 'disponibilites' | 'objectifs' | 'rythme'>>
export const listDemandes = (statut?: DemandeStatut) => get<DemandeCours[]>('/demandes-cours', { statut })
export const createDemande = (data: DemandeCreate) => send<DemandeCours>('POST', '/demandes-cours', { pays: 'Cameroun', ...data })
export const annulerDemande = (id: number) => send<DemandeCours>('POST', `/demandes-cours/${id}/annuler`)

export const DEMANDE_STATUT: Record<DemandeStatut, { label: string; tone?: 'ok' | 'warn' }> = {
  soumise: { label: 'Soumise' },
  en_cours_traitement: { label: 'En traitement', tone: 'warn' },
  proposee: { label: 'Enseignant proposé', tone: 'warn' },
  affectee: { label: 'Enseignant affecté', tone: 'ok' },
  annulee: { label: 'Annulée' },
  cloturee: { label: 'Clôturée' },
}
export const MODALITE_LABEL: Record<Modalite, string> = { presentiel: 'À domicile', en_ligne: 'En ligne', hybride: 'Hybride' }

/* ---------- Propositions de mission (enseignant) ---------- */

export type PropositionStatut = 'en_attente' | 'option_posee' | 'acceptee' | 'refusee' | 'expiree' | 'annulee_admin'
export type Proposition = {
  id: number
  demande_cours_id: number
  tarif_horaire_propose: number
  date_envoi: string
  date_expiration: string | null
  statut: PropositionStatut
  message_admin: string | null
  demande: {
    prenom_eleve: string
    classe_niveau: string
    serie: string | null
    matiere: string
    modalite: Modalite
    localisation_ville: string
    localisation_quartier: string
    heures_semaine_souhaitees: number
    disponibilites: string | null
    objectifs: string | null
    rythme: string | null
  }
}
export const listMesPropositions = () => get<Proposition[]>('/propositions-missions/me')
// 'mettre_en_option' est le parcours recommandé : l'admin confirme ensuite l'affectation officielle
export const repondreProposition = (id: number, action: 'mettre_en_option' | 'accepter' | 'refuser', motif_refus?: string) =>
  send<Proposition>('POST', `/propositions-missions/${id}/repondre`, { action, motif_refus: motif_refus || null })

export const PROPOSITION_STATUT: Record<PropositionStatut, { label: string; tone?: 'ok' | 'warn' }> = {
  en_attente: { label: 'En attente de réponse', tone: 'warn' },
  option_posee: { label: 'Option posée', tone: 'warn' },
  acceptee: { label: 'Acceptée', tone: 'ok' },
  refusee: { label: 'Refusée' },
  expiree: { label: 'Expirée' },
  annulee_admin: { label: 'Annulée' },
}

/* ---------- Missions & séances ---------- */

export type MissionStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'expired'
export type Mission = {
  id: number
  titre: string
  matiere: string
  niveau: string | null
  date_debut: string
  date_fin: string | null
  famille_id: number
  enseignant_id: number
  tarif_horaire: number
  tarif_horaire_enseignant: number | null
  nombre_heures_prevues: number | null
  nombre_heures_realisees: number
  status: MissionStatus
  beneficiaire: { prenom: string; nom: string; classe_niveau: string } | null
}
export const listMissions = () => get<Mission[]>('/missions')

export const MISSION_STATUS: Record<MissionStatus, { label: string; tone?: 'ok' | 'warn' }> = {
  draft: { label: 'Brouillon' },
  active: { label: 'Active', tone: 'ok' },
  paused: { label: 'En pause', tone: 'warn' },
  completed: { label: 'Terminée' },
  cancelled: { label: 'Annulée' },
  expired: { label: 'Expirée' },
}

export type SeanceStatut = 'planifiee' | 'declaree' | 'contestee' | 'validee' | 'annulee' | 'absence_enseignant' | 'absence_eleve'
export type Course = {
  id: number
  mission_id: number
  date_heure_debut: string
  date_heure_fin: string
  duree_minutes: number
  sujet: string | null
  compte_rendu: string | null
  heures_declarees: number | null
  date_expiration_validation: string | null
  motif_contestation: string | null
  montant_cours: number | null
  remuneration_enseignant: number | null
  status: SeanceStatut
  is_past: boolean
}
export const listCourses = (query?: { mission_id?: number; status?: SeanceStatut }) => get<Course[]>('/courses', query)
export type DeclarationSeance = {
  notions_abordees: string
  // Attention : durée réelle en MINUTES (15 à 480) malgré le nom du champ côté backend
  heures_declarees?: number | null
  attitude_concentration?: string | null
  is_absence_eleve?: boolean
  niveau_assimilation?: string | null
  points_blocage?: string | null
  exercices_recommandes?: string | null
  remarques_parents?: string | null
}
export const declarerSeance = (id: number, data: DeclarationSeance) => send<Course>('POST', `/courses/${id}/declarer`, data)
export type CourseCreate = { mission_id: number; date_heure_debut: string; date_heure_fin: string; duree_minutes: number; sujet?: string | null; mode_cours?: string }
export const createCourse = (data: CourseCreate) => send<Course>('POST', '/courses', data)
export const confirmerSeance = (id: number) => send<Course>('POST', `/courses/${id}/confirmer`)
export const contesterSeance = (id: number, motif: string) => send<Course>('POST', `/courses/${id}/contester`, { motif })

export const SEANCE_STATUT: Record<SeanceStatut, { label: string; tone?: 'ok' | 'warn' }> = {
  planifiee: { label: 'Planifiée' },
  declaree: { label: 'À confirmer', tone: 'warn' },
  contestee: { label: 'Contestée', tone: 'warn' },
  validee: { label: 'Validée', tone: 'ok' },
  annulee: { label: 'Annulée' },
  absence_enseignant: { label: 'Absence enseignant' },
  absence_eleve: { label: 'Absence élève' },
}

/* ---------- Messagerie de mission ---------- */

export type Conversation = { id: number; mission_id: number; unread_count: number; dernier_message_at: string | null }
export type Message = { id: number; sender_user_id: number; sender_role: string; contenu: string; date_envoi: string }
export const getConversationMission = (missionId: number) => get<Conversation>(`/conversations/mission/${missionId}`)
export const listMessages = (conversationId: number) => get<Message[]>(`/conversations/${conversationId}/messages`)
export const sendMessage = (conversationId: number, contenu: string) =>
  send<Message>('POST', `/conversations/${conversationId}/messages`, { contenu })

/* ---------- Facturation & paiements (famille) ---------- */

export type FactureStatut = 'brouillon' | 'emise' | 'partiellement_payee' | 'payee' | 'en_retard' | 'annulee'
export type Facture = {
  id: number
  numero_facture: string
  famille_id: number
  periode_debut: string
  periode_fin: string
  date_emission: string | null
  date_echeance: string
  statut: FactureStatut
  type_facture: 'standard' | 'avoir' | 'rectification'
  montant_total_fcfa: number
  montant_regle_fcfa: number
  montant_solde_du_fcfa: number
  est_soldee: boolean
}
export const listFactures = () => get<Facture[]>('/factures')

export const FACTURE_STATUT: Record<FactureStatut, { label: string; tone?: 'ok' | 'warn' }> = {
  brouillon: { label: 'Brouillon' },
  emise: { label: 'À payer', tone: 'warn' },
  partiellement_payee: { label: 'Partiellement payée', tone: 'warn' },
  payee: { label: 'Payée', tone: 'ok' },
  en_retard: { label: 'En retard', tone: 'warn' },
  annulee: { label: 'Annulée' },
}

export type Encours = {
  famille_id: number
  encours_net: number
  credit_disponible: number
  total_facture_non_solde: number
  peut_creer_demande: boolean
  motif_blocage: string | null
}
export const getEncours = (familleId: number) => get<Encours>(`/factures/famille/${familleId}/encours`)

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'rapproche_manuel' | 'annule'
export type Payment = {
  id: number
  reference_interne: string | null
  moyen_paiement: string | null
  montant: number
  status: PaymentStatus
  date_paiement: string | null
  created_at: string
}
export const listPayments = () => get<Payment[]>('/payments')
export const initierMomo = (data: { famille_id: number; montant: number; moyen_paiement: 'mtn_momo' | 'orange_money'; numero_telephone: string; facture_id?: number | null }) =>
  send<Payment>('POST', '/payments/initier-momo', data)

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone?: 'ok' | 'warn' }> = {
  pending: { label: 'En attente', tone: 'warn' },
  completed: { label: 'Payé', tone: 'ok' },
  failed: { label: 'Échoué' },
  refunded: { label: 'Remboursé' },
  rapproche_manuel: { label: 'Payé (rapproché)', tone: 'ok' },
  annule: { label: 'Annulé' },
}

/* ---------- Dossier enseignant ---------- */

export type DocumentType = 'cni' | 'diplome' | 'justificatif_etudes' | 'casier_judiciaire' | 'cv' | 'rib' | 'autre'
export type DocumentEnseignant = {
  id: number
  enseignant_id: number
  type_document: DocumentType
  nom_fichier_original: string
  mime_type: string
  taille_octets: number
  statut: 'en_attente' | 'valide' | 'refuse'
  date_soumission: string
  motif_rejet: string | null
}
export const listMesDocuments = () => get<DocumentEnseignant[]>('/documents-enseignants/me')
export const uploadDocument = (type: DocumentType, file: File) => {
  const form = new FormData()
  form.append('type_document', type)
  form.append('file', file)
  return api<DocumentEnseignant>('/documents-enseignants/upload', { method: 'POST', auth: true, body: form })
}
export const downloadDocument = (id: number) => apiBlob(`/documents-enseignants/${id}/download`, { auth: true })
export const deleteDocument = (id: number) => send('DELETE', `/documents-enseignants/${id}`)

export const DOCUMENT_LABEL: Record<DocumentType, string> = {
  cni: 'Carte nationale d’identité',
  diplome: 'Diplôme',
  justificatif_etudes: 'Justificatif d’études',
  casier_judiciaire: 'Casier judiciaire',
  cv: 'CV',
  rib: 'RIB',
  autre: 'Autre document',
}
export const DOCUMENT_STATUT = {
  en_attente: { label: 'En vérification', tone: 'warn' },
  valide: { label: 'Validé', tone: 'ok' },
  refuse: { label: 'Refusé' },
} as const

export type Coordonnees = {
  enseignant_id: number
  operateur: 'mtn_momo' | 'orange_money'
  numero_mobile_money: string
  nom_titulaire_compte: string
  est_verifie: boolean
}
export const getCoordonnees = () => get<Coordonnees>('/coordonnees-paiement/me')
export const saveCoordonnees = (data: Pick<Coordonnees, 'operateur' | 'numero_mobile_money' | 'nom_titulaire_compte'>) =>
  send<Coordonnees>('PUT', '/coordonnees-paiement/me', data)

export type Zone = { id: number; ville: string; commune_arrondissement: string | null; quartier: string | null; rayon_km: number | null; actif: boolean }
export type ZoneInput = Pick<Zone, 'ville' | 'commune_arrondissement' | 'quartier' | 'rayon_km'>
export const listZones = (enseignantId: number) => get<Zone[]>(`/zones-intervention/enseignants/${enseignantId}`)
export const addZone = (enseignantId: number, data: ZoneInput) => send<Zone>('POST', `/zones-intervention/enseignants/${enseignantId}`, data)
export const deleteZone = (id: number) => send('DELETE', `/zones-intervention/${id}`)

/* ---------- Rémunérations (enseignant) ---------- */

export type Bordereau = {
  id: number
  reference_bordereau: string
  periode_debut: string
  periode_fin: string
  montant_total_fcfa: number
  statut: 'brouillon' | 'valide' | 'en_cours_transfert' | 'paye' | 'rejete'
  mode_reglement: string
  numero_mobile_money: string | null
  date_paiement_effectif: string | null
  lignes: unknown[]
}
export const listBordereaux = () => get<Bordereau[]>('/remunerations/bordereaux')
export type SeanceEligible = {
  course_id: number
  date_heure_debut: string
  matiere: string
  eleve_nom: string
  facture_numero: string
  facture_taux_encaissement: number
  remuneration_enseignant_totale: number
  montant_deblocable_total: number
  montant_deja_inclus: number
  reste_a_verser: number
}
export const listSeancesEligibles = (enseignantId: number) => get<SeanceEligible[]>(`/remunerations/enseignant/${enseignantId}/seances-eligibles`)

export const BORDEREAU_STATUT = {
  brouillon: { label: 'En préparation' },
  valide: { label: 'Validé', tone: 'warn' },
  en_cours_transfert: { label: 'Virement en cours', tone: 'warn' },
  paye: { label: 'Payé', tone: 'ok' },
  rejete: { label: 'Rejeté' },
} as const

/* ---------- Identifiants de profil ---------- */
// /auth/me ne renvoie pas l'id du profil enseignant/famille : on le retrouve via d'autres ressources.

let enseignantIdCache: { userId: number; id: number } | null = null
export async function resolveEnseignantId(user: User): Promise<number | null> {
  if (enseignantIdCache?.userId === user.id) return enseignantIdCache.id
  let id: number | null = null
  try {
    id = (await getCoordonnees()).enseignant_id
  } catch {
    try {
      id = (await listMesDocuments())[0]?.enseignant_id ?? null
    } catch { /* ignore */ }
    if (id == null) {
      try {
        const all = await api<Enseignant[]>('/users/enseignants', { query: { limit: 100 } })
        id = all.find((e) => e.user_id === user.id)?.id ?? null
      } catch { /* ignore */ }
    }
  }
  if (id != null) enseignantIdCache = { userId: user.id, id }
  return id
}

export async function resolveFamilleId(): Promise<number | null> {
  const sources: (() => Promise<{ famille_id: number }[]>)[] = [listBeneficiaires, listDemandes, listFactures]
  for (const load of sources) {
    try {
      const first = (await load())[0]
      if (first) return first.famille_id
    } catch { /* ignore */ }
  }
  return null
}

/* ---------- Administration ---------- */

export type Supervision = {
  demandes_en_attente: number
  enseignants_en_attente_validation: number
  missions_actives: number
  chiffre_affaires_facture_fcfa: number
  encaissements_recus_fcfa: number
  encours_clients_total_fcfa: number
  bordereaux_enseignants_payes_fcfa: number
  bordereaux_enseignants_en_attente_fcfa: number
}
export const getSupervision = () => get<Supervision>('/statistics/supervision')

export type DemandeAdmin = DemandeCours & { notes_administratives: string | null }
export const updateDemande = (id: number, data: Partial<Pick<DemandeAdmin, 'tarif_horaire_client' | 'notes_administratives' | 'statut'>>) =>
  send<DemandeAdmin>('PUT', `/demandes-cours/${id}`, data)
export const getBeneficiaire = (id: number) => get<Beneficiaire>(`/beneficiaires/${id}`)

export type Famille = { id: number; user_id: number; nombre_enfants: number; user: User }
export const getFamille = (id: number) => get<Famille>(`/users/familles/${id}`)

export const listEnseignants = (query?: { verified_only?: boolean; specialite?: string }) =>
  get<Enseignant[]>('/users/enseignants', { limit: 100, ...query })
export const validerEnseignant = (id: number, statut_validation: Enseignant['statut_validation'], motif?: string) =>
  send<Enseignant>('PUT', `/users/enseignants/${id}/validation`, { statut_validation, motif: motif || null })
export const listDocumentsEnseignant = (id: number) => get<DocumentEnseignant[]>(`/documents-enseignants/enseignants/${id}`)
export const setDocumentStatut = (id: number, statut: 'valide' | 'refuse', motif_rejet?: string) =>
  send<DocumentEnseignant>('PUT', `/documents-enseignants/${id}/statut`, { statut, motif_rejet: motif_rejet || null })
export const getCoordonneesEnseignant = (id: number) => get<Coordonnees>(`/coordonnees-paiement/enseignants/${id}`)

export type PropositionAdmin = {
  id: number
  demande_cours_id: number
  enseignant_id: number
  tarif_horaire_propose: number
  date_expiration: string | null
  statut: PropositionStatut
  motif_refus: string | null
}
export const createProposition = (data: { demande_cours_id: number; enseignant_id: number; tarif_horaire_propose: number; duree_validite_heures?: number; message_admin?: string | null }) =>
  send<PropositionAdmin>('POST', '/propositions-missions', data)
export const getProposition = (id: number) => get<PropositionAdmin>(`/propositions-missions/${id}`)
export const confirmerAffectation = (id: number, notes_admin?: string) =>
  send<PropositionAdmin>('POST', `/propositions-missions/${id}/confirmer-affectation`, { notes_admin: notes_admin || null })

export const listFacturesAdmin = (query?: { famille_id?: number; statut?: FactureStatut }) => get<Facture[]>('/factures', query)
export const rapprochementManuel = (data: {
  famille_id: number
  montant: number
  moyen_paiement: 'mtn_momo' | 'orange_money'
  reference_sms_recu: string
  note_rapprochement: string
  numero_telephone_payeur?: string | null
}) => send<Payment & { allocations: { facture_id: number; montant_alloue: number; numero_facture: string | null }[] }>('POST', '/payments/rapprochement-manuel', data)

export const listBordereauxAdmin = (query?: { enseignant_id?: number; statut?: Bordereau['statut'] }) =>
  get<(Bordereau & { enseignant_id: number })[]>('/remunerations/bordereaux', query)
export const genererBordereau = (data: { enseignant_id: number; periode_debut: string; periode_fin: string }) =>
  send<Bordereau>('POST', '/remunerations/bordereaux/generer', data)
export const validerBordereau = (id: number) => send<Bordereau>('POST', `/remunerations/bordereaux/${id}/valider`)
export const confirmerVersement = (id: number, reference_transaction_transfert: string) =>
  send<Bordereau>('POST', `/remunerations/bordereaux/${id}/confirmer-versement`, { reference_transaction_transfert })

// Présentation commerciale de l'enseignant pour la famille (prénom, bio, note…)
export type PresentationEnseignant = { id: number; prenom: string; bio: string | null; specialites: string | null; experience_annees: number; note_sur_5: number; nombre_avis: number }
export const getPresentationEnseignant = (id: number) => get<PresentationEnseignant>(`/users/enseignants/${id}/presentation-famille`)

// Heures restantes avant une échéance (ex. validation 72 h)
export const heuresRestantes = (iso: string | null | undefined) =>
  iso ? Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 3_600_000)) : null

export const genererFacturesMensuelles = (data: { periode_debut: string; periode_fin: string; famille_id?: number | null; delai_echeance_jours?: number }) =>
  send<Facture[]>('POST', '/factures/generer-mensuelle', { delai_echeance_jours: 10, ...data })
export const emettreFacture = (id: number) => send<Facture>('POST', `/factures/${id}/emettre`)
