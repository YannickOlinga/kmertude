import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Field, Msg, SelectOther } from './ui'
import { useReferentiels } from './referentiels'
import { HOME_BY_ROLE, login, registerEnseignant, registerFamille, useSession, type User } from '../lib/session'
import { NIVEAUX_ETUDES, isCanonicalPhone, normalizePhone, parseFcfa } from '../lib/teacherApplications'
import { isValidEmail } from '../lib/teacherRequests'
import { errorMessage } from '../lib/useApi'
import './app.css'

const EMPTY = { first_name: '', last_name: '', username: '', email: '', phone: '', password: '', specialites: '', niveau_etudes: '', tarif: '' }

// 1A — Connexion · 1B — Inscription (jamais de compte Admin public)
export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const session = useSession()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const refs = useReferentiels()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [pick, setPick] = useState<'famille' | 'enseignant'>(params.get('profil') === 'enseignant' ? 'enseignant' : 'famille')
  const [f, setF] = useState(EMPTY)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session && !busy) return <Navigate to={HOME_BY_ROLE[session.user.user_type]} replace />

  const next = params.get('next')
  const go = (u: User) => navigate(next?.startsWith('/') ? next : HOME_BY_ROLE[u.user_type], { replace: true })
  const set = (k: keyof typeof EMPTY, v: string) => setF((x) => ({ ...x, [k]: v }))

  const run = async (action: () => Promise<User>) => {
    setBusy(true)
    setError('')
    try { go(await action()) } catch (x) { setError(errorMessage(x)); setBusy(false) }
  }

  const submitLogin = (e: FormEvent) => {
    e.preventDefault()
    if (!id.trim() || !pw) { setError('Renseignez votre identifiant et votre mot de passe.'); return }
    void run(() => login(id, pw))
  }

  const submitRegister = (e: FormEvent) => {
    e.preventDefault()
    if (f.first_name.trim().length < 2 || f.last_name.trim().length < 2) { setError('Prénom et nom requis.'); return }
    if (f.username.trim().length < 3) { setError('Nom d’utilisateur : 3 caractères minimum.'); return }
    if (!isValidEmail(f.email)) { setError('Adresse email invalide.'); return }
    if (!isCanonicalPhone(f.phone)) { setError('Téléphone : numéro camerounais à 9 chiffres commençant par 6.'); return }
    if (f.password.length < 8) { setError('Mot de passe : 8 caractères minimum.'); return }
    const base = {
      username: f.username.trim(), email: f.email.trim(), password: f.password,
      first_name: f.first_name.trim(), last_name: f.last_name.trim(), phone: normalizePhone(f.phone),
    }
    if (pick === 'enseignant') {
      const tarif = parseFcfa(f.tarif)
      if (!f.specialites.trim() || !f.niveau_etudes.trim()) { setError('Spécialité et niveau d’études requis.'); return }
      if (!(tarif >= 500)) { setError('Indiquez votre tarif horaire souhaité en FCFA.'); return }
      void run(() => registerEnseignant({ ...base, specialites: f.specialites.trim(), niveau_etudes: f.niveau_etudes.trim(), tarif_horaire: tarif }))
    } else {
      void run(() => registerFamille({ ...base, nombre_enfants: 1 }))
    }
  }

  return (
    <div className="ks">
      <header className="ks-top"><Link to="/" className="ks-brand">Kmer<span>tude</span></Link></header>
      <main className="ks-auth">
        {mode === 'login' ? (
          <form onSubmit={submitLogin} noValidate>
            <h1>Connexion</h1>
            <Field label="Email ou nom d’utilisateur"><input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" placeholder="mkamga ou mkamga@mail.cm" /></Field>
            <Field label="Mot de passe"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></Field>
            <Msg error={error} />
            <button type="submit" className="ks-btn p w" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
            <p className="ks-c">Pas de compte ? <Link to="/register">Créer un compte</Link></p>
          </form>
        ) : (
          <form onSubmit={submitRegister} noValidate>
            <h1>Créer un compte</h1>
            <div className="ks-pick">
              <button type="button" className={`ks-bigcard ${pick === 'famille' ? 'on' : ''}`} aria-pressed={pick === 'famille'} onClick={() => setPick('famille')}>
                <b>Parent ou Apprenant adulte</b><span className="ks-mu ks-sm">Je cherche des cours</span>
              </button>
              <button type="button" className={`ks-bigcard ${pick === 'enseignant' ? 'on' : ''}`} aria-pressed={pick === 'enseignant'} onClick={() => setPick('enseignant')}>
                <b>Enseignant</b><span className="ks-mu ks-sm">Je souhaite donner des cours</span>
              </button>
            </div>
            <Field label="Prénom"><input value={f.first_name} onChange={(e) => set('first_name', e.target.value)} autoComplete="given-name" /></Field>
            <Field label="Nom"><input value={f.last_name} onChange={(e) => set('last_name', e.target.value)} autoComplete="family-name" /></Field>
            <Field label="Nom d’utilisateur"><input value={f.username} onChange={(e) => set('username', e.target.value)} autoComplete="username" /></Field>
            <Field label="Email"><input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></Field>
            <Field label="Téléphone"><input type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+237 6XX XX XX XX" autoComplete="tel" /></Field>
            <Field label="Mot de passe (min. 8 caractères)"><input type="password" value={f.password} onChange={(e) => set('password', e.target.value)} autoComplete="new-password" /></Field>
            {pick === 'enseignant' && (
              <>
                <SelectOther label="Spécialités" options={refs?.systeme_educatif.matieres_courantes ?? []} value={f.specialites} onChange={(v) => set('specialites', v)} />
                <SelectOther label="Niveau d’études" options={NIVEAUX_ETUDES.filter((n) => !n.startsWith('Autre'))} value={f.niveau_etudes} onChange={(v) => set('niveau_etudes', v)} />
                <Field label="Tarif horaire souhaité (FCFA/h)"><input inputMode="numeric" value={f.tarif} onChange={(e) => set('tarif', e.target.value)} placeholder="3 500" /></Field>
              </>
            )}
            <Msg error={error} />
            <button type="submit" className="ks-btn p w" disabled={busy}>{busy ? 'Création…' : 'Créer mon compte'}</button>
            <p className="ks-c">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
          </form>
        )}
      </main>
    </div>
  )
}
