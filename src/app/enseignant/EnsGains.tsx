import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Icon, type IconName } from '../icons'
import { Bd, Loadable } from '../ui'
import { useEnseignant } from './useEnseignant'
import { BORDEREAU_STATUT, dateFr, fcfa, listBordereaux, listSeancesEligibles } from '../../lib/backend'
import { useApi } from '../../lib/useApi'
import '../space.css'
import './ens.css'

// Montant en grand, unité en petit : « 12 500 » + « FCFA »
function Counter({ tone, icon, label, amount, hint }: { tone: 'ok' | 'wn' | 'vi'; icon: IconName; label: string; amount: number; hint: string }) {
  const value = new Intl.NumberFormat('fr-FR').format(amount).replace(/[\u00a0\u202f]/g, ' ')
  return (
    <div className={`eg-counter ${tone} ${amount === 0 ? 'is-zero' : ''}`}>
      <div className="eg-counter-top">
        <span className="eg-counter-ico"><Icon name={icon} /></span>
        <span className="eg-counter-label">{label}</span>
      </div>
      <p className="eg-counter-amount"><b>{value}</b><span>FCFA</span></p>
      <small>{hint}</small>
    </div>
  )
}

const MOIS = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

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
  const totalVerse = bordereaux.filter((b) => b.statut === 'paye').reduce((s, b) => s + b.montant_total_fcfa, 0)

  return (
    <AppShell>
      <PageHero eyebrow="Espace enseignant" title="Mes rémunérations"
        text="Vos gains sont débloqués dès que la famille a réglé sa facture, puis versés par bordereau sur votre Mobile Money." />

      <Loadable loading={ens.loading || data.loading} error={ens.error || data.error} onRetry={data.reload}>
        <div className="eg-counters">
          <Counter tone="ok" icon="wallet" label="Gains débloqués" amount={debloques}
            hint={debloques > 0 ? 'Inclus dans le prochain bordereau' : 'Rien à verser pour le moment'} />
          <Counter tone="wn" icon="calendar" label="En attente du paiement" amount={enAttente}
            hint="Séances validées, facture de la famille pas encore réglée" />
          <Counter tone="vi" icon="check" label="Déjà versé" amount={totalVerse}
            hint="Bordereaux payés sur votre Mobile Money" />
        </div>

        <h2>Bordereaux</h2>
        {bordereaux.length === 0 ? (
          <div className="ks-card cp-empty">
             <b>Aucun bordereau pour le moment</b>
            <p className="ks-mu ks-sm">Un bordereau regroupe les séances débloquées d’une période et sert au virement.</p>
          </div>
        ) : (
          <div className="ks-card cf-list">
            {bordereaux.map((b) => (
              <div key={b.id} className="cf-row">
                <div className="cf-month">
                  <b>{MOIS(b.periode_debut)}</b>
                  <span>
                    Réf. {b.reference_bordereau} · {b.lignes.length} séance{b.lignes.length > 1 ? 's' : ''}
                    {b.numero_mobile_money && ` · ${b.mode_reglement === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} ${b.numero_mobile_money}`}
                  </span>
                </div>
                <div className="cf-amount">
                  <b>{fcfa(b.montant_total_fcfa)}</b>
                  {b.date_paiement_effectif && <span className="eg-paid">versé le {dateFr(b.date_paiement_effectif)}</span>}
                </div>
                <Bd s={BORDEREAU_STATUT[b.statut]} />
                <span />
              </div>
            ))}
          </div>
        )}

        {elig.length > 0 && (
          <>
            <h2>Séances validées</h2>
            <div className="ks-card eg-table">
              <div className="ks-scroll">
                <table className="ks-table">
                  <thead><tr><th>Date</th><th>Élève</th><th>Matière</th><th>Rémunération</th><th>Débloqué</th></tr></thead>
                  <tbody>
                    {elig.map((x) => (
                      <tr key={x.course_id}>
                        <td>{dateFr(x.date_heure_debut)}</td>
                        <td>{x.eleve_nom}</td>
                        <td>{x.matiere}</td>
                        <td>{fcfa(x.remuneration_enseignant_totale)}</td>
                        <td><b className={x.reste_a_verser > 0 ? 'eg-ok' : 'ks-mu'}>{fcfa(x.reste_a_verser)}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Loadable>
    </AppShell>
  )
}
