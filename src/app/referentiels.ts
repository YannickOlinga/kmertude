import { getReferentiels } from '../lib/backend'
import { useApi } from '../lib/useApi'

// GET /referentiels (mis en cache) : villes, quartiers, classes, matières…
export function useReferentiels() {
  return useApi(getReferentiels).data
}

export type Adresse = { ville: string; arrondissement: string; quartier: string; repere?: string }
export const EMPTY_ADRESSE: Adresse = { ville: '', arrondissement: '', quartier: '', repere: '' }
