import UserParentNavbar from '@/components/UserParentNavbar'
import './UserParent.css'

export default function UserParentTeachers() {
  return (
    <div className="user-parent-page">
      <UserParentNavbar />
      <main className="user-parent-main">
        <header className="user-parent-header">
          <h1>Enseignants recrutés</h1>
          <p>Suivez les enseignants recrutés et leur activité.</p>
        </header>
        <section className="panel">
          <div className="table-responsive">
            <table className="table-like">
              <thead>
                <tr>
                  <th>Enseignant</th>
                  <th>Matière</th>
                  <th>Mode</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Nadine Njoya</td><td>Mathematiques</td><td>A domicile</td><td>4.9</td></tr>
                <tr><td>Julien Ewane</td><td>Anglais</td><td>En ligne</td><td>4.8</td></tr>
                <tr><td>Kevin Mba</td><td>Physique-Chimie</td><td>A domicile</td><td>4.7</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
