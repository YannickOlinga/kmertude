import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import '../space.css'
import { Field, Loadable, Msg, SelectOther } from '../ui'
import { Icon } from '../icons'
import { useReferentiels } from '../referentiels'
import {
  createAutoBeneficiaire, createBeneficiaire, listBeneficiaires, listCourses, listDemandes, listMissions, updateBeneficiaire,
  type Beneficiaire,
} from '../../lib/backend'
import { useSession } from '../../lib/session'
import { errorMessage, useApi } from '../../lib/useApi'

type Mode = 'list' | 'child' | 'self' | { edit: Beneficiaire }
const EMPTY = { prenom: '', nom: '', classe_niveau: '', serie: '', etablissement_scolaire: '', besoins_specifiques: '' }

function BenefForm({ mode, onDone, onCancel }: { mode: Mode; onDone: () => void; onCancel: () => void }) {
  const refs = useReferentiels()
  const editing = typeof mode === 'object' ? mode.edit : null
  const self = mode === 'self' || (editing?.user_id != null)
  const [f, setF] = useState(editing ? {
    prenom: editing.prenom, nom: editing.nom, classe_niveau: editing.classe_niveau, serie: editing.serie ?? '',
    etablissement_scolaire: editing.etablissement_scolaire ?? '', besoins_specifiques: editing.besoins_specifiques ?? '',
  } : EMPTY)
  const [msg, setMsg] = useState<{ error?: string }>({})
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof EMPTY, v: string) => setF((x) => ({ ...x, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!f.classe_niveau) { setMsg({ error: 'Choisissez le niveau scolaire.' }); return }
    if (!self && (f.prenom.trim().length < 2 || f.nom.trim().length < 2)) { setMsg({ error: 'Prénom et nom requis.' }); return }
    setBusy(true)
    setMsg({})
    const data = {
      prenom: f.prenom.trim(),
      nom: f.nom.trim(),
      classe_niveau: f.classe_niveau,
      serie: f.serie || null,
      etablissement_scolaire: f.etablissement_scolaire.trim() || null,
      besoins_specifiques: f.besoins_specifiques.trim() || null,
    }
    try {
      if (editing) await updateBeneficiaire(editing.id, data)
      else if (self) await createAutoBeneficiaire({ ...data, prenom: data.prenom || undefined, nom: data.nom || undefined })
      else await createBeneficiaire(data)
      onDone()
    } catch (err) {
      setMsg({ error: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="ch-form ks-card">
      <button type="button" className="ch-back" onClick={onCancel}>← Retour</button>
      <h1>{editing ? 'Modifier la fiche' : self ? 'Mon profil apprenant' : 'Ajouter un élève'}</h1>
      <p className="ks-mu ks-sm ch-form-lead">Ces informations aident notre équipe à choisir l’enseignant le plus adapté.</p>
      <Field label={`Prénom${self ? ' (facultatif)' : ''}`}><input value={f.prenom} onChange={(e) => set('prenom', e.target.value)} placeholder="Junior" /></Field>
      <Field label={`Nom${self ? ' (facultatif)' : ''}`}><input value={f.nom} onChange={(e) => set('nom', e.target.value)} placeholder="Kamga" /></Field>
      <SelectOther label="Niveau scolaire" options={[...(refs?.systeme_educatif.toutes_les_classes ?? []), 'Adulte']} value={f.classe_niveau} onChange={(v) => set('classe_niveau', v)} />
      <SelectOther label="Série (facultatif)" options={refs?.systeme_educatif.series_secondaire ?? []} value={f.serie} onChange={(v) => set('serie', v)} placeholder="Aucune" />
      <Field label="Établissement"><input value={f.etablissement_scolaire} onChange={(e) => set('etablissement_scolaire', e.target.value)} placeholder="Lycée de Bonamoussadi" /></Field>
      <Field label="Besoins spécifiques"><textarea rows={2} value={f.besoins_specifiques} onChange={(e) => set('besoins_specifiques', e.target.value)} placeholder="Ex. difficultés en algèbre" /></Field>
      <Msg error={msg.error} />
      <div className="ks-row">
        <button type="button" className="ks-btn" onClick={onCancel}>Annuler</button>
        <button type="submit" className="ks-btn p" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  )
}

const AVATAR_TONES = ['#6b46c1', '#22c55e', '#e91e63', '#0ea5e9', '#f59e0b']
const ACTIVE_DEMANDES = ['soumise', 'en_cours_traitement', 'proposee']

function Stat({ to, value, label, tone }: { to: string; value: number | string; label: string; tone?: 'wn' }) {
  return (
    <Link to={to} className={`ch-stat ${tone ?? ''}`}>
      <b>{value}</b>
      <span>{label}</span>
    </Link>
  )
}

// 2A — Onboarding & bénéficiaires
export default function ClientHome() {
  const session = useSession()
  const benefs = useApi(listBeneficiaires)
  const aConfirmer = useApi(() => listCourses({ status: 'declaree' }).catch(() => []))
  const missions = useApi(() => listMissions().catch(() => []))
  const demandes = useApi(() => listDemandes().catch(() => []))
  const [mode, setMode] = useState<Mode>('list')

  const done = async () => { setMode('list'); await benefs.reload() }
  const list = (benefs.data ?? []).filter((b) => b.is_active)
  const prenom = session?.user.first_name?.trim() || ''
  const nbConfirmer = aConfirmer.data?.length ?? 0
  const nbMissions = (missions.data ?? []).filter((m) => m.status === 'active').length
  const nbDemandes = (demandes.data ?? []).filter((d) => ACTIVE_DEMANDES.includes(d.statut)).length

  if (mode !== 'list') {
    return <AppShell><BenefForm mode={mode} onDone={done} onCancel={() => setMode('list')} /></AppShell>
  }

  return (
    <AppShell>
      <PageHero
        title={<>Bonjour{prenom ? ` ${prenom}` : ''} 👋</>}
        text={list.length === 0 ? 'Commençons par savoir qui va suivre les cours.' : 'Retrouvez ici le suivi des cours de votre famille.'}
        action={list.length > 0 && (
          <Link to="/client/demande" className="ks-btn p ch-hero-cta"><Icon name="plus" size={18} /> Demander un cours</Link>
        )}
      />

      <Loadable loading={benefs.loading} error={benefs.error} onRetry={benefs.reload}>
        {nbConfirmer > 0 && (
          <Link to="/client/missions" className="ch-todo">
            <span className="ch-todo-ico"><Icon name="check" /></span>
            <span>
              <b>{nbConfirmer} séance{nbConfirmer > 1 ? 's' : ''} à confirmer</b>
              <small>Lisez le compte rendu et confirmez sous 72 h.</small>
            </span>
            <span className="ch-todo-go" aria-hidden="true">→</span>
          </Link>
        )}

        {list.length === 0 ? (
          <>
            <div className="ch-onboard">
              <button type="button" className="ch-choice" onClick={() => setMode('child')}>
                <span className="ch-choice-ico">👧🏾</span>
                <b>J’inscris mon enfant ou un proche</b>
                <span>Créer la fiche d’un élève : classe, établissement, besoins.</span>
                <span className="ch-choice-go">Commencer →</span>
              </button>
              <button type="button" className="ch-choice" onClick={() => setMode('self')}>
                <span className="ch-choice-ico">🎓</span>
                <b>C’est pour moi-même</b>
                <span>Je suis l’apprenant (étudiant ou adulte).</span>
                <span className="ch-choice-go">Commencer →</span>
              </button>
            </div>
            <ol className="ch-steps">
              <li><b>1</b><span>Vous créez la fiche de l’élève</span></li>
              <li><b>2</b><span>Vous décrivez votre besoin</span></li>
              <li><b>3</b><span>Un conseiller vous rappelle et fixe le tarif</span></li>
              <li><b>4</b><span>Nous vous présentons l’enseignant</span></li>
            </ol>
          </>
        ) : (
          <>
            <div className="ch-stats">
              <Stat to="/client/missions" value={nbMissions} label="Cours en cours" />
              <Stat to="/client/demande" value={nbDemandes} label="Demandes en traitement" />
              <Stat to="/client/missions" value={nbConfirmer} label="Séances à confirmer" tone={nbConfirmer > 0 ? 'wn' : undefined} />
            </div>

            <div className="ch-head">
              <h2>Mes bénéficiaires</h2>
              <span className="ks-mu ks-sm">{list.length} élève{list.length > 1 ? 's' : ''}</span>
            </div>
            <div className="ch-grid">
              {list.map((b, i) => (
                <article key={b.id} className="ch-benef">
                  <div className="ch-benef-top">
                    <span className="ch-av" style={{ background: AVATAR_TONES[i % AVATAR_TONES.length] }} aria-hidden="true">
                      {(b.prenom?.[0] ?? '?').toUpperCase()}
                    </span>
                    <div className="ch-benef-id">
                      <b>{b.user_id != null ? `${b.nom_complet} (moi)` : b.nom_complet}</b>
                      {b.etablissement_scolaire && <span className="ks-mu ks-sm">{b.etablissement_scolaire}</span>}
                    </div>
                    <button type="button" className="ch-edit" onClick={() => setMode({ edit: b })} aria-label={`Modifier la fiche de ${b.prenom}`} title="Modifier">
                      <Icon name="pen" size={18} />
                    </button>
                  </div>
                  <div className="ch-tags">
                    <span>{b.classe_niveau}</span>
                    {b.serie && <span>Série {b.serie}</span>}
                  </div>
                  {b.besoins_specifiques && <p className="ks-sm ks-mu ch-needs">{b.besoins_specifiques}</p>}
                  <Link to={`/client/demande?beneficiaire=${b.id}`} className="ks-btn p w">Demander un cours</Link>
                </article>
              ))}
              <button type="button" className="ch-add" onClick={() => setMode('child')}>
                <span>＋</span>
                Ajouter un enfant ou un proche
              </button>
            </div>
            {!list.some((b) => b.user_id != null) && (
              <p className="ch-self">
                Les cours sont aussi pour vous ? <button type="button" onClick={() => setMode('self')}>Créer mon profil apprenant</button>
              </p>
            )}
          </>
        )}
      </Loadable>
    </AppShell>
  )
}
