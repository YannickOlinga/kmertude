// Champs alimentés par GET /referentiels (adresse camerounaise, classes, matières)
import { Field, SelectOther } from './ui'
import { useReferentiels, type Adresse } from './referentiels'

// Ville → Arrondissement → Quartier (+ point de repère). Pas de code postal.
export function AdresseFields({ value, onChange, repere = true }: { value: Adresse; onChange: (a: Adresse) => void; repere?: boolean }) {
  const refs = useReferentiels()
  const geo = refs?.geographie.communes_et_quartiers ?? {}
  const villes = refs?.geographie.villes_principales ?? Object.keys(geo)
  const arrondissements = Object.keys(geo[value.ville] ?? {})
  const quartiers = geo[value.ville]?.[value.arrondissement] ?? []
  return (
    <>
      <SelectOther label="Ville" options={villes} value={value.ville}
        onChange={(ville) => onChange({ ...value, ville, arrondissement: '', quartier: '' })} />
      <SelectOther key={`a-${value.ville}`} label="Arrondissement" options={arrondissements} value={value.arrondissement}
        onChange={(arrondissement) => onChange({ ...value, arrondissement, quartier: '' })} />
      <SelectOther key={`q-${value.ville}-${value.arrondissement}`} label="Quartier" options={quartiers} value={value.quartier}
        onChange={(quartier) => onChange({ ...value, quartier })} />
      {repere && (
        <Field label="Point de repère précis">
          <input value={value.repere ?? ''} placeholder="Ex. face à la pharmacie du carrefour" onChange={(e) => onChange({ ...value, repere: e.target.value })} />
        </Field>
      )}
    </>
  )
}
