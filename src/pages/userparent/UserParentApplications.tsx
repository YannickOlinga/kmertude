import UserParentNavbar from '@/components/UserParentNavbar'
import './UserParent.css'

export default function UserParentApplications() {
  return (
    <div className="user-parent-page">
      <UserParentNavbar />
      <main className="user-parent-main">
        <header className="user-parent-header">
          <h1>Candidatures aux offres</h1>
          <p>Consultez les candidatures reçues et leur état de traitement.</p>
        </header>
        <section className="panel">
          <div className="table-responsive">
            <table className="table-like">
              <thead>
                <tr>
                  <th>Candidat</th>
                  <th>Offre</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Priscille Fokam</td><td>Soutien Maths - 3ème</td><td><span className="badge-mini">Nouveau</span></td><td>Examiner</td></tr>
                <tr><td>Arnaud Ndzi</td><td>Préparation Bac Philo</td><td><span className="badge-mini ok">En cours</span></td><td>Contacter</td></tr>
                <tr><td>Mireille Tchoua</td><td>Soutien Maths - 3ème</td><td><span className="badge-mini warn">À revoir</span></td><td>Programmer</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
