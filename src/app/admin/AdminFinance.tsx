import { useState } from 'react'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Icon, type IconName } from '../icons'
import { Bd, Field, Loadable, Msg, Seg } from '../ui'
import {
  BORDEREAU_STATUT, FACTURE_STATUT, confirmerVersement, dateFr, emettreFacture, fcfa, genererBordereau, genererFacturesMensuelles,
  getCoordonneesEnseignant, getFamille, listBordereauxAdmin, listEnseignants, listFacturesAdmin, rapprochementManuel, validerBordereau,
  type Facture,
} from '../../lib/backend'
import { isCanonicalPhone, normalizePhone } from '../../lib/teacherApplications'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'
import './admin.css'

const ouvertes = (f: Facture) => !f.est_soldee && f.montant_solde_du_fcfa > 0 && ['emise', 'partiellement_payee', 'en_retard'].includes(f.statut)
const isoDay = (d: Date) => d.toISOString().slice(0, 10)
const moisPrecedent = () => {
  const now = new Date()
  return { debut: isoDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)), fin: isoDay(new Date(now.getFullYear(), now.getMonth(), 0)) }
}

// Ventilation prévisionnelle : plus ancienne facture d'abord (le backend fait le calcul définitif)
function ventiler(factures: Facture[], montant: number) {
  let reste = montant
  return [...factures].sort((a, b) => a.date_echeance.localeCompare(b.date_echeance)).map((f) => {
    const alloue = Math.min(reste, f.montant_solde_du_fcfa)
    reste -= alloue
    return { f, alloue, soldee: alloue === f.montant_solde_du_fcfa }
  }).filter((x) => x.alloue > 0)
}

