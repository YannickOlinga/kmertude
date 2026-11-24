import { useState } from 'react'
import AppShell from '../AppShell'
import { Alert, Bd, Field, Loadable, Modal, Msg, type Status } from '../ui'
import {
  FACTURE_STATUT, dateFr, fcfa, getEncours, initierMomo, listFactures, type Facture,
} from '../../lib/backend'
import { isCanonicalPhone, normalizePhone } from '../../lib/teacherApplications'
import { useSession } from '../../lib/session'
import { errorMessage, useApi } from '../../lib/useApi'

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
  const [op, setOp] = useState<'mtn_momo' | 'orange_money'>('mtn_momo')
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

  return (
    <AppShell>
      <h1>Mes factures</h1>
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {enc && (
          <div className="ks-card soft">
            <div className="ks-mu ks-sm">Encours actuel</div>
            <div className="ks-big">{fcfa(enc.encours_net)}</div>
            <div className="ks-sm ks-mu">
              {fcfa(enc.total_facture_non_solde)} facturés non soldés · Crédit disponible {fcfa(enc.credit_disponible)}
            </div>
          </div>
        )}
        {enc && !enc.peut_creer_demande && <Alert tone="er">{enc.motif_blocage ?? 'Réglez vos factures en retard pour pouvoir déposer une nouvelle demande.'}</Alert>}

        {data.data?.factures.length === 0 && <p className="ks-state">Aucune facture pour le moment. Elles sont émises chaque mois à partir des séances validées.</p>}
        {data.data?.factures.map((f) => (
          <div key={f.id} className="ks-card">
            <div className="ks-sp">
              <b style={{ textTransform: 'capitalize' }}>{MOIS(f.periode_debut)}</b>
              <Bd s={factureStatus(f)} />
            </div>
            <div className="ks-sp" style={{ marginTop: 6 }}>
              <span>
                {fcfa(f.montant_total_fcfa)}
                {f.montant_regle_fcfa > 0 && !f.est_soldee && <span className="ks-mu"> (reste {fcfa(f.montant_solde_du_fcfa)})</span>}
                <span className="ks-mu ks-sm"> · N° {f.numero_facture} · échéance {dateFr(f.date_echeance)}</span>
              </span>
              {payable(f) && <button type="button" className="ks-btn p sm" onClick={() => setPaying(f)}>Payer par Mobile Money</button>}
            </div>
          </div>
        ))}
      </Loadable>

      {paying && (
        <Modal title="Payer par Mobile Money" onClose={close}>
          {sent ? (
            <>
              <Alert tone="ok"><b>Demande envoyée.</b> Validez le paiement sur votre téléphone avec votre code secret.</Alert>
              <button type="button" className="ks-btn w" onClick={close}>Fermer</button>
            </>
          ) : (
            <>
              <label className="ks-check"><input type="radio" name="op" checked={op === 'mtn_momo'} onChange={() => setOp('mtn_momo')} />MTN MoMo</label>
              <label className="ks-check"><input type="radio" name="op" checked={op === 'orange_money'} onChange={() => setOp('orange_money')} />Orange Money</label>
              <Field label="Numéro payeur"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XX XX XX" /></Field>
              <p><b>Montant : {fcfa(paying.montant_solde_du_fcfa)}</b></p>
              <Msg error={err} />
              <div className="ks-row">
                <button type="button" className="ks-btn" onClick={close}>Annuler</button>
                <button type="button" className="ks-btn p" disabled={busy} onClick={pay}>{busy ? 'Envoi…' : 'Confirmer le paiement'}</button>
              </div>
            </>
          )}
        </Modal>
      )}
    </AppShell>
  )
}
