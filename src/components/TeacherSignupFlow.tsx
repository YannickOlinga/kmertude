import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ACCEPTED_FILES, DOCUMENTS, EMPTY_APPLICATION, NIVEAUX_ENSEIGNES, NIVEAUX_ETUDES, OTHER, SPECIALITES, VILLES,
  fileError, formatFcfa, isCanonicalPhone, normalizePhone, parseFcfa, saveApplication,
  type DocumentType, type TeacherApplication,
} from '../lib/teacherApplications'
import { isValidEmail } from '../lib/teacherRequests'
import './RequestFlow.css'
import './TeacherSignupFlow.css'

const STEPS = ['Identité', 'Compétences', 'Zone', 'Paiement', 'Documents', 'Compte'] as const

type Errors = Partial<Record<string, string>>

function validate(step: number, a: TeacherApplication): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (a.first_name.trim().length < 2) e.first_name = 'Prénom requis.'
    if (a.last_name.trim().length < 2) e.last_name = 'Nom requis.'
    if (!isValidEmail(a.email)) e.email = 'Adresse email invalide.'
    if (!isCanonicalPhone(a.phone)) e.phone = 'Numéro camerounais commençant par 6 (ex. 6 70 00 00 00).'
  }
  if (step === 1) {
    if (a.specialites.length === 0) e.specialites = 'Choisissez au moins une matière.'
    if (a.niveaux_enseignes.length === 0) e.niveaux_enseignes = 'Choisissez au moins un niveau.'
    if (!a.niveau_etudes) e.niveau_etudes = 'Indiquez votre niveau d’études.'
    const tarif = parseFcfa(a.tarif_horaire)
    if (!Number.isFinite(tarif) || tarif < 500) e.tarif_horaire = 'Indiquez un tarif horaire en FCFA (500 minimum).'
  }
  if (step === 2) {
    if (!a.ville) e.ville = 'Choisissez une ville.'
    if (a.ville === OTHER && a.ville_autre.trim().length < 2) e.ville_autre = 'Précisez la ville.'
    if (a.quartier.trim().length < 2) e.quartier = 'Indiquez au moins un quartier.'
  }
  if (step === 3) {
    if (!isCanonicalPhone(a.numero_momo)) e.numero_momo = 'Numéro Mobile Money au format +2376XXXXXXXX.'
    if (a.nom_titulaire_compte.trim().length < 3) e.nom_titulaire_compte = 'Nom du titulaire requis.'
  }
  if (step === 4) {
    for (const d of DOCUMENTS) if (d.required && !a.documents[d.type]) e[`doc_${d.type}`] = 'Document obligatoire.'
  }
  if (step === 5) {
    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(a.username.trim())) e.username = '3 à 50 caractères : lettres, chiffres, . _ -'
    if (a.password.length < 8) e.password = '8 caractères minimum.'
    if (!a.consent) e.consent = 'Votre accord est nécessaire pour étudier votre dossier.'
  }
  return e
}

