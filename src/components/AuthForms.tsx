import { useState } from 'react'
import './AuthForms.css'

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('parent')

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* User Type Toggle */}
        <div className="user-type-toggle">
          <button 
            className={`type-btn ${userType === 'parent' ? 'active' : ''}`}
            onClick={() => setUserType('parent')}
          >
            Parent
          </button>
          <button 
            className={`type-btn ${userType === 'teacher' ? 'active' : ''}`}
            onClick={() => setUserType('teacher')}
          >
            Enseignant
          </button>
        </div>

        {/* Form Toggle */}
        <div className="form-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Connexion
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Inscription
          </button>
        </div>

        {/* Forms */}
        {isLogin ? (
          <LoginForm userType={userType} />
        ) : (
          <RegisterForm userType={userType} />
        )}
      </div>
    </div>
  )
}

function LoginForm({ userType }: { userType: string }) {
  return (
    <form className="auth-form">
      <h2>
        {userType === 'parent' ? 'Connexion Parent' : 'Connexion Enseignant'}
      </h2>
      
      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="votre.email@example.com" required />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="•••••••••" required />
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>Se souvenir de moi</span>
        </label>
        <a href="#" className="forgot-password">Mot de passe oublié?</a>
      </div>

      <button type="submit" className="submit-btn">
        Se connecter
      </button>

      <div className="social-login">
        <p>Ou continuer avec</p>
        <div className="social-buttons">
          <button type="button" className="social-btn google">
            <img src="/google-icon.png" alt="Google" />
            Google
          </button>
          <button type="button" className="social-btn facebook">
            <img src="/facebook-icon.png" alt="Facebook" />
            Facebook
          </button>
        </div>
      </div>
    </form>
  )
}

function RegisterForm({ userType }: { userType: string }) {
  return (
    <form className="auth-form">
      <h2>
        {userType === 'parent' ? 'Inscription Parent' : 'Inscription Enseignant'}
      </h2>

      {userType === 'teacher' && (
        <div className="form-group">
          <label>Type d'enseignant</label>
          <select required>
            <option value="">Sélectionner...</option>
            <option value="primary">Enseignant primaire</option>
            <option value="secondary">Enseignant secondaire</option>
            <option value="higher">Enseignant supérieur</option>
            <option value="tutor">Tuteur particulier</option>
          </select>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Nom</label>
          <input type="text" placeholder="Votre nom" required />
        </div>
        <div className="form-group">
          <label>Prénom</label>
          <input type="text" placeholder="Votre prénom" required />
        </div>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="votre.email@example.com" required />
      </div>

      <div className="form-group">
        <label>Téléphone</label>
        <input type="tel" placeholder="+237 6XX XXX XXX" required />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="Min 8 caractères" required />
      </div>

      <div className="form-group">
        <label>Confirmer mot de passe</label>
        <input type="password" placeholder="Répéter le mot de passe" required />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" required />
          <span>J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a></span>
        </label>
      </div>

      <button type="submit" className="submit-btn">
        {userType === 'parent' ? "S'inscrire en tant que Parent" : "S'inscrire en tant qu'Enseignant"}
      </button>

      <div className="form-divider">
        <span>Ou</span>
      </div>

      <div className="social-login">
        <div className="social-buttons">
          <button type="button" className="social-btn google">
            <img src="/google-icon.png" alt="Google" />
            Google
          </button>
          <button type="button" className="social-btn facebook">
            <img src="/facebook-icon.png" alt="Facebook" />
            Facebook
          </button>
        </div>
      </div>
    </form>
  )
}
