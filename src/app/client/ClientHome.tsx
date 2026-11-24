import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../AppShell'
import { Alert, Bd, Field, Loadable, Msg, SelectOther } from '../ui'
import { useReferentiels } from '../referentiels'
import {
  createAutoBeneficiaire, createBeneficiaire, listBeneficiaires, listCourses, updateBeneficiaire, type Beneficiaire,
} from '../../lib/backend'
import { errorMessage, useApi } from '../../lib/useApi'

type Mode = 'list' | 'child' | 'self' | { edit: Beneficiaire }
const EMPTY = { prenom: '', nom: '', classe_niveau: '', serie: '', etablissement_scolaire: '', besoins_specifiques: '' }

function BenefForm({ mode, onDone, onCancel }: { mode: Mode; onDone: () => void; onCancel: () => void }) {
  const refs = useReferentiels()
  const editing = typeof mode === 'object' ? mode.edit : null
  const self = mode === 'self' || (editing?.user_id != null)
  const [f, setF] = useState(editing ? {
    prenom: editing.prenom, nom: editing.nom, classe_niveau: editing.classe_niveau, serie: editing.serie ?? '',
    etablissement_scolaire: editing.etablissement_scolaire ?? '', besoins_specifiques: editing.besoins_specifiques ?? '',
  } : EMPTY)
  const [msg, setMsg] = useState<{ error?: string }>({})
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof EMPTY, v: string) => setF((x) => ({ ...x, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!f.classe_niveau) { setMsg({ error: 'Choisissez le niveau scolaire.' }); return }
    if (!self && (f.prenom.trim().length < 2 || f.nom.trim().length < 2)) { setMsg({ error: 'Prénom et nom requis.' }); return }
    setBusy(true)
    setMsg({})
    const data = {
      prenom: f.prenom.trim(),
      nom: f.nom.trim(),
      classe_niveau: f.classe_niveau,
      serie: f.serie || null,
      etablissement_scolaire: f.etablissement_scolaire.trim() || null,
      besoins_specifiques: f.besoins_specifiques.trim() || null,
    }
    try {
      if (editing) await updateBeneficiaire(editing.id, data)
      else if (self) await createAutoBeneficiaire({ ...data, prenom: data.prenom || undefined, nom: data.nom || undefined })
      else await createBeneficiaire(data)
      onDone()
    } catch (err) {
      setMsg({ error: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1>{editing ? 'Modifier la fiche' : self ? 'Mon profil apprenant' : 'Ajouter un élève'}</h1>
      <Field label={`Prénom${self ? ' (facultatif)' : ''}`}><input value={f.prenom} onChange={(e) => set('prenom', e.target.value)} placeholder="Junior" /></Field>
      <Field label={`Nom${self ? ' (facultatif)' : ''}`}><input value={f.nom} onChange={(e) => set('nom', e.target.value)} placeholder="Kamga" /></Field>
      <SelectOther label="Niveau scolaire" options={[...(refs?.systeme_educatif.toutes_les_classes ?? []), 'Adulte']} value={f.classe_niveau} onChange={(v) => set('classe_niveau', v)} />
      <SelectOther label="Série (facultatif)" options={refs?.systeme_educatif.series_secondaire ?? []} value={f.serie} onChange={(v) => set('serie', v)} placeholder="Aucune" />
      <Field label="Établissement"><input value={f.etablissement_scolaire} onChange={(e) => set('etablissement_scolaire', e.target.value)} placeholder="Lycée de Bonamoussadi" /></Field>
      <Field label="Besoins spécifiques"><textarea rows={2} value={f.besoins_specifiques} onChange={(e) => set('besoins_specifiques', e.target.value)} placeholder="Ex. difficultés en algèbre" /></Field>
      <Msg error={msg.error} />
      <div className="ks-row">
        <button type="button" className="ks-btn" onClick={onCancel}>Annuler</button>
        <button type="submit" className="ks-btn p" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  )
}

// 2A — Onboarding & bénéficiaires
export default function ClientHome() {
  const benefs = useApi(listBeneficiaires)
  const aConfirmer = useApi(() => listCourses({ status: 'declaree' }))
  const [mode, setMode] = useState<Mode>('list')

  const done = async () => { setMode('list'); await benefs.reload() }
  const list = (benefs.data ?? []).filter((b) => b.is_active)

  return (
    <AppShell>
      {mode !== 'list' ? (
        <BenefForm mode={mode} onDone={done} onCancel={() => setMode('list')} />
      ) : (
        <Loadable loading={benefs.loading} error={benefs.error} onRetry={benefs.reload}>
          {(aConfirmer.data?.length ?? 0) > 0 && (
            <Alert tone="wn">
              <b>{aConfirmer.data!.length} séance(s) à confirmer.</b> <Link to="/client/missions">Voir le compte rendu</Link>
            </Alert>
          )}
          {list.length === 0 ? (
            <>
              <h1>Bienvenue 👋</h1>
              <p className="ks-mu">Qui va suivre les cours ?</p>
              <button type="button" className="ks-bigcard" onClick={() => setMode('child')}>
                <b>J’inscris mon enfant / un proche</b>
                <span className="ks-mu ks-sm">Créer la fiche d’un élève</span>
              </button>
              <button type="button" className="ks-bigcard" onClick={() => setMode('self')}>
                <b>C’est pour moi-même (Apprenant adulte)</b>
                <span className="ks-mu ks-sm">Je suis l’apprenant</span>
              </button>
            </>
          ) : (
            <>
              <h1>Mes bénéficiaires</h1>
              {list.map((b) => (
                <div key={b.id} className="ks-card">
                  <div className="ks-sp">
                    <div>
                      <b>{b.nom_complet}</b>
                      <div className="ks-mu ks-sm">
                        {[b.classe_niveau, b.serie && `Série ${b.serie}`, b.etablissement_scolaire].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <Bd s={{ label: 'Actif', tone: 'ok' }} />
                  </div>
                  <div className="ks-row">
                    <Link to={`/client/demande?beneficiaire=${b.id}`} className="ks-btn p">Demander un cours</Link>
                    <button type="button" className="ks-btn" onClick={() => setMode({ edit: b })}>Modifier</button>
                  </div>
                </div>
              ))}
              <button type="button" className="ks-btn w" onClick={() => setMode('child')}>＋ Ajouter un enfant / proche</button>
              {!list.some((b) => b.user_id != null) && (
                <p className="ks-c ks-sm"><button type="button" className="ks-btn sm" style={{ marginTop: 10 }} onClick={() => setMode('self')}>Les cours sont aussi pour moi</button></p>
              )}
            </>
          )}
        </Loadable>
      )}
    </AppShell>
  )
}
