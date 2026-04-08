import UserParentNavbar from '@/components/UserParentNavbar'
import './UserParent.css'

export default function UserParentDashboard() {
  return (
    <div className="user-parent-page">
      <UserParentNavbar />
      <main className="user-parent-main">
        <header className="user-parent-header">
          <h1>Espace Parent</h1>
          <p>Suivez vos activités principales en un coup d'oeil.</p>
        </header>

        <section className="panel-grid">
          <article className="panel">
            <h2>Résumé rapide</h2>
            <div className="table-responsive">
              <table className="table-like">
                <tbody>
                  <tr><td>Offres actives</td><td>7</td></tr>
                  <tr><td>Enseignants recrutés</td><td>3</td></tr>
                  <tr><td>Candidatures reçues</td><td>18</td></tr>
                  <tr><td>Paiements du mois</td><td>132 500 FCFA</td></tr>
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel">
            <h2>Prochaines actions</h2>
            <div className="table-responsive">
              <table className="table-like">
                <tbody>
                  <tr><td>Valider 2 candidatures</td><td><span className="badge-mini warn">Urgent</span></td></tr>
                  <tr><td>Publier une offre de Physique</td><td><span className="badge-mini">À faire</span></td></tr>
                  <tr><td>Confirmer paiement #PAY-041</td><td><span className="badge-mini ok">En cours</span></td></tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
