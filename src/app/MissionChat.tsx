import { useState, type FormEvent } from 'react'
import { Loadable, Modal, Msg } from './ui'
import { dateFr, getConversationMission, listMessages, sendMessage } from '../lib/backend'
import { useSession } from '../lib/session'
import { errorMessage, useApi } from '../lib/useApi'

// Chat de mission en modale : GET /conversations/mission/{id}, messages, envoi
export default function MissionChat({ missionId, title, onClose }: { missionId: number; title: string; onClose: () => void }) {
  const session = useSession()
  const { data, loading, error, reload } = useApi(async () => {
    const conv = await getConversationMission(missionId)
    return { conv, messages: await listMessages(conv.id) }
  }, [missionId])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!data || !text.trim()) return
    setBusy(true)
    setErr('')
    try {
      await sendMessage(data.conv.id, text.trim())
      setText('')
      await reload()
    } catch (x) {
      setErr(errorMessage(x))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title={`Chat de mission · ${title}`} onClose={onClose}>
      <Loadable loading={loading} error={error} onRetry={reload}>
        <div className="ks-chat" aria-live="polite">
          {data?.messages.length === 0 && <p className="ks-state">Aucun message pour l’instant.</p>}
          {data?.messages.map((m) => (
            <div key={m.id} className={`ks-msg ${m.sender_user_id === session?.user.id ? 'mine' : ''}`}>
              {m.contenu}
              <small>{dateFr(m.date_envoi, true)}</small>
            </div>
          ))}
        </div>
      </Loadable>
      <form onSubmit={submit}>
        <label className="ks-f">Message<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire…" /></label>
        <Msg error={err} />
        <div className="ks-row">
          <button type="button" className="ks-btn" onClick={onClose}>Fermer</button>
          <button type="button" className="ks-btn" onClick={reload}>Actualiser</button>
          <button type="submit" className="ks-btn p" disabled={busy || !text.trim()}>Envoyer</button>
        </div>
      </form>
    </Modal>
  )
}
