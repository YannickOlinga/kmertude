import UserParentNavbar from '@/components/UserParentNavbar'
import './UserParent.css'

export default function UserParentPayments() {
  return (
    <div className="user-parent-page">
      <UserParentNavbar />
      <main className="user-parent-main">
        <header className="user-parent-header">
          <h1>Historique des paiements</h1>
          <p>Retrouvez tous les paiements liés à vos cours.</p>
        </header>
        <section className="panel">
          <div className="table-responsive">
            <table className="table-like">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Référence</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>02 avr. 2026</td><td>PAY-2026-041</td><td>45 000 FCFA</td><td><span className="badge-mini ok">Payé</span></td></tr>
                <tr><td>25 mars 2026</td><td>PAY-2026-038</td><td>32 500 FCFA</td><td><span className="badge-mini ok">Payé</span></td></tr>
                <tr><td>18 mars 2026</td><td>PAY-2026-035</td><td>55 000 FCFA</td><td><span className="badge-mini warn">En attente</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