export default function TeacherSignupFlow() {
  const [data, setData] = useState<TeacherApplication>(EMPTY_APPLICATION)
  const [step, setStep] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [fileErrors, setFileErrors] = useState<Partial<Record<DocumentType, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState<ReturnType<typeof saveApplication> | null>(null)

  const set = <K extends keyof TeacherApplication>(key: K, value: TeacherApplication[K]) => setData((d) => ({ ...d, [key]: value }))
  const toggle = (key: 'specialites' | 'niveaux_enseignes', v: string) =>
    set(key, data[key].includes(v) ? data[key].filter((x) => x !== v) : [...data[key], v])

  const errors = validate(step, data)
  const err = (key: string) => (showErrors && errors[key] ? <p className="rf-error" role="alert">{errors[key]}</p> : null)

  const pickFile = (type: DocumentType, file: File | undefined) => {
    if (!file) return
    const message = fileError(file)
    setFileErrors((f) => ({ ...f, [type]: message }))
    if (!message) set('documents', { ...data.documents, [type]: file })
  }
  const removeFile = (type: DocumentType) => {
    const next = { ...data.documents }
    delete next[type]
    set('documents', next)
  }

  const next = (e: FormEvent) => {
    e.preventDefault()
    if (Object.keys(errors).length) { setShowErrors(true); return }
    setShowErrors(false)
    if (step === 0) {
      // Préremplit le Mobile Money et le titulaire à partir de l'identité
      setData((d) => ({
        ...d,
        phone: normalizePhone(d.phone),
        numero_momo: d.numero_momo || normalizePhone(d.phone),
        nom_titulaire_compte: d.nom_titulaire_compte || `${d.first_name.trim()} ${d.last_name.trim()}`,
      }))
    }
    if (step < STEPS.length - 1) { setStep(step + 1); return }
    setDone(saveApplication(data))
  }

  const back = () => { setShowErrors(false); setStep((s) => Math.max(0, s - 1)) }

  if (done) return <Submitted firstName={done.first_name} reference={done.reference} email={done.email} />

  const tarif = parseFcfa(data.tarif_horaire)

  return (
    <div className="rf">
      <ol className="rf-stepper ts-stepper" aria-label="Étapes de l’inscription">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="rf-dot" aria-hidden="true">{i < step ? '✓' : i + 1}</span>
            <span className="rf-step-label">{label}</span>
          </li>
        ))}
      </ol>

      <form className="rf-form" onSubmit={next} noValidate>
        {step === 0 && (
          <fieldset>
            <legend>Faisons connaissance</legend>
            <div className="rf-grid">
              <div>
                <label className="rf-label" htmlFor="ts-first">Prénom *</label>
                <input id="ts-first" className="rf-input" value={data.first_name} onChange={(e) => set('first_name', e.target.value)} autoComplete="given-name" />
                {err('first_name')}
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-last">Nom *</label>
                <input id="ts-last" className="rf-input" value={data.last_name} onChange={(e) => set('last_name', e.target.value)} autoComplete="family-name" />
                {err('last_name')}
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-email">Email *</label>
                <input id="ts-email" className="rf-input" type="email" value={data.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                {err('email')}
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-phone">Téléphone *</label>
                <input id="ts-phone" className="rf-input" type="tel" placeholder="6 70 00 00 00" value={data.phone} onChange={(e) => set('phone', e.target.value)} onBlur={() => set('phone', normalizePhone(data.phone))} autoComplete="tel" />
                {err('phone')}
              </div>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <>
            <fieldset>
              <legend>Vos compétences</legend>
              <p className="rf-question">Quelles matières enseignez-vous ? *</p>
              <div className="rf-chips">
                {SPECIALITES.map((s) => (
                  <button key={s} type="button" aria-pressed={data.specialites.includes(s)} className={data.specialites.includes(s) ? 'selected' : ''} onClick={() => toggle('specialites', s)}>{s}</button>
                ))}
              </div>
              {err('specialites')}
            </fieldset>
            <fieldset>
              <p className="rf-question">À quels niveaux ? *</p>
              <div className="rf-chips">
                {NIVEAUX_ENSEIGNES.map((n) => (
                  <button key={n} type="button" aria-pressed={data.niveaux_enseignes.includes(n)} className={data.niveaux_enseignes.includes(n) ? 'selected' : ''} onClick={() => toggle('niveaux_enseignes', n)}>{n}</button>
                ))}
              </div>
              {err('niveaux_enseignes')}
            </fieldset>
            <div className="rf-grid">
              <div>
                <label className="rf-label" htmlFor="ts-etudes">Votre niveau d’études *</label>
                <select id="ts-etudes" className="rf-input" value={data.niveau_etudes} onChange={(e) => set('niveau_etudes', e.target.value)}>
                  <option value="">Je sélectionne</option>
                  {NIVEAUX_ETUDES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                {err('niveau_etudes')}
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-tarif">Tarif horaire souhaité (FCFA) *</label>
                <input id="ts-tarif" className="rf-input" inputMode="numeric" placeholder="3 500" value={data.tarif_horaire} onChange={(e) => set('tarif_horaire', e.target.value.replace(/[^\d\s]/g, ''))} />
                {Number.isFinite(tarif) && tarif > 0 && <p className="ts-hint">Soit {formatFcfa(tarif)} par heure. Le tarif final est fixé avec Kmertude pour chaque mission.</p>}
                {err('tarif_horaire')}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <fieldset>
            <legend>Votre zone d’intervention</legend>
            <p className="ts-note">Pas besoin de code postal : la ville, l’arrondissement et le quartier suffisent.</p>
            <div className="rf-grid">
              <div>
                <label className="rf-label" htmlFor="ts-ville">Ville *</label>
                <select id="ts-ville" className="rf-input" value={data.ville} onChange={(e) => set('ville', e.target.value)}>
                  <option value="">Je sélectionne</option>
                  {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                {err('ville')}
              </div>
              {data.ville === OTHER && (
                <div>
                  <label className="rf-label" htmlFor="ts-ville-autre">Précisez la ville *</label>
                  <input id="ts-ville-autre" className="rf-input" value={data.ville_autre} onChange={(e) => set('ville_autre', e.target.value)} />
                  {err('ville_autre')}
                </div>
              )}
              <div>
                <label className="rf-label" htmlFor="ts-arr">Arrondissement</label>
                <input id="ts-arr" className="rf-input" placeholder="ex. Douala 5e" value={data.arrondissement} onChange={(e) => set('arrondissement', e.target.value)} />
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-quartier">Quartier(s) *</label>
                <input id="ts-quartier" className="rf-input" placeholder="ex. Bonamoussadi, Makepe" value={data.quartier} onChange={(e) => set('quartier', e.target.value)} />
                {err('quartier')}
              </div>
            </div>
            <label className="rf-label" htmlFor="ts-rayon">Je peux me déplacer jusqu’à <strong>{data.rayon_km} km</strong></label>
            <input id="ts-rayon" className="ts-range" type="range" min={1} max={100} value={data.rayon_km} onChange={(e) => set('rayon_km', Number(e.target.value))} />
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend>Votre rémunération par Mobile Money</legend>
            <p className="ts-note">Vos gains vous sont versés sur ce compte une fois les séances encaissées.</p>
            <div className="rf-cards">
              {([['mtn_momo', 'MTN MoMo'], ['orange_money', 'Orange Money']] as const).map(([id, label]) => (
                <label key={id} className={`rf-card${data.operateur === id ? ' selected' : ''}`}>
                  <input type="radio" name="operateur" checked={data.operateur === id} onChange={() => set('operateur', id)} />
                  <strong>{label}</strong>
                </label>
              ))}
            </div>
            <div className="rf-grid ts-gap">
              <div>
                <label className="rf-label" htmlFor="ts-momo">Numéro Mobile Money *</label>
                <input id="ts-momo" className="rf-input" type="tel" placeholder="+237 6XX XX XX XX" value={data.numero_momo} onChange={(e) => set('numero_momo', e.target.value)} onBlur={() => set('numero_momo', normalizePhone(data.numero_momo))} />
                {err('numero_momo')}
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-titulaire">Nom du titulaire du compte *</label>
                <input id="ts-titulaire" className="rf-input" value={data.nom_titulaire_compte} onChange={(e) => set('nom_titulaire_compte', e.target.value)} />
                {err('nom_titulaire_compte')}
              </div>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend>Vos pièces justificatives</legend>
            <p className="ts-note">PDF, JPG ou PNG, 10 Mo maximum par fichier. Elles sont vérifiées par notre équipe avant toute mission.</p>
            <ul className="ts-docs">
              {DOCUMENTS.map((d) => {
                const file = data.documents[d.type]
                return (
                  <li key={d.type} className={file ? 'has-file' : ''}>
                    <div className="ts-doc-info">
                      <strong>{d.label}{d.required && ' *'}</strong>
                      {file
                        ? <span className="ts-doc-file">{file.name} · <span className="ts-badge">À vérifier</span></span>
                        : <span className="ts-doc-file">{d.required ? 'Obligatoire' : 'Facultatif'}</span>}
                      {fileErrors[d.type] && <p className="rf-error" role="alert">{fileErrors[d.type]}</p>}
                      {err(`doc_${d.type}`)}
                    </div>
                    <div className="ts-doc-actions">
                      <label className="rf-btn rf-btn-ghost ts-upload">
                        {file ? 'Remplacer' : 'Téléverser'}
                        <input type="file" accept={ACCEPTED_FILES} onChange={(e) => { pickFile(d.type, e.target.files?.[0]); e.target.value = '' }} />
                      </label>
                      {file && <button type="button" className="ts-remove" onClick={() => removeFile(d.type)} aria-label={`Retirer ${d.label}`}>Retirer</button>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        )}

        {step === 5 && (
          <fieldset>
            <legend>Créez votre accès</legend>
            <div className="rf-grid">
              <div>
                <label className="rf-label" htmlFor="ts-user">Nom d’utilisateur *</label>
                <input id="ts-user" className="rf-input" value={data.username} onChange={(e) => set('username', e.target.value)} autoComplete="username" />
                {err('username')}
              </div>
              <div>
                <label className="rf-label" htmlFor="ts-pass">Mot de passe *</label>
                <div className="ts-password">
                  <input id="ts-pass" className="rf-input" type={showPassword ? 'text' : 'password'} value={data.password} onChange={(e) => set('password', e.target.value)} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Masquer' : 'Afficher'}</button>
                </div>
                {err('password')}
              </div>
            </div>
            <label className="rf-consent">
              <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} />
              <span>J’accepte que Kmertude vérifie mes pièces justificatives et me propose des missions. Je pourrai accepter ou refuser chaque proposition.</span>
            </label>
            {err('consent')}
          </fieldset>
        )}

        <div className="rf-actions">
          {step > 0 && <button type="button" className="rf-btn rf-btn-ghost" onClick={back}>← Précédent</button>}
          <button type="submit" className="rf-btn rf-btn-primary">
            {step === STEPS.length - 1 ? 'Envoyer mon dossier' : 'Continuer →'}
          </button>
        </div>
      </form>
    </div>
  )
}

const AFTER = [
  { title: 'Vérification du dossier', text: 'Notre équipe contrôle vos pièces justificatives.' },
  { title: 'Validation du profil', text: 'Vous êtes notifié(e) dès que votre profil est validé.' },
  { title: 'Propositions de missions', text: 'Vous recevez des propositions près de chez vous, à accepter sous 48 h.' },
  { title: 'Cours et rémunération', text: 'Vous déclarez vos séances et êtes payé(e) par Mobile Money.' },
]

function Submitted({ firstName, reference, email }: { firstName: string; reference: string; email: string }) {
  return (
    <div className="rf rf-done" role="status">
      <div className="rf-done-icon" aria-hidden="true">✓</div>
      <h2>Merci {firstName}, votre dossier est bien envoyé !</h2>
      <p className="ts-banner">Dossier en cours de vérification administrative</p>
      <p className="rf-done-lead">
        Nous vous écrirons à <strong>{email}</strong> à chaque étape. Référence : <strong>{reference}</strong>
      </p>
      <h3>Les prochaines étapes</h3>
      <ol className="rf-next">
        {AFTER.map((s) => <li key={s.title}><strong>{s.title}</strong><span>{s.text}</span></li>)}
      </ol>
      <div className="rf-actions rf-actions-center">
        <Link to="/" className="rf-btn rf-btn-ghost">Retour à l’accueil</Link>
      </div>
    </div>
  )
}
