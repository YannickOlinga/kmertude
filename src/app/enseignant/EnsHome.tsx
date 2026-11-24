import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import { Alert, Loadable } from '../ui'
import { useEnseignant } from './useEnseignant'
import { getCoordonnees, listMesDocuments, listMesPropositions, listMissions, listZones } from '../../lib/backend'
import { useApi } from '../../lib/useApi'

const STATUT_TEXT = {
  en_attente: { tone: 'wn', title: 'Profil en attente de validation administrative', text: 'Dossier en cours de vérification.' },
  valide: { tone: 'ok', title: 'Profil certifié — Prêt à recevoir des missions', text: '' },
  refuse: { tone: 'er', title: 'Dossier refusé', text: 'Contactez l’équipe Kmertude pour en savoir plus.' },
  suspendu: { tone: 'er', title: 'Compte suspendu', text: 'Contactez l’équipe Kmertude.' },
} as const

// 3A — Tableau de bord : le statut de validation est le premier élément visible
export default function EnsHome() {
  const ens = useEnseignant()
  const counts = useApi(async () => {
    const [props, missions] = await Promise.all([listMesPropositions(), listMissions()])
    return {
      propositions: props.filter((p) => p.statut === 'en_attente').length,
      missions: missions.filter((m) => m.status === 'active').length,
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

  const statut = ens.data ? STATUT_TEXT[ens.data.statut_validation] : STATUT_TEXT.en_attente
  const certifie = ens.data?.statut_validation === 'valide'
  const manque = dossier.data && [
    !dossier.data.zones && 'vos zones d’intervention',
    !dossier.data.momo && 'votre numéro Mobile Money',
    !dossier.data.docs && 'vos documents justificatifs',
  ].filter(Boolean)

  return (
    <AppShell>
      <Loadable loading={ens.loading} error={ens.error} onRetry={ens.reload}>
        <Alert tone={statut.tone}>
          <b>{statut.title}</b>
          {(statut.text || ens.data?.motif_statut_validation) && <br />}
          {statut.text} {ens.data?.motif_statut_validation && `Motif : ${ens.data.motif_statut_validation}`}
        </Alert>

        <div className="ks-g2">
          <div className="ks-card">
            <h3>Propositions</h3>
            <div className="ks-big">{counts.data?.propositions ?? '…'}</div>
            {certifie
              ? <Link to="/enseignant/propositions" className="ks-btn w">Voir</Link>
              : <button type="button" className="ks-btn w" disabled>Voir</button>}
          </div>
          <div className="ks-card">
            <h3>Missions actives</h3>
            <div className="ks-big">{counts.data?.missions ?? '…'}</div>
            {certifie
              ? <Link to="/enseignant/seance" className="ks-btn w">Voir</Link>
              : <button type="button" className="ks-btn w" disabled>Voir</button>}
          </div>
        </div>

        {manque && manque.length > 0 && (
          <p className="ks-mu ks-sm">Complétez votre dossier ({manque.join(', ')}) : <Link to="/enseignant/dossier">Mon dossier</Link></p>
        )}
        {!certifie && manque?.length === 0 && <p className="ks-mu ks-sm">Votre dossier est complet. <Link to="/enseignant/dossier">Voir mon dossier</Link></p>}
      </Loadable>
    </AppShell>
  )
}
