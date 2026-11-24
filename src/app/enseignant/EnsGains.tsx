import AppShell from '../AppShell'
import { Bd, Loadable } from '../ui'
import { useEnseignant } from './useEnseignant'
import { BORDEREAU_STATUT, dateFr, fcfa, listBordereaux, listSeancesEligibles } from '../../lib/backend'
import { useApi } from '../../lib/useApi'

// 3E — Rémunérations : en attente d'encaissement client vs débloquées ; versement par bordereau
export default function EnsGains() {
  const ens = useEnseignant()
  const data = useApi(async () => {
    const [bordereaux, eligibles] = await Promise.all([
      listBordereaux(),
      ens.data ? listSeancesEligibles(ens.data.id) : Promise.resolve([]),
    ])
    return { bordereaux, eligibles }
  }, [ens.data?.id])

  const elig = data.data?.eligibles ?? []
  // Part non encore payée par la famille → pas encore débloquée
  const enAttente = elig.reduce((s, x) => s + Math.max(0, x.remuneration_enseignant_totale - x.montant_deblocable_total), 0)
  const debloques = elig.reduce((s, x) => s + x.reste_a_verser, 0)
  const bordereaux = [...(data.data?.bordereaux ?? [])].sort((a, b) => b.periode_debut.localeCompare(a.periode_debut))

  return (
    <AppShell>
      <h1>Mes rémunérations</h1>
      <Loadable loading={ens.loading || data.loading} error={ens.error || data.error} onRetry={data.reload}>
        <div className="ks-g2">
          <div className="ks-card">
            <div className="ks-mu ks-sm">En attente d’encaissement client</div>
            <div className="ks-big">{fcfa(enAttente)}</div>
            {enAttente > 0 && <Bd s={{ label: 'Facture non payée', tone: 'wn' }} />}
          </div>
          <div className="ks-card">
            <div className="ks-mu ks-sm">Gains débloqués</div>
            <div className="ks-big">{fcfa(debloques)}</div>
            {debloques > 0 && <Bd s={{ label: 'Bordereau en préparation', tone: 'ok' }} />}
          </div>
        </div>

        <h2>Bordereaux</h2>
        {bordereaux.length === 0 && <p className="ks-state">Aucun bordereau pour le moment.</p>}
        {bordereaux.map((b) => (
          <div key={b.id} className="ks-card">
            <div className="ks-sp">
              <b style={{ textTransform: 'capitalize' }}>{new Date(b.periode_debut).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</b>
              <Bd s={BORDEREAU_STATUT[b.statut]} />
            </div>
            <div className="ks-sm ks-mu">
              {fcfa(b.montant_total_fcfa)} · {b.lignes.length} séance(s)
              {b.numero_mobile_money && ` · ${b.mode_reglement === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} ${b.numero_mobile_money}`}
              {' · Réf. '}{b.reference_bordereau}
              {b.date_paiement_effectif && ` · payé le ${dateFr(b.date_paiement_effectif)}`}
            </div>
          </div>
        ))}

        {elig.length > 0 && (
          <>
            <h2>Séances validées</h2>
            <div className="ks-scroll">
              <table className="ks-table">
                <thead><tr><th>Date</th><th>Élève</th><th>Matière</th><th>Débloqué</th></tr></thead>
                <tbody>
                  {elig.map((x) => (
                    <tr key={x.course_id}><td>{dateFr(x.date_heure_debut)}</td><td>{x.eleve_nom}</td><td>{x.matiere}</td><td>{fcfa(x.reste_a_verser)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Loadable>
    </AppShell>
  )
}
