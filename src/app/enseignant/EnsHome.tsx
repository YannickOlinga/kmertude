import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Icon } from '../icons'
import { Loadable } from '../ui'
import { useEnseignant } from './useEnseignant'
import { getCoordonnees, listCourses, listMesDocuments, listMesPropositions, listMissions, listZones } from '../../lib/backend'
import { useSession } from '../../lib/session'
import { useApi } from '../../lib/useApi'
import '../space.css'
import './ens.css'

const STATUT = {
  en_attente: { tone: 'wn', ico: '⏳', title: 'Profil en attente de validation', text: 'Notre équipe vérifie votre dossier. Vous pourrez accepter des missions dès sa certification.' },
  valide: { tone: 'ok', ico: '✅', title: 'Profil certifié', text: 'Vous êtes prêt à recevoir des propositions de mission.' },
  refuse: { tone: 'er', ico: '⛔', title: 'Dossier refusé', text: 'Contactez l’équipe Kmertude pour en savoir plus.' },
  suspendu: { tone: 'er', ico: '⛔', title: 'Compte suspendu', text: 'Contactez l’équipe Kmertude.' },
} as const

// 3A — Tableau de bord : le statut de validation est le premier élément visible
export default function EnsHome() {
  const session = useSession()
  const ens = useEnseignant()
  const counts = useApi(async () => {
    const [props, missions, courses] = await Promise.all([
      listMesPropositions().catch(() => []),
      listMissions().catch(() => []),
      listCourses({ status: 'planifiee' }).catch(() => []),
    ])
    return {
      propositions: props.filter((p) => p.statut === 'en_attente').length,
      missions: missions.filter((m) => m.status === 'active').length,
      aDeclarer: courses.filter((c) => c.is_past).length,
    }
  })
  const dossier = useApi(async () => {
    const id = ens.data?.id
    const [zones, coord, docs] = await Promise.all([
      id ? listZones(id).catch(() => []) : Promise.resolve([]),
      getCoordonnees().catch(() => null),
      listMesDocuments().catch(() => []),
    ])
    return { zones: zones.length, momo: Boolean(coord), docs: docs.length }
  }, [ens.data?.id])

  const statut = STATUT[ens.data?.statut_validation ?? 'en_attente']
  const certifie = ens.data?.statut_validation === 'valide'
  const prenom = session?.user.first_name?.trim() || ''
  const c = counts.data
  const checklist = dossier.data ? [
    { done: dossier.data.zones > 0, label: 'Zones d’intervention', hint: 'Où pouvez-vous vous déplacer ?' },
    { done: dossier.data.momo, label: 'Numéro Mobile Money', hint: 'Pour recevoir vos rémunérations' },
    { done: dossier.data.docs > 0, label: 'Documents justificatifs', hint: 'Pièce d’identité, diplômes' },
  ] : []
  const nbDone = checklist.filter((x) => x.done).length

  return (
    <AppShell>
      <PageHero eyebrow="Espace enseignant" title={<>Bonjour{prenom ? ` ${prenom}` : ''} 👋</>}
        text="Retrouvez vos propositions, vos séances et vos rémunérations." />

      <Loadable loading={ens.loading} error={ens.error} onRetry={ens.reload}>
        <div className={`eh-status ${statut.tone}`}>
          <span className="eh-status-ico" aria-hidden="true">{statut.ico}</span>
          <div>
            <b>{statut.title}</b>
            <p>{statut.text}</p>
            {ens.data?.motif_statut_validation && <p><b>Motif :</b> {ens.data.motif_statut_validation}</p>}
          </div>
        </div>

        {(c?.aDeclarer ?? 0) > 0 && (
          <Link to="/enseignant/seance" className="ch-todo">
            <span className="ch-todo-ico"><Icon name="pen" /></span>
            <span>
              <b>{c!.aDeclarer} séance{c!.aDeclarer > 1 ? 's' : ''} à déclarer</b>
              <small>Envoyez le compte rendu pour être rémunéré.</small>
            </span>
            <span className="ch-todo-go" aria-hidden="true">→</span>
          </Link>
        )}

        <div className="ch-stats">
          <StatLink enabled={certifie} to="/enseignant/propositions" value={c?.propositions ?? '…'} label="Propositions en attente" tone={(c?.propositions ?? 0) > 0 ? 'wn' : undefined} />
          <StatLink enabled={certifie} to="/enseignant/seance" value={c?.missions ?? '…'} label="Missions actives" />
          <StatLink enabled={certifie} to="/enseignant/seance" value={c?.aDeclarer ?? '…'} label="Séances à déclarer" tone={(c?.aDeclarer ?? 0) > 0 ? 'wn' : undefined} />
        </div>

        {checklist.length > 0 && (
          <section className="ks-card eh-check">
            <div className="ks-sp">
              <h2>Mon dossier</h2>
              <span className={`ks-bd ${nbDone === checklist.length ? 'ok' : 'wn'}`}>{nbDone}/{checklist.length} complété</span>
            </div>
            <i className="cm-bar eh-bar"><i style={{ width: `${(nbDone / checklist.length) * 100}%` }} /></i>
            <ul>
              {checklist.map((x) => (
                <li key={x.label} className={x.done ? 'done' : ''}>
                  <span className="eh-tick" aria-hidden="true">{x.done ? <Icon name="check" size={16} /> : null}</span>
                  <span><b>{x.label}</b><small>{x.hint}</small></span>
                </li>
              ))}
            </ul>
            <Link to="/enseignant/dossier" className="ks-btn w">{nbDone === checklist.length ? 'Voir mon dossier' : 'Compléter mon dossier'}</Link>
          </section>
        )}
      </Loadable>
    </AppShell>
  )
}

function StatLink({ enabled, to, value, label, tone }: { enabled: boolean; to: string; value: number | string; label: string; tone?: 'wn' }) {
  const body = <><b>{value}</b><span>{label}</span></>
  return enabled
    ? <Link to={to} className={`ch-stat ${tone ?? ''}`}>{body}</Link>
    : <div className="ch-stat is-off" title="Disponible après la certification de votre profil">{body}</div>
}
