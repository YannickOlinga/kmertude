import UserNavbar from '../components/UserNavbar'
import './UserAccounts.css'

export default function UserAccounts() {
  return (
    <div className="user-students">
      <UserNavbar />

      <div className="page-wrapper">

        <div className="filter-bar">
          <div className="filter-item">
            <label>Employeur</label>
            <select>
              <option>Tous</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Période</label>
            <select>
              <option>Tous</option>
            </select>
          </div>
        </div>

        <div className="acompte-card">
          <p><strong>Période :</strong> Février 2026</p>
          <p><strong>Employeur :</strong> LUISETTI Domitille</p>
          <p><strong>Détail de l'acompte :</strong> Virement 3000...6394</p>
          <p><strong>Net à payer (€) :</strong> 73.40</p>
          <p><strong>Taux PAS :</strong> 0,00 %</p>
          <p><strong>Montant (€) PAS :</strong> 0,00</p>
          <p><strong>Etat :</strong> Réglé</p>
          <p><strong>Date du règlement :</strong> 17/02/2026</p>
          <p><strong>Nombre d'heures :</strong> 2</p>
        </div>

      </div>
    </div>
  )
}
