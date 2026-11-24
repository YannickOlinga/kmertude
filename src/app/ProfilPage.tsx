import { useState, type FormEvent } from 'react'
import AppShell from './AppShell'
import { Field, Loadable, Msg } from './ui'
import { useEnseignant } from './enseignant/useEnseignant'
import { updateEnseignant, updateUser, type Enseignant } from '../lib/backend'
import { updateStoredUser, useSession, type User } from '../lib/session'
import { isCanonicalPhone, normalizePhone } from '../lib/teacherApplications'
import { isValidEmail } from '../lib/teacherRequests'
import { errorMessage } from '../lib/useApi'

function useForm(action: () => Promise<string>) {
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg({})
    try { setMsg({ ok: await action() }) } catch (x) { setMsg({ error: errorMessage(x) }) } finally { setBusy(false) }
  }
  return { msg, busy, submit }
}

function Infos({ user }: { user: User }) {
  const [f, setF] = useState({ first_name: user.first_name ?? '', last_name: user.last_name ?? '', email: user.email, phone: user.phone ?? '' })
  const { msg, busy, submit } = useForm(async () => {
    if (!isValidEmail(f.email)) throw new Error('Adresse email invalide.')
    if (f.phone && !isCanonicalPhone(f.phone)) throw new Error('Numéro camerounais à 9 chiffres commençant par 6.')
    updateStoredUser(await updateUser(user.id, {
      first_name: f.first_name.trim() || null, last_name: f.last_name.trim() || null,
      email: f.email.trim(), phone: f.phone ? normalizePhone(f.phone) : null,
    }))
    return 'Informations enregistrées.'
  })
  return (
    <form onSubmit={submit} className="ks-card" noValidate>
      <h3>Informations personnelles</h3>
      <div className="ks-g2">
        <Field label="Prénom"><input value={f.first_name} onChange={(e) => setF({ ...f, first_name: e.target.value })} /></Field>
        <Field label="Nom"><input value={f.last_name} onChange={(e) => setF({ ...f, last_name: e.target.value })} /></Field>
      </div>
      <Field label="Email"><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
      <Field label="Téléphone"><input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+237 6XX XX XX XX" /></Field>
      <Msg {...msg} />
      <button type="submit" className="ks-btn p" disabled={busy}>Enregistrer</button>
    </form>
  )
}

function ProfilPedagogique({ ens }: { ens: Enseignant }) {
  const [f, setF] = useState({
    specialites: ens.specialites ?? '', niveau_etudes: ens.niveau_etudes ?? '', experience: String(ens.experience_annees ?? 0),
    tarif: ens.tarif_horaire != null ? String(ens.tarif_horaire) : '', bio: ens.bio ?? '', methodologie: ens.methodologie ?? '', disponibilites: ens.disponibilites ?? '',
  })
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }))
  const { msg, busy, submit } = useForm(async () => {
    await updateEnseignant(ens.id, {
      specialites: f.specialites.trim() || null, niveau_etudes: f.niveau_etudes.trim() || null,
      experience_annees: Number.parseInt(f.experience, 10) || 0, tarif_horaire: Number.parseInt(f.tarif.replace(/\D/g, ''), 10) || null,
      bio: f.bio.trim() || null, methodologie: f.methodologie.trim() || null, disponibilites: f.disponibilites.trim() || null,
    })
    return 'Profil pédagogique enregistré.'
  })
  return (
    <form onSubmit={submit} className="ks-card" noValidate>
      <h3>Profil pédagogique</h3>
      <p className="ks-mu ks-sm">Présenté aux familles (prénom uniquement) lors des propositions.</p>
      <Field label="Spécialités"><input value={f.specialites} onChange={(e) => set('specialites', e.target.value)} /></Field>
      <div className="ks-g2">
        <Field label="Niveau d’études"><input value={f.niveau_etudes} onChange={(e) => set('niveau_etudes', e.target.value)} /></Field>
        <Field label="Années d’expérience"><input type="number" min={0} max={60} value={f.experience} onChange={(e) => set('experience', e.target.value)} /></Field>
      </div>
      <div className="ks-g2">
        <Field label="Tarif horaire souhaité (FCFA)"><input inputMode="numeric" value={f.tarif} onChange={(e) => set('tarif', e.target.value)} /></Field>
        <Field label="Disponibilités"><input value={f.disponibilites} onChange={(e) => set('disponibilites', e.target.value)} /></Field>
      </div>
      <Field label="Présentation"><textarea rows={3} value={f.bio} onChange={(e) => set('bio', e.target.value)} /></Field>
      <Field label="Méthodologie"><textarea rows={2} value={f.methodologie} onChange={(e) => set('methodologie', e.target.value)} /></Field>
      <Msg {...msg} />
      <button type="submit" className="ks-btn p" disabled={busy}>Enregistrer</button>
    </form>
  )
}

function TeacherSection() {
  const ens = useEnseignant()
  return (
    <Loadable loading={ens.loading} error={ens.error} onRetry={ens.reload}>
      {ens.data && <ProfilPedagogique ens={ens.data} />}
    </Loadable>
  )
}

export default function ProfilPage() {
  const session = useSession()
  if (!session) return null
  return (
    <AppShell>
      <h1>Mon profil</h1>
      <Infos key={session.user.updated_at} user={session.user} />
      {session.user.user_type === 'enseignant' && <TeacherSection />}
    </AppShell>
  )
}
