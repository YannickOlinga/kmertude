import { useState } from 'react'
import AppShell from '../AppShell'
import { Bd, Field, Loadable, Msg } from '../ui'
import {
  DEMANDE_STATUT, MODALITE_LABEL, PROPOSITION_STATUT, confirmerAffectation, createProposition, dateFr, fcfa, getBeneficiaire,
  getFamille, getProposition, listDemandes, listEnseignants, listZones, updateDemande, type DemandeAdmin, type Zone,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'

// L'API n'expose pas la liste des propositions d'une demande : on garde les ids émis depuis cet écran.
const SENT_KEY = 'kmertude:admin:propositions'
const readSent = (): Record<number, number[]> => { try { return JSON.parse(localStorage.getItem(SENT_KEY) ?? '{}') } catch { return {} } }
const addSent = (demande: number, prop: number) => {
  const all = readSent()
  all[demande] = [...new Set([...(all[demande] ?? []), prop])]
  try { localStorage.setItem(SENT_KEY, JSON.stringify(all)) } catch { /* ignore */ }
}

const norm = (s: string | null | undefined) => (s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

function Qualification({ demande, onSaved }: { demande: DemandeAdmin; onSaved: () => void }) {
  const ctx = useApi(async () => {
    const [famille, benef] = await Promise.all([
      getFamille(demande.famille_id).catch(() => null),
      getBeneficiaire(demande.beneficiaire_id).catch(() => null),
    ])
    return { famille, benef }
  }, [demande.id])
  const [tarif, setTarif] = useState(demande.tarif_horaire_client ? String(demande.tarif_horaire_client) : '')
  const [notes, setNotes] = useState(demande.notes_administratives ?? '')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)

  const save = async () => {
    const t = Number.parseInt(tarif.replace(/\D/g, ''), 10)
    if (!t) { setMsg({ error: 'Fixez le tarif client (FCFA/h).' }); return }
    setBusy(true)
    setMsg({})
    try {
      await updateDemande(demande.id, {
        tarif_horaire_client: t,
        notes_administratives: notes.trim() || null,
        ...(demande.statut === 'soumise' ? { statut: 'en_cours_traitement' as const } : {}),
      })
      setMsg({ ok: 'Qualification enregistrée.' })
      onSaved()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(false)
    }
  }

  const fam = ctx.data?.famille?.user
  const b = ctx.data?.benef
  return (
    <div>
      <div className="ks-sp"><h2>Demande #D-{demande.id}</h2><Bd s={DEMANDE_STATUT[demande.statut]} /></div>
      <div className="ks-card">
        {fam ? <>{fam.full_name} · {fam.phone ?? fam.email}</> : '…'}
        {b && <> · {b.prenom} ({b.classe_niveau}{b.serie ? ` ${b.serie}` : ''})</>}<br />
        {demande.matiere} · {MODALITE_LABEL[demande.modalite]} · {demande.heures_semaine_souhaitees} h/sem{demande.rythme ? ` · ${demande.rythme}` : ''}<br />
        {[demande.localisation_ville, demande.commune_arrondissement, demande.localisation_quartier].filter(Boolean).join(' · ')}
        {demande.localisation_point_repere && <> · {demande.localisation_point_repere}</>}<br />
        {demande.disponibilites && <span className="ks-mu">Dispo : {demande.disponibilites}<br /></span>}
        {demande.objectifs && <span className="ks-mu">Objectifs : {demande.objectifs}<br /></span>}
        {b?.besoins_specifiques && <span className="ks-mu">Besoins : {b.besoins_specifiques}<br /></span>}
        <span className="ks-mu ks-sm">Soumise le {dateFr(demande.date_soumission, true)}</span>
      </div>
      <Field label="Tarif client (FCFA/h)"><input inputMode="numeric" value={tarif} onChange={(e) => setTarif(e.target.value)} placeholder="5 000" /></Field>
      <Field label="Notes administratives"><textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <Msg {...msg} />
      <button type="button" className="ks-btn p" disabled={busy} onClick={save}>Enregistrer la qualification</button>
    </div>
  )
}

function Propositions({ demande, onChange }: { demande: DemandeAdmin; onChange: () => void }) {
  const [filtreMatiere, setFiltreMatiere] = useState(true)
  const [filtreQuartier, setFiltreQuartier] = useState(true)
  const profs = useApi(async () => {
    const list = await listEnseignants({ verified_only: true })
    const valides = list.filter((e) => e.statut_validation === 'valide')
    const zones = new Map<number, Zone[]>(await Promise.all(valides.map(async (e) => [e.id, await listZones(e.id).catch(() => [])] as const)))
    return { valides, zones }
  })
  const [tarifs, setTarifs] = useState<Record<number, string>>({})
  const [sentIds, setSentIds] = useState<number[]>(() => readSent()[demande.id] ?? [])
  const sent = useApi(() => Promise.all(sentIds.map((id) => getProposition(id).catch(() => null))), [sentIds.join(',')])
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState<number | null>(null)

  const client = demande.tarif_horaire_client
  const list = (profs.data?.valides ?? []).filter((e) => {
    if (filtreMatiere && !norm(e.specialites).includes(norm(demande.matiere))) return false
    if (filtreQuartier && demande.modalite !== 'en_ligne') {
      // Même ville, et même quartier ou rayon d'intervention d'au moins 5 km
      const zs = profs.data?.zones.get(e.id) ?? []
      return zs.some((z) => z.actif && norm(z.ville) === norm(demande.localisation_ville)
        && (!z.quartier || norm(z.quartier) === norm(demande.localisation_quartier) || (z.rayon_km ?? 0) >= 5))
    }
    return true
  }).sort((a, b) => b.note_sur_5 - a.note_sur_5)

  const send = async (enseignantId: number, defaut: number | null) => {
    const t = Number.parseInt((tarifs[enseignantId] ?? String(defaut ?? '')).replace(/\D/g, ''), 10)
    if (!client) { setMsg({ error: 'Enregistrez d’abord le tarif client (qualification).' }); return }
    if (!t) { setMsg({ error: 'Indiquez le tarif proposé à l’enseignant.' }); return }
    setBusy(enseignantId)
    setMsg({})
    try {
      const p = await createProposition({ demande_cours_id: demande.id, enseignant_id: enseignantId, tarif_horaire_propose: t, duree_validite_heures: 48 })
      addSent(demande.id, p.id)
      setSentIds(readSent()[demande.id] ?? [])
      setMsg({ ok: 'Proposition envoyée — expire dans 48 h.' })
      onChange()
    } catch (x) {
      setMsg({ error: errorMessage(x) })
    } finally {
      setBusy(null)
    }
  }
  const affecter = async (id: number) => {
    if (!window.confirm('Confirmer l’affectation officielle ? La mission sera créée et les coordonnées dévoilées.')) return
    try { await confirmerAffectation(id); await sent.reload(); onChange() } catch (x) { window.alert(errorMessage(x)) }
  }

  const byProf = new Map((sent.data ?? []).filter(Boolean).map((p) => [p!.enseignant_id, p!]))
  const name = (id: number) => profs.data?.valides.find((e) => e.id === id)?.user.full_name ?? `Enseignant #${id}`

  return (
    <div>
      <h2>Enseignants validés</h2>
      <div className="ks-row" style={{ marginBottom: 10 }}>
        {demande.modalite !== 'en_ligne' && (
          <button type="button" className={`ks-btn sm ${filtreQuartier ? 'p' : ''}`} onClick={() => setFiltreQuartier(!filtreQuartier)}>{demande.localisation_quartier}</button>
        )}
        <button type="button" className={`ks-btn sm ${filtreMatiere ? 'p' : ''}`} onClick={() => setFiltreMatiere(!filtreMatiere)}>{demande.matiere}</button>
      </div>
      <Msg {...msg} />

      {(sent.data?.filter(Boolean).length ?? 0) > 0 && (
        <div className="ks-card soft">
          <h3>Propositions envoyées</h3>
          {sent.data!.filter(Boolean).map((p) => (
            <div key={p!.id} className="ks-sp" style={{ marginBottom: 6 }}>
              <span className="ks-sm">{name(p!.enseignant_id)} · {fcfa(p!.tarif_horaire_propose)}/h</span>
              <span className="ks-row" style={{ marginTop: 0 }}>
                <Bd s={p!.statut === 'option_posee' ? { label: 'Accord du prof', tone: 'ok' } : PROPOSITION_STATUT[p!.statut]} />
                {p!.statut === 'option_posee' && <button type="button" className="ks-btn sm ok" onClick={() => affecter(p!.id)}>Confirmer l’affectation</button>}
              </span>
            </div>
          ))}
        </div>
      )}

      <Loadable loading={profs.loading} error={profs.error} onRetry={profs.reload} empty={!list.length} emptyText="Aucun enseignant validé ne correspond à ces filtres.">
        {list.map((e) => {
          const t = Number.parseInt((tarifs[e.id] ?? String(e.tarif_horaire ?? '')).replace(/\D/g, ''), 10) || 0
          const deja = byProf.get(e.id)
          return (
            <div key={e.id} className="ks-card">
              <div className="ks-sp"><b>{e.user.first_name} {e.user.last_name?.[0] ?? ''}.</b><span className="ks-mu">★ {e.note_sur_5.toFixed(1)} ({e.nombre_avis})</span></div>
              <div className="ks-mu ks-sm">
                {e.specialites} · {(profs.data?.zones.get(e.id) ?? []).map((z) => z.quartier ?? z.ville).join(', ') || 'zones non renseignées'}
              </div>
              <div className="ks-sp" style={{ marginTop: 6 }}>
                <label className="ks-sm">Proposé (FCFA/h)
                  <input className="ks-input" style={{ width: 110, display: 'inline-block', marginLeft: 6 }} inputMode="numeric"
                    value={tarifs[e.id] ?? String(e.tarif_horaire ?? '')} onChange={(x) => setTarifs({ ...tarifs, [e.id]: x.target.value })} />
                </label>
                <span className="ks-sm">{client ? `marge ${fcfa(client - t)}` : 'tarif client à fixer'}</span>
                {deja && ['en_attente', 'option_posee', 'acceptee'].includes(deja.statut)
                  ? <Bd s={{ label: deja.statut === 'en_attente' ? 'Envoyée · expire 48 h' : PROPOSITION_STATUT[deja.statut].label, tone: 'ok' }} />
                  : <button type="button" className="ks-btn sm p" disabled={busy === e.id} onClick={() => send(e.id, e.tarif_horaire)}>Envoyer une proposition</button>}
              </div>
            </div>
          )
        })}
      </Loadable>
    </div>
  )
}

// 4B — Qualification & proposition
export default function AdminDemandes() {
  const [statut, setStatut] = useState<'a_traiter' | 'affectee' | 'toutes'>('a_traiter')
  const demandes = useApi(async () => (await listDemandes()) as DemandeAdmin[])
  const [selected, setSelected] = useState<number | null>(null)

  const list = (demandes.data ?? []).filter((d) =>
    statut === 'toutes' ? true : statut === 'affectee' ? d.statut === 'affectee' : ['soumise', 'en_cours_traitement', 'proposee'].includes(d.statut))
    .sort((a, b) => a.date_soumission.localeCompare(b.date_soumission))
  const demande = list.find((d) => d.id === selected) ?? list[0]

  return (
    <AppShell>
      <h1>Demandes</h1>
      <div className="ks-row" style={{ marginBottom: 12 }}>
        {([['a_traiter', 'À traiter'], ['affectee', 'Affectées'], ['toutes', 'Toutes']] as const).map(([k, l]) => (
          <button key={k} type="button" className={`ks-btn sm ${statut === k ? 'p' : ''}`} onClick={() => setStatut(k)}>{l}</button>
        ))}
      </div>
      <Loadable loading={demandes.loading} error={demandes.error} onRetry={demandes.reload} empty={!list.length} emptyText="Aucune demande dans cette catégorie.">
        <div className="ks-scroll" style={{ marginBottom: 16 }}>
          <table className="ks-table">
            <thead><tr><th>#</th><th>Date</th><th>Matière</th><th>Lieu</th><th>Tarif client</th><th>Statut</th></tr></thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} onClick={() => setSelected(d.id)} style={{ cursor: 'pointer', background: d.id === demande?.id ? 'var(--ks-so)' : undefined }}>
                  <td>D-{d.id}</td><td>{dateFr(d.date_soumission)}</td><td>{d.matiere} · {d.niveau}</td>
                  <td>{d.localisation_quartier}, {d.localisation_ville}</td><td>{d.tarif_horaire_client ? fcfa(d.tarif_horaire_client) : '—'}</td>
                  <td><Bd s={DEMANDE_STATUT[d.statut]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {demande && (
          <div className="ks-split">
            <Qualification key={`q${demande.id}`} demande={demande} onSaved={demandes.reload} />
            <Propositions key={`p${demande.id}`} demande={demande} onChange={demandes.reload} />
          </div>
        )}
      </Loadable>
    </AppShell>
  )
}
