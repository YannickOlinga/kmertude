import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppShell from '../AppShell'
import PageHero from '../PageHero'
import { Bd, Field, Loadable, Msg, Seg, SelectOther } from '../ui'
import { AdresseFields } from '../fields'
import { EMPTY_ADRESSE, useReferentiels, type Adresse } from '../referentiels'
import {
  DEMANDE_STATUT, MODALITE_LABEL, annulerDemande, createDemande, dateFr, fcfa, getEncours, listBeneficiaires, listDemandes,
  type DemandeStatut, type Modalite,
} from '../../lib/backend'
import { ApiError } from '../../lib/api'
import { errorMessage, useApi } from '../../lib/useApi'
import '../space.css'

const PROGRESS: DemandeStatut[] = ['soumise', 'en_cours_traitement', 'proposee', 'affectee']
const PROGRESS_LABEL = ['Envoyée', 'Qualifiée', 'Enseignant proposé', 'Affectée']

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="cd-block">
      <h2><span>{n}</span>{title}</h2>
      {children}
    </section>
  )
}

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
  const [heures, setHeures] = useState(2)
  const [adresse, setAdresse] = useState<Adresse>(EMPTY_ADRESSE)
  const [dispo, setDispo] = useState('')
  const [objectifs, setObjectifs] = useState('')
  const [rythme, setRythme] = useState('')
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const [busy, setBusy] = useState(false)
  const [blocked402, setBlocked402] = useState('')

  const enc = data.data?.encours
  const blocked = Boolean(blocked402) || (enc != null && !enc.peut_creer_demande)
  const benefs = data.data?.benefs ?? []
  const chosen = benefs.find((b) => String(b.id) === benef) ?? (benefs.length === 1 ? benefs[0] : undefined)
  const demandes = data.data?.demandes ?? []

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (blocked) return
    if (!chosen) { setMsg({ error: 'Choisissez l’élève concerné.' }); return }
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
        heures_semaine_souhaitees: Math.min(40, Math.max(1, heures)),
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
    <AppShell wide>
      <PageHero title="Demander un cours" text="Décrivez votre besoin en quelques minutes. Un conseiller vous rappelle pour fixer le tarif et choisir l’enseignant." />

      <Loadable loading={data.loading} error={data.error} onRetry={data.reload}>
        {blocked && (
          <div className="cp-block-banner" role="alert">
            <div>
              <b>Nouvelle demande impossible pour le moment</b>
              <p>
                {blocked402 || enc?.motif_blocage || 'Une facture est échue depuis plus de 10 jours.'}
                {enc && enc.total_facture_non_solde > 0 && <> Montant dû : <b>{fcfa(enc.total_facture_non_solde)}</b>.</>}
              </p>
            </div>
            <Link to="/client/factures" className="ks-btn er">Régler ma facture</Link>
          </div>
        )}

        <div className="cd-layout">
          {benefs.length === 0 ? (
            <div className="ks-card cp-empty">
              <span className="cp-empty-ico">👧🏾</span>
              <b>Ajoutez d’abord l’élève qui suivra les cours</b>
              <p className="ks-mu ks-sm">Sa classe et ses besoins nous aident à choisir le bon enseignant.</p>
              <Link to="/client" className="ks-btn p">Ajouter un élève</Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className={`ks-card cd-form ${blocked ? 'is-blocked' : ''}`}>
              <Block n={1} title="Pour qui ?">
                <div className="cd-who">
                  {benefs.map((b) => (
                    <button key={b.id} type="button" aria-pressed={chosen?.id === b.id}
                      className={chosen?.id === b.id ? 'on' : ''} onClick={() => setBenef(String(b.id))}>
                      <span className="cd-who-av">{(b.prenom?.[0] ?? '?').toUpperCase()}</span>
                      <span>
                        <b>{b.user_id != null ? 'Moi-même' : b.prenom}</b>
                        <small>{b.classe_niveau}{b.serie ? ` · ${b.serie}` : ''}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </Block>

              <Block n={2} title="Le cours">
                <SelectOther label="Matière" options={refs?.systeme_educatif.matieres_courantes ?? []} value={matiere} onChange={setMatiere} />
                <div className="ks-f">Modalité</div>
                <Seg value={modalite} onChange={setModalite} options={[['presentiel', 'À domicile'], ['en_ligne', 'En ligne'], ['hybride', 'Hybride']]} />
                <div className="ks-f">Heures par semaine</div>
                <div className="cd-stepper">
                  <button type="button" onClick={() => setHeures((h) => Math.max(1, h - 1))} aria-label="Moins d’heures">−</button>
                  <span><b>{heures}</b> h / semaine</span>
                  <button type="button" onClick={() => setHeures((h) => Math.min(40, h + 1))} aria-label="Plus d’heures">+</button>
                </div>
              </Block>

              <Block n={3} title={modalite === 'en_ligne' ? 'Votre localisation' : 'Où se déroulent les cours ?'}>
                <AdresseFields value={adresse} onChange={setAdresse} />
              </Block>

              <Block n={4} title="Vos préférences">
                <SelectOther label="Rythme (facultatif)" options={refs?.systeme_educatif.rythmes_cours ?? []} value={rythme} onChange={setRythme} other={false} placeholder="Indifférent" />
                <Field label="Disponibilités"><textarea rows={2} value={dispo} onChange={(e) => setDispo(e.target.value)} placeholder="Mer. 16h–18h, sam. matin" /></Field>
                <Field label="Objectifs (facultatif)"><textarea rows={2} value={objectifs} onChange={(e) => setObjectifs(e.target.value)} placeholder="Ex. préparer le Probatoire" /></Field>
              </Block>

              <div className="cd-foot">
                <p className="ks-mu ks-sm">💬 Le tarif est fixé par notre équipe après un appel de qualification, avant tout engagement.</p>
                <Msg {...msg} />
                <button type="submit" className="ks-btn p w" disabled={busy || blocked}>{busy ? 'Envoi…' : 'Envoyer ma demande'}</button>
              </div>
            </form>
          )}

          <aside className="cd-side">
            <h2>Mes demandes</h2>
            {demandes.length === 0 && <p className="ks-mu ks-sm">Vos demandes apparaîtront ici avec leur avancement.</p>}
            {demandes.map((d) => {
              const step = PROGRESS.indexOf(d.statut)
              return (
                <article key={d.id} className="ks-card cd-dem">
                  <div className="ks-sp">
                    <b>{d.matiere}</b>
                    <Bd s={DEMANDE_STATUT[d.statut]} />
                  </div>
                  <div className="ks-mu ks-sm">
                    {d.niveau} · {MODALITE_LABEL[d.modalite]} · {d.localisation_quartier}, {d.localisation_ville}
                  </div>
                  {step >= 0 && (
                    <ol className="cd-progress" aria-label="Avancement">
                      {PROGRESS_LABEL.map((l, i) => <li key={l} className={i <= step ? 'on' : ''} title={l} />)}
                    </ol>
                  )}
                  <div className="ks-sp ks-sm">
                    <span className="ks-mu">Envoyée le {dateFr(d.date_soumission)}</span>
                    {d.tarif_horaire_client ? <b>{fcfa(d.tarif_horaire_client)}/h</b> : null}
                  </div>
                  {['soumise', 'en_cours_traitement'].includes(d.statut) && (
                    <button type="button" className="cd-cancel" onClick={() => cancel(d.id)}>Annuler la demande</button>
                  )}
                </article>
              )
            })}
          </aside>
        </div>
      </Loadable>
    </AppShell>
  )
}
