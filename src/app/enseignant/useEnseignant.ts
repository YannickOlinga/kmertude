import { getEnseignant, resolveEnseignantId } from '../../lib/backend'
import { useSession } from '../../lib/session'
import { useApi } from '../../lib/useApi'

// Profil enseignant de l'utilisateur connecté (id + statut de validation)
export function useEnseignant() {
  const session = useSession()
  return useApi(async () => {
    if (!session) return null
    const id = await resolveEnseignantId(session.user)
    return id ? getEnseignant(id) : null
  }, [session?.user.id])
}
