import { useState } from 'react'
import AppShell from '../AppShell'
import { Alert, Bd, Field, Loadable, Msg } from '../ui'
import {
  BORDEREAU_STATUT, FACTURE_STATUT, confirmerVersement, dateFr, emettreFacture, fcfa, genererBordereau, genererFacturesMensuelles,
  getCoordonneesEnseignant, getFamille, listBordereauxAdmin, listEnseignants, listFacturesAdmin, rapprochementManuel, validerBordereau,
  type Facture,
} from '../../lib/backend'
import { isCanonicalPhone, normalizePhone } from '../../lib/teacherApplications'
import { errorMessage, useApi } from '../../lib/useApi'

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
    <div>
      <h2>Rapprochement manuel (SMS)</h2>
      <Field label="Client">
        <select value={famille} onChange={(e) => setFamille(e.target.value)}>
          <option value="">{familleIds.length ? 'Choisir…' : 'Aucune facture ouverte'}</option>
          {familleIds.map((id) => <option key={id} value={id}>{noms.data?.get(id) ?? `Famille #${id}`}</option>)}
        </select>
      </Field>
      <Field label="Montant (FCFA)"><input inputMode="numeric" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="45 000" /></Field>
      <Field label="Opérateur">
        <select value={op} onChange={(e) => setOp(e.target.value as typeof op)}>
          <option value="mtn_momo">MTN MoMo</option><option value="orange_money">Orange Money</option>
        </select>
      </Field>
      <Field label="Code SMS reçu"><input value={sms} onChange={(e) => setSms(e.target.value)} /></Field>
      <Field label="Numéro payeur (facultatif)"><input type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="+237 6XX XX XX XX" /></Field>
      <Field label="Note de rapprochement"><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      {preview.length > 0 && (
        <div className="ks-card soft">
          <b>Ventilation automatique</b>
          <p className="ks-sm">
            {preview.map(({ f, alloue, soldee }) => (
              <span key={f.id}>Facture {f.numero_facture} {fcfa(alloue)} → {soldee ? 'soldée' : 'partiellement payée'}<br /></span>
            ))}
            {credit > 0 && <>Crédit client : {fcfa(credit)}</>}
          </p>
        </div>
      )}
      <Msg {...msg} />
      <button type="button" className="ks-btn p" disabled={busy} onClick={submit}>Valider le rapprochement</button>
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
      <h2>Bordereaux enseignants</h2>
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        <div className="ks-scroll">
          <table className="ks-table">
            <thead><tr><th>Prof</th><th>Période</th><th>Montant</th><th>MoMo</th><th>Statut</th></tr></thead>
            <tbody>
              {list.map((b) => {
                const c = data.data?.coords.get(b.enseignant_id)
                return (
                  <tr key={b.id}>
                    <td>{nom(b.enseignant_id)}</td>
                    <td>{dateFr(b.periode_debut)} → {dateFr(b.periode_fin)}</td>
                    <td>{fcfa(b.montant_total_fcfa)}</td>
                    <td>
                      {b.numero_mobile_money ?? c?.numero_mobile_money ?? '—'}{' '}
                      {c && <Bd s={c.est_verifie ? { label: 'Vérifié', tone: 'ok' } : { label: 'Non vérifié', tone: 'wn' }} />}
                    </td>
                    <td>
                      <Bd s={BORDEREAU_STATUT[b.statut]} />
                      {b.statut === 'brouillon' && (
                        <div className="ks-row"><button type="button" className="ks-btn sm" disabled={busy} onClick={() => run(() => validerBordereau(b.id), 'Bordereau validé.')}>Valider</button></div>
                      )}
                      {(b.statut === 'valide' || b.statut === 'en_cours_transfert') && (
                        <div className="ks-row">
                          <input className="ks-input" style={{ marginTop: 0 }} placeholder="Référence de transfert" value={refs[b.id] ?? ''} onChange={(e) => setRefs({ ...refs, [b.id]: e.target.value })} />
                          <button type="button" className="ks-btn sm ok" disabled={busy || !(refs[b.id] ?? '').trim()}
                            onClick={() => run(() => confirmerVersement(b.id, refs[b.id].trim()), 'Virement confirmé.')}>Confirmer le virement</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {list.length === 0 && <tr><td colSpan={5} className="ks-mu">Aucun bordereau.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="ks-card soft" style={{ marginTop: 12 }}>
          <h3>Générer un bordereau</h3>
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
          <button type="button" className="ks-btn" disabled={busy || !prof}
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
      <h2>Facturation mensuelle</h2>
      <div className="ks-g2">
        <Field label="Du"><input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></Field>
        <Field label="Au"><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} /></Field>
      </div>
      <button type="button" className="ks-btn" disabled={busy}
        onClick={() => run(async () => `${(await genererFacturesMensuelles({ periode_debut: debut, periode_fin: fin })).length} facture(s) générée(s) en brouillon.`)}>
        Générer les factures de la période
      </button>
      {brouillons.length > 0 && (
        <>
          <h3 style={{ marginTop: 12 }}>Brouillons à émettre</h3>
          {brouillons.map((f) => (
            <div key={f.id} className="ks-card ks-sp">
              <span>{f.numero_facture} · {fcfa(f.montant_total_fcfa)} · <Bd s={FACTURE_STATUT[f.statut]} /></span>
              <button type="button" className="ks-btn sm p" disabled={busy} onClick={() => run(async () => { await emettreFacture(f.id); return `Facture ${f.numero_facture} émise.` })}>Émettre</button>
            </div>
          ))}
        </>
      )}
      <Msg {...msg} />
    </div>
  )
}

// 4C — Finance : rapprochement SMS, bordereaux enseignants, facturation
export default function AdminFinance() {
  const factures = useApi(() => listFacturesAdmin())
  const retard = (factures.data ?? []).filter((f) => f.statut === 'en_retard')
  return (
    <AppShell>
      <h1>Finance</h1>
      {retard.length > 0 && <Alert tone="wn">{retard.length} facture(s) en retard · {fcfa(retard.reduce((s, f) => s + f.montant_solde_du_fcfa, 0))} à recouvrer.</Alert>}
      <Loadable loading={factures.loading} error={factures.error} onRetry={factures.reload}>
        <div className="ks-split">
          <Rapprochement factures={factures.data ?? []} onDone={factures.reload} />
          <Bordereaux />
        </div>
        <Facturation factures={factures.data ?? []} onDone={factures.reload} />
      </Loadable>
    </AppShell>
  )
}