function Rapprochement({ factures, onDone }: { factures: Facture[]; onDone: () => void }) {
  const familleIds = [...new Set(factures.filter(ouvertes).map((f) => f.famille_id))]
  const noms = useApi(async () => new Map(await Promise.all(familleIds.map(async (id) => [id, (await getFamille(id).catch(() => null))?.user.full_name ?? `Famille #${id}`] as const))), [familleIds.join(',')])
  const [famille, setFamille] = useState('')
  const [montant, setMontant] = useState('')
  const [op, setOp] = useState<'mtn_momo' | 'orange_money'>('mtn_momo')
  const [sms, setSms] = useState('')
  const [tel, setTel] = useState('')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const m = Number.parseInt(montant.replace(/\D/g, ''), 10) || 0
  const fam = Number(famille)
  const preview = fam && m ? ventiler(factures.filter((f) => f.famille_id === fam && ouvertes(f)), m) : []
  const credit = m - preview.reduce((s, x) => s + x.alloue, 0)

  const submit = async () => {
    if (!fam || !m) { setMsg({ error: 'Client et montant requis.' }); return }
    if (sms.trim().length < 3) { setMsg({ error: 'Saisissez le code / la référence du SMS reçu.' }); return }
    if (note.trim().length < 3) { setMsg({ error: 'Note de rapprochement requise.' }); return }
    if (tel && !isCanonicalPhone(tel)) { setMsg({ error: 'Numéro payeur invalide.' }); return }
    setBusy(true)
    setMsg({})
    try {
      const p = await rapprochementManuel({
        famille_id: fam, montant: m, moyen_paiement: op, reference_sms_recu: sms.trim(), note_rapprochement: note.trim(),
        numero_telephone_payeur: tel ? normalizePhone(tel) : null,
      })
      setMsg({ ok: `Paiement rapproché (${p.reference_interne ?? `#${p.id}`}) : ${p.allocations.map((a) => `${a.numero_facture ?? a.facture_id} ← ${fcfa(a.montant_alloue)}`).join(', ') || 'versé en crédit'}.` })
      setMontant(''); setSms(''); setTel(''); setNote('')
      onDone()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-rappro">
      <div>
      <p className="ks-mu ks-sm ad-intro">Saisissez un paiement reçu par SMS : il est réparti automatiquement sur les factures ouvertes du client, de la plus ancienne à la plus récente.</p>
      <Field label="Client">
        <select value={famille} onChange={(e) => setFamille(e.target.value)}>
          <option value="">{familleIds.length ? 'Choisir…' : 'Aucune facture ouverte'}</option>
          {familleIds.map((id) => <option key={id} value={id}>{noms.data?.get(id) ?? `Famille #${id}`}</option>)}
        </select>
      </Field>
      <div className="ks-f">Opérateur</div>
      <Seg value={op} onChange={setOp} options={[['mtn_momo', 'MTN MoMo'], ['orange_money', 'Orange Money']]} />
      <div className="ks-g2">
        <Field label="Montant (FCFA)"><input inputMode="numeric" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="45 000" /></Field>
        <Field label="Code SMS reçu"><input value={sms} onChange={(e) => setSms(e.target.value)} placeholder="Ex. MP241124.1530.A12345" /></Field>
      </div>
      <Field label="Numéro payeur (facultatif)"><input type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="+237 6XX XX XX XX" /></Field>
      <Field label="Note de rapprochement"><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. paiement reçu sur le numéro agence" /></Field>
      </div>

      <aside className="ad-preview">
        <h3>Ventilation automatique</h3>
        {!fam || !m ? (
          <p className="ks-mu ks-sm">Choisissez le client et le montant pour voir la répartition.</p>
        ) : (
          <>
            {preview.length === 0 && <p className="ks-mu ks-sm">Aucune facture ouverte : tout le montant ira en crédit.</p>}
            {preview.map(({ f, alloue, soldee }) => (
              <div key={f.id} className="ad-alloc">
                <span><b>{f.numero_facture}</b><small>échéance {dateFr(f.date_echeance)}</small></span>
                <span className="ad-alloc-amt"><b>{fcfa(alloue)}</b><Bd s={soldee ? { label: 'Soldée', tone: 'ok' } : { label: 'Partielle', tone: 'wn' }} /></span>
              </div>
            ))}
            {credit > 0 && <div className="ad-alloc credit"><span><b>Crédit client</b><small>utilisé sur les prochaines factures</small></span><b>{fcfa(credit)}</b></div>}
            <div className="ad-alloc total"><span><b>Total reçu</b></span><b>{fcfa(m)}</b></div>
          </>
        )}
        <Msg {...msg} />
        <button type="button" className="ks-btn p w" disabled={busy} onClick={submit}>{busy ? 'Enregistrement…' : 'Valider le rapprochement'}</button>
      </aside>
    </div>
  )
}

function Bordereaux() {
  const data = useApi(async () => {
    const [bordereaux, profs] = await Promise.all([listBordereauxAdmin(), listEnseignants({ verified_only: true })])
    const ids = [...new Set(bordereaux.map((b) => b.enseignant_id))]
    const coords = new Map(await Promise.all(ids.map(async (id) => [id, await getCoordonneesEnseignant(id).catch(() => null)] as const)))
    return { bordereaux, profs: profs.filter((p) => p.statut_validation === 'valide'), coords }
  })
  const periode = moisPrecedent()
  const [prof, setProf] = useState('')
  const [debut, setDebut] = useState(periode.debut)
  const [fin, setFin] = useState(periode.fin)
  const [refs, setRefs] = useState<Record<number, string>>({})
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const run = async (action: () => Promise<unknown>, ok: string) => {
    setBusy(true)
    setMsg({})
    try { await action(); setMsg({ ok }); await data.reload() } catch (x) { setMsg({ error: errorMessage(x) }) } finally { setBusy(false) }
  }
  const nom = (id: number) => data.data?.profs.find((p) => p.id === id)?.user.full_name ?? `Enseignant #${id}`
  const list = [...(data.data?.bordereaux ?? [])].sort((a, b) => Number(a.statut === 'paye') - Number(b.statut === 'paye') || b.periode_debut.localeCompare(a.periode_debut))

  return (
    <div>
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {list.length === 0 && <p className="ks-mu ks-sm">Aucun bordereau pour le moment.</p>}
        <div className="ad-bords">
          {list.map((b) => {
            const c = data.data?.coords.get(b.enseignant_id)
            const numero = b.numero_mobile_money ?? c?.numero_mobile_money
            return (
              <article key={b.id} className={`ad-bord ${b.statut}`}>
                <div className="ad-bord-main">
                  <span className="ad-bord-id">
                    <b>{nom(b.enseignant_id)}</b>
                    <small>{dateFr(b.periode_debut)} → {dateFr(b.periode_fin)} · {b.lignes.length} séance{b.lignes.length > 1 ? 's' : ''}</small>
                  </span>
                  <b className="ad-bord-amt">{fcfa(b.montant_total_fcfa)}</b>
                  <Bd s={BORDEREAU_STATUT[b.statut]} />
                </div>
                <div className="ad-bord-pay">
                  <span className="ks-sm">
                    📱 {numero ?? 'Numéro Mobile Money manquant'}{' '}
                    {c && <Bd s={c.est_verifie ? { label: 'Vérifié', tone: 'ok' } : { label: 'Non vérifié', tone: 'wn' }} />}
                  </span>
                  {b.statut === 'brouillon' && (
                    <button type="button" className="ks-btn sm" disabled={busy} onClick={() => run(() => validerBordereau(b.id), 'Bordereau validé.')}>Valider le bordereau</button>
                  )}
                  {(b.statut === 'valide' || b.statut === 'en_cours_transfert') && (
                    <span className="ad-bord-ref">
                      <input className="ks-input" placeholder="Référence de transfert" value={refs[b.id] ?? ''} onChange={(e) => setRefs({ ...refs, [b.id]: e.target.value })} />
                      <button type="button" className="ks-btn sm ok" disabled={busy || !(refs[b.id] ?? '').trim()}
                        onClick={() => run(() => confirmerVersement(b.id, refs[b.id].trim()), 'Virement confirmé.')}>Confirmer le virement</button>
                    </span>
                  )}
                  {b.statut === 'paye' && b.date_paiement_effectif && <span className="ks-sm ks-mu">Payé le {dateFr(b.date_paiement_effectif)}</span>}
                </div>
              </article>
            )
          })}
        </div>

        <div className="ad-gen">
          <h3>Générer un bordereau</h3>
          <p className="ks-mu ks-sm">Seules les séances dont la famille a payé la facture sont incluses.</p>
          <Field label="Enseignant">
            <select value={prof} onChange={(e) => setProf(e.target.value)}>
              <option value="">Choisir…</option>
              {data.data?.profs.map((p) => <option key={p.id} value={p.id}>{p.user.full_name}</option>)}
            </select>
          </Field>
          <div className="ks-g2">
            <Field label="Du"><input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></Field>
            <Field label="Au"><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} /></Field>
          </div>
          <button type="button" className="ks-btn p" disabled={busy || !prof}
            onClick={() => run(() => genererBordereau({ enseignant_id: Number(prof), periode_debut: debut, periode_fin: fin }), 'Bordereau généré (fonds encaissés uniquement).')}>
            Générer un bordereau
          </button>
        </div>
      </Loadable>
      <Msg {...msg} />
    </div>
  )
}

function Facturation({ factures, onDone }: { factures: Facture[]; onDone: () => void }) {
  const periode = moisPrecedent()
  const [debut, setDebut] = useState(periode.debut)
  const [fin, setFin] = useState(periode.fin)
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)
  const brouillons = factures.filter((f) => f.statut === 'brouillon')

  const run = async (action: () => Promise<string>) => {
    setBusy(true)
    setMsg({})
    try { setMsg({ ok: await action() }); onDone() } catch (x) { setMsg({ error: errorMessage(x) }) } finally { setBusy(false) }
  }

  return (
    <div>
      <p className="ks-mu ks-sm ad-intro">1. Générez les factures de la période à partir des séances validées (elles sont créées en brouillon). 2. Vérifiez-les puis émettez-les : la famille les voit alors dans son espace, avec 10 jours pour payer.</p>
      <div className="ks-g2">
        <Field label="Du"><input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></Field>
        <Field label="Au"><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} /></Field>
      </div>
      <button type="button" className="ks-btn p" disabled={busy}
        onClick={() => run(async () => `${(await genererFacturesMensuelles({ periode_debut: debut, periode_fin: fin })).length} facture(s) générée(s) en brouillon.`)}>
        Générer les factures de la période
      </button>
      {brouillons.length > 0 && (
        <>
          <h3 className="ad-sub">Brouillons à émettre · {brouillons.length}</h3>
          <div className="cf-list ad-list-flat">
            {brouillons.map((f) => (
              <div key={f.id} className="cf-row ad-fact-row">
                <div className="cf-month">
                  <b>{f.numero_facture}</b>
                  <span>{dateFr(f.periode_debut)} → {dateFr(f.periode_fin)}</span>
                </div>
                <b>{fcfa(f.montant_total_fcfa)}</b>
                <Bd s={FACTURE_STATUT[f.statut]} />
                <button type="button" className="ks-btn sm p" disabled={busy} onClick={() => run(async () => { await emettreFacture(f.id); return `Facture ${f.numero_facture} émise.` })}>Émettre</button>
              </div>
            ))}
          </div>
        </>
      )}
      <Msg {...msg} />
    </div>
  )
}

