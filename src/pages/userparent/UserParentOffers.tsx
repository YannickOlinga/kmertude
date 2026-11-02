import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import UserParentNavbar from '@/components/UserParentNavbar'
import './UserParent.css'

type OfferStatus = 'Publiée' | 'Brouillon'

type Offer = {
  id: number
  title: string
  city: string
  candidates: number
  status: OfferStatus
}

const initialOffers: Offer[] = [
  { id: 1, title: 'Soutien Maths - 3ème', city: 'Douala', candidates: 12, status: 'Publiée' },
  { id: 2, title: "Cours d'Anglais - 6ème", city: 'Yaoundé', candidates: 0, status: 'Brouillon' },
  { id: 3, title: 'Préparation Bac Philo', city: 'Bafoussam', candidates: 6, status: 'Publiée' },
]

export default function UserParentOffers() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [title, setTitle] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<OfferStatus>('Brouillon')
  const [editingId, setEditingId] = useState<number | null>(null)

  const nextId = useMemo(() => {
    return offers.length ? Math.max(...offers.map((o) => o.id)) + 1 : 1
  }, [offers])

  const resetForm = () => {
    setTitle('')
    setCity('')
    setStatus('Brouillon')
    setEditingId(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !city.trim()) return

    if (editingId !== null) {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === editingId
            ? { ...offer, title: title.trim(), city: city.trim(), status }
            : offer
        )
      )
      resetForm()
      return
    }

    setOffers((prev) => [
      { id: nextId, title: title.trim(), city: city.trim(), candidates: 0, status },
      ...prev,
    ])
    resetForm()
  }

  const handleEdit = (offer: Offer) => {
    setEditingId(offer.id)
    setTitle(offer.title)
    setCity(offer.city)
    setStatus(offer.status)
  }

  const handleDelete = (id: number) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== id))
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="user-parent-page">
      <UserParentNavbar />
      <main className="user-parent-main">
        <header className="user-parent-header">
          <h1>Mes offres publiées</h1>
          <p>Créez, modifiez, supprimez et suivez les performances de vos offres.</p>
        </header>

        <section className="panel">
          <h2>{editingId !== null ? "Modifier l'offre" : 'Créer une offre'}</h2>
          <form className="offer-form" onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="offer-input"
              type="text"
              placeholder="Titre de l'offre"
              required
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="offer-input"
              type="text"
              placeholder="Ville"
              required
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OfferStatus)}
              className="offer-input"
            >
              <option value="Brouillon">Brouillon</option>
              <option value="Publiée">Publiée</option>
            </select>
            <div className="offer-form-actions">
              <button type="submit" className="btn-action primary">
                {editingId !== null ? 'Enregistrer' : 'Créer'}
              </button>
              {editingId !== null && (
                <button type="button" className="btn-action ghost" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="table-responsive">
            <table className="table-like">
              <thead>
                <tr>
                  <th>Offre</th>
                  <th>Ville</th>
                  <th>Candidatures</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.title}</td>
                    <td>{offer.city}</td>
                    <td>{offer.candidates}</td>
                    <td>
                      <span className={`badge-mini ${offer.status === 'Publiée' ? 'ok' : ''}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button type="button" className="btn-action ghost" onClick={() => handleEdit(offer)}>
                          Modifier
                        </button>
                        <button type="button" className="btn-action danger" onClick={() => handleDelete(offer.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
