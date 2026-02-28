import UserNavbar from '../components/UserNavbar'
import './UserStudents.css'

export default function UserStudents() {
  return (
    <div className="user-students">
      <UserNavbar />

      <div className="content-wrapper">

        {/* Top Controls */}
        <div className="top-bar">
          <div className="left-controls">
            <input type="checkbox" id="hide" />
            <label htmlFor="hide">Masquer les cours terminés</label>
          </div>

          <div className="right-controls">
            <select>
              <option>2025/2026</option>
              <option>2024/2025</option>
            </select>
          </div>
        </div>

        {/* Student List */}
        <div className="students-container">

          <div className="student-card">
            <h3 className="student-title">Domitille LUISETTI</h3>

            <div className="student-row">
              <div className="student-left">
                <p> AVENUE DUTARTRE, LE CHESNAY</p>
                <p> Adulte Niv. 3ème</p>
                <p> 17 heure(s) réglée(s)</p>
              </div>

              <div className="student-right">
                <p> Informatique initiation MS Office</p>
                <span className="status finished">Cours Terminé</span>
              </div>
            </div>
          </div>

          <div className="student-card">
            <h3 className="student-title">Marven KADMI</h3>

            <div className="student-row">
              <div className="student-left">
                <p> AVENUE HENRI BARBUSSE, BAGNEUX</p>
                <p>6ème</p>
                <p>0 heure(s) réglée(s)</p>
              </div>

              <div className="student-right">
                <p>Mathématiques</p>
                <span className="status cancelled">Cours Annulé</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Button */}
        <div className="bottom-action">
          <button>
            ACCÉDER À MON ESPACE PÉDAGOGIQUE
          </button>
        </div>

      </div>
    </div>
  )
}