type Tab = 'r' | 'b' | 'f'
const TABS: [Tab, string, IconName, string][] = [
  ['r', 'Rapprochement', 'wallet', 'Paiements reçus par SMS'],
  ['b', 'Bordereaux', 'receipt', 'Rémunération des enseignants'],
  ['f', 'Facturation', 'calendar', 'Factures mensuelles des familles'],
]

function Sum({ label, value, tone, hint }: { label: string; value: number; tone?: 'er' | 'wn'; hint: string }) {
  const n = new Intl.NumberFormat('fr-FR').format(value).replace(/[\u00a0\u202f]/g, ' ')
  return (
    <div className={`ad-sum ${tone && value > 0 ? tone : ''}`}>
      <span>{label}</span>
      <p><b>{n}</b><small>FCFA</small></p>
      <small>{hint}</small>
    </div>
  )
}

// 4C — Finance : rapprochement SMS, bordereaux enseignants, facturation
export default function AdminFinance() {
  const factures = useApi(() => listFacturesAdmin())
  const [tab, setTab] = useState<Tab>('r')
  const all = factures.data ?? []
  const retard = all.filter((f) => f.statut === 'en_retard')
  const ouv = all.filter(ouvertes)
  const brouillons = all.filter((f) => f.statut === 'brouillon')
  const somme = (l: Facture[], k: 'montant_solde_du_fcfa' | 'montant_total_fcfa') => l.reduce((s, f) => s + f[k], 0)

  return (
    <AppShell>
      <PageHero eyebrow="Back-office" title="Finance" text="Encaissements des familles, rémunération des enseignants et facturation mensuelle." />
      <Loadable loading={factures.loading} error={factures.error} onRetry={factures.reload}>
        <div className="ad-sums">
          <Sum label="À encaisser" value={somme(ouv, 'montant_solde_du_fcfa')} hint={`${ouv.length} facture${ouv.length > 1 ? 's' : ''} ouverte${ouv.length > 1 ? 's' : ''}`} />
          <Sum label="En retard" value={somme(retard, 'montant_solde_du_fcfa')} tone="er" hint={`${retard.length} facture${retard.length > 1 ? 's' : ''} à recouvrer`} />
          <Sum label="Brouillons à émettre" value={somme(brouillons, 'montant_total_fcfa')} tone="wn" hint={`${brouillons.length} facture${brouillons.length > 1 ? 's' : ''} en attente d’émission`} />
        </div>

        <div className="sp-tabs" role="tablist">
          {TABS.map(([id, label, icon, hint]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              <span className="sp-tab-ico"><Icon name={icon} /></span>
              <span><b>{label}</b><small>{hint}</small></span>
            </button>
          ))}
        </div>
        <section className="ks-card ad-panel">
          {tab === 'r' && <Rapprochement factures={all} onDone={factures.reload} />}
          {tab === 'b' && <Bordereaux />}
          {tab === 'f' && <Facturation factures={all} onDone={factures.reload} />}
        </section>
      </Loadable>
    </AppShell>
  )
}
