import { useState } from 'react'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Bd, Field, Loadable, Modal, Msg, type Status } from '../ui'
import {
  FACTURE_STATUT, dateFr, fcfa, getEncours, initierMomo, listFactures, type Facture,
} from '../../lib/backend'
import { isCanonicalPhone, normalizePhone } from '../../lib/teacherApplications'
import { useSession } from '../../lib/session'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'

type Operateur = 'mtn_momo' | 'orange_money'
const OPERATEURS: [Operateur, string][] = [['mtn_momo', 'MTN MoMo'], ['orange_money', 'Orange Money']]

const MOIS = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
const factureStatus = (f: Facture): Status =>
  f.statut === 'en_retard' ? { label: 'En retard', tone: 'er' } : FACTURE_STATUT[f.statut]
const payable = (f: Facture) => !f.est_soldee && f.montant_solde_du_fcfa > 0 && ['emise', 'partiellement_payee', 'en_retard'].includes(f.statut)

// 2D — Factures & paiement Mobile Money (pas de portefeuille)
export default function ClientFactures() {
  const session = useSession()
  const data = useApi(async () => {
    const factures = (await listFactures()).filter((f) => f.statut !== 'brouillon')
    const encours = factures[0] ? await getEncours(factures[0].famille_id).catch(() => null) : null
    return { factures, encours }
  })
  const [paying, setPaying] = useState<Facture | null>(null)
  const [op, setOp] = useState<Operateur>('mtn_momo')
  const [phone, setPhone] = useState(session?.user.phone ?? '')
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const pay = async () => {
    if (!paying) return
    if (!isCanonicalPhone(phone)) { setErr('Numéro camerounais à 9 chiffres commençant par 6.'); return }
    setBusy(true)
    setErr('')
    try {
      await initierMomo({ famille_id: paying.famille_id, montant: paying.montant_solde_du_fcfa, moyen_paiement: op, numero_telephone: normalizePhone(phone), facture_id: paying.id })
      setSent(true)
      await data.reload()
    } catch (x) {
      setErr(errorMessage(x))
    } finally {
      setBusy(false)
    }
  }
  const close = () => { setPaying(null); setSent(false); setErr('') }

  const enc = data.data?.encours
  const factures = data.data?.factures ?? []
  const aPayer = factures.filter(payable)
  const totalDu = aPayer.reduce((s, f) => s + f.montant_solde_du_fcfa, 0)

  return (
    <AppShell>
      <PageHero title="Mes factures" text="Une facture par mois, établie à partir des séances que vous avez confirmées. Paiement par Mobile Money." />

      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {enc && !enc.peut_creer_demande && (
          <div className="cp-block-banner" role="alert">
            <div>
              <b>Paiement en retard</b>
              <p>{enc.motif_blocage ?? 'Réglez vos factures en retard pour pouvoir déposer une nouvelle demande.'}</p>
            </div>
          </div>
        )}

        <div className="cf-summary">
          <div className={`ks-card cf-due ${totalDu > 0 ? 'has-due' : ''}`}>
            <span>Reste à payer</span>
            <b>{fcfa(totalDu)}</b>
            <small>{aPayer.length === 0 ? 'Vous êtes à jour 🎉' : `${aPayer.length} facture${aPayer.length > 1 ? 's' : ''} en attente`}</small>
            {aPayer.length > 0 && (
              <button type="button" className="ks-btn p" onClick={() => setPaying(aPayer[0]!)}>Payer la plus ancienne</button>
            )}
          </div>
          {enc && (
            <div className="ks-card cf-enc">
              <div><span>Encours total</span><b>{fcfa(enc.encours_net)}</b></div>
              <div><span>Facturé non soldé</span><b>{fcfa(enc.total_facture_non_solde)}</b></div>
              <div><span>Crédit disponible</span><b>{fcfa(enc.credit_disponible)}</b></div>
            </div>
          )}
        </div>

        <h2>Historique</h2>
        {factures.length === 0 ? (
          <div className="ks-card cp-empty"> 
            <b>Aucune facture pour le moment</b>
            <p className="ks-mu ks-sm">Elles sont émises chaque mois à partir des séances validées.</p>
          </div>
        ) : (
          <div className="ks-card cf-list">
            {factures.map((f) => (
              <div key={f.id} className={`cf-row ${f.statut === 'en_retard' ? 'late' : ''}`}>
                <div className="cf-month">
                  <b>{MOIS(f.periode_debut)}</b>
                  <span>N° {f.numero_facture} · échéance {dateFr(f.date_echeance)}</span>
                </div>
                <div className="cf-amount">
                  <b>{fcfa(f.montant_total_fcfa)}</b>
                  {f.montant_regle_fcfa > 0 && !f.est_soldee && <span>reste {fcfa(f.montant_solde_du_fcfa)}</span>}
                </div>
                <Bd s={factureStatus(f)} />
                <div className="cf-action">
                  {payable(f) && <button type="button" className="ks-btn p sm" onClick={() => setPaying(f)}>Payer</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Loadable>

      {paying && (
        <Modal title="Payer par Mobile Money" onClose={close}>
          {sent ? (
            <div className="cf-sent">
              <span className="cp-empty-ico">📲</span>
              <b>Demande envoyée</b>
              <p className="ks-mu ks-sm">Validez le paiement sur votre téléphone avec votre code secret. La facture sera mise à jour automatiquement.</p>
              <button type="button" className="ks-btn p w" onClick={close}>Fermer</button>
            </div>
          ) : (
            <>
              <div className="cf-topay">
                <span>{MOIS(paying.periode_debut)} · N° {paying.numero_facture}</span>
                <b>{fcfa(paying.montant_solde_du_fcfa)}</b>
              </div>
              <div className="ks-f">Opérateur</div>
              <div className="cf-ops" role="radiogroup">
                {OPERATEURS.map(([id, label]) => (
                  <button key={id} type="button" role="radio" aria-checked={op === id}
                    className={`cf-op ${id} ${op === id ? 'on' : ''}`} onClick={() => setOp(id)}>
                    <span className="cf-op-logo">{id === 'mtn_momo' ? 'MTN' : 'OM'}</span>
                    {label}
                  </button>
                ))}
              </div>
              <Field label="Numéro qui paie"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XX XX XX" /></Field>
              <Msg error={err} />
              <div className="ks-row">
                <button type="button" className="ks-btn" onClick={close}>Annuler</button>
                <button type="button" className="ks-btn p" disabled={busy} onClick={pay}>{busy ? 'Envoi…' : `Payer ${fcfa(paying.montant_solde_du_fcfa)}`}</button>
              </div>
            </>
          )}
        </Modal>
      )}
    </AppShell>
  )
}
