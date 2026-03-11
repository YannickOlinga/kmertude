import './UserProfile.css'
import UserNavbar from '../components/UserNavbar'
export default function UserProfile() {
  return (
    <>
    <UserNavbar></UserNavbar>
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mon profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div className="profile-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            <img src="/yannick.jpg" alt="Avatar" className="avatar" />
            <button className="change-avatar-btn">
              <svg viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Changer la photo
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h2>Informations personnelles</h2>
          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input type="text" id="firstName" name="firstName" defaultValue="Yannick" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <input type="text" id="lastName" name="lastName" defaultValue="Olinga" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" defaultValue="yannick.olinga@example.com" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input type="tel" id="phone" name="phone" defaultValue="+33 6 12 34 56 78" />
            </div>

            

            <div className="form-group">
              <label htmlFor="bio">Biographie</label>
              <textarea id="bio" name="bio" rows={4} placeholder="Parlez-vous brièvement..."></textarea>
            </div>
          </form>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h2>Adresse</h2>
          <form className="profile-form">
            <div className="form-group">
              <label htmlFor="address">Adresse</label>
              <input type="text" id="address" name="address" defaultValue="123 Rue de la République" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input type="text" id="city" name="city" defaultValue="Paris" />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Code postal</label>
                <input type="text" id="postalCode" name="postalCode" defaultValue="75001" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Pays</label>
              <input type="text" id="country" name="country" defaultValue="France" />
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="form-section">
          <h2>Sécurité</h2>
          <form className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input type="password" id="currentPassword" name="currentPassword" placeholder="Entrez votre mot de passe actuel" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input type="password" id="newPassword" name="newPassword" placeholder="Entrez le nouveau mot de passe" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmez le nouveau mot de passe" />
              </div>
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="form-section">
          <h2>Notifications</h2>
          <div className="notification-settings">
            <div className="notification-item">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
              <div className="notification-info">
                <h3>Notifications par email</h3>
                <p>Recevoir des notifications importantes par email</p>
              </div>
            </div>

            <div className="notification-item">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
              <div className="notification-info">
                <h3>Notifications push</h3>
                <p>Recevoir des notifications sur votre appareil</p>
              </div>
            </div>

            <div className="notification-item">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
              <div className="notification-info">
                <h3>Newsletter</h3>
                <p>Recevoir des actualités et offres spéciales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-cancel">Annuler</button>
          <button className="btn-save">Enregistrer les modifications</button>
        </div>
      </div>
    </div>
    </>
  )
}
