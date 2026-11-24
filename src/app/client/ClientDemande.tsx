import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppShell from '../AppShell'
import { Alert, Bd, Field, Loadable, Msg, Seg, SelectOther } from '../ui'
import { AdresseFields } from '../fields'
import { EMPTY_ADRESSE, useReferentiels, type Adresse } from '../referentiels'
import {
  DEMANDE_STATUT, MODALITE_LABEL, annulerDemande, createDemande, dateFr, fcfa, getEncours, listBeneficiaires, listDemandes,
  type Modalite,
} from '../../lib/backend'
import { ApiError } from '../../lib/api'
import { errorMessage, useApi } from '../../lib/useApi'

// 2B — Demander un cours. Le tarif n'est pas saisi : l'administration le fixe.
export default function ClientDemande() {
  const [params] = useSearchParams()
  const refs = useReferentiels()
  const data = useApi(async () => {
    const [benefs, demandes] = await Promise.all([listBeneficiaires(), listDemandes()])
    const familleId = benefs[0]?.famille_id ?? demandes[0]?.famille_id
    const encours = familleId ? await getEncours(familleId).catch(() => null) : null
    return { benefs: benefs.filter((b) => b.is_active), demandes, encours }
  })

  const [benef, setBenef] = useState(params.get('beneficiaire') ?? '')
  const [matiere, setMatiere] = useState('')
  const [modalite, setModalite] = useState<Modalite>('presentiel')
  const [heures, setHeures] = useState('2')
  const [adresse, setAdresse] = useState<Adresse>(EMPTY_ADRESSE)
  const [dispo, setDispo] = useState('')
  const [objectifs, setObjectifs] = useState('')
  const [rythme, setRythme] = useState('')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)
  const [blocked402, setBlocked402] = useState('')

  const enc = data.data?.encours
  const blocked = Boolean(blocked402) || (enc != null && !enc.peut_creer_demande)
  const chosen = data.data?.benefs.find((b) => String(b.id) === benef)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (blocked) return
    if (!chosen) { setMsg({ error: 'Choisissez le bénéficiaire.' }); return }
    if (!matiere.trim()) { setMsg({ error: 'Choisissez la matière.' }); return }
    if (!adresse.ville.trim() || !adresse.quartier.trim()) { setMsg({ error: 'Ville et quartier sont obligatoires.' }); return }
    setBusy(true)
    setMsg({})
    try {
      await createDemande({
        beneficiaire_id: chosen.id,
        matiere: matiere.trim(),
        niveau: chosen.classe_niveau,
        modalite,
        heures_semaine_souhaitees: Math.min(40, Math.max(1, Number.parseInt(heures, 10) || 2)),
        localisation_ville: adresse.ville.trim(),
        commune_arrondissement: adresse.arrondissement.trim() || null,
        localisation_quartier: adresse.quartier.trim(),
        localisation_point_repere: adresse.repere?.trim() || null,
        disponibilites: dispo.trim() || null,
        objectifs: objectifs.trim() || null,
        rythme: rythme || null,
      })
      setMatiere(''); setDispo(''); setObjectifs(''); setRythme('')
      setMsg({ ok: 'Demande envoyée ! Un conseiller vous appelle pour la qualifier et fixer le tarif.' })
      await data.reload()
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) setBlocked402(err.message)
      else setMsg({ error: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  const cancel = async (id: number) => {
    if (!window.confirm('Annuler cette demande ?')) return
    try { await annulerDemande(id); await data.reload() } catch (err) { window.alert(errorMessage(err)) }
  }

  return (
    <AppShell>
      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {blocked && (
          <Alert tone="er">
            <b>Nouvelle demande impossible.</b>{' '}
            {blocked402 || enc?.motif_blocage || 'Une facture est échue depuis plus de 10 jours.'}
            {enc && enc.total_facture_non_solde > 0 && <> ({fcfa(enc.total_facture_non_solde)})</>}
            <div className="ks-row"><Link to="/client/factures" className="ks-btn er">Régler ma facture</Link></div>
          </Alert>
        )}

        <h1>Demander un cours</h1>
        {data.data && data.data.benefs.length === 0 ? (
          <p>Ajoutez d’abord l’élève qui suivra les cours : <Link to="/client">Mes bénéficiaires</Link>.</p>
        ) : (
          <form onSubmit={submit} noValidate>
            <Field label="Bénéficiaire">
              <select value={benef} onChange={(e) => setBenef(e.target.value)}>
                <option value="">Choisir…</option>
                {data.data?.benefs.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.user_id != null ? 'Moi-même' : b.prenom} — {b.classe_niveau}{b.serie ? ` ${b.serie}` : ''}
                  </option>
                ))}
              </select>
            </Field>
            <SelectOther label="Matière" options={refs?.systeme_educatif.matieres_courantes ?? []} value={matiere} onChange={setMatiere} />
            <div className="ks-f">Modalité</div>
            <Seg value={modalite} onChange={setModalite} options={[['presentiel', 'Présentiel'], ['en_ligne', 'En ligne'], ['hybride', 'Hybride']]} />
            <Field label="Heures par semaine souhaitées"><input type="number" min={1} max={40} value={heures} onChange={(e) => setHeures(e.target.value)} /></Field>
            <AdresseFields value={adresse} onChange={setAdresse} />
            <SelectOther label="Rythme (facultatif)" options={refs?.systeme_educatif.rythmes_cours ?? []} value={rythme} onChange={setRythme} other={false} placeholder="Indifférent" />
            <Field label="Disponibilités"><textarea rows={2} value={dispo} onChange={(e) => setDispo(e.target.value)} placeholder="Mer. 16h–18h, sam. matin" /></Field>
            <Field label="Objectifs (facultatif)"><textarea rows={2} value={objectifs} onChange={(e) => setObjectifs(e.target.value)} placeholder="Ex. préparer le Probatoire" /></Field>
            <p className="ks-mu ks-sm">Le tarif est fixé par notre équipe après un appel de qualification.</p>
            <Msg {...msg} />
            <button type="submit" className="ks-btn p w" disabled={busy || blocked}>{busy ? 'Envoi…' : 'Envoyer ma demande'}</button>
          </form>
        )}

        {(data.data?.demandes.length ?? 0) > 0 && (
          <>
            <h2>Mes demandes</h2>
            {data.data!.demandes.map((d) => (
              <div key={d.id} className="ks-card">
                <div className="ks-sp">
                  <b>{d.matiere} · {d.niveau}</b>
                  <Bd s={DEMANDE_STATUT[d.statut]} />
                </div>
                <div className="ks-mu ks-sm">
                  {dateFr(d.date_soumission)} · {MODALITE_LABEL[d.modalite]} · {d.localisation_quartier}, {d.localisation_ville}
                  {d.tarif_horaire_client ? ` · ${fcfa(d.tarif_horaire_client)}/h` : ''}
                </div>
                {['soumise', 'en_cours_traitement'].includes(d.statut) && (
                  <div className="ks-row"><button type="button" className="ks-btn er sm" onClick={() => cancel(d.id)}>Annuler la demande</button></div>
                )}
              </div>
            ))}
          </>
        )}
      </Loadable>
    </AppShell>
  )
}
