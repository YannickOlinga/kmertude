import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './AuthForms.css'

export default function AuthForms() {
  const [searchParams] = useSearchParams()
  const roleFromQuery = searchParams.get('role')
  const isRoleLocked = roleFromQuery === 'parent' || roleFromQuery === 'teacher'
  const initialRole = roleFromQuery === 'teacher' ? 'teacher' : 'parent'
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<'parent' | 'teacher'>(initialRole)

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'parent' || role === 'teacher') {
      setUserType(role)
    }
  }, [searchParams])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-kicker">Kmertude</p>
          <h1>Espace Parent & Enseignant</h1>
          <p className="auth-subtitle">
            Sélectionnez votre profil puis choisissez connexion ou inscription.
          </p>
        </div>

        {!isRoleLocked && (
          <div className="role-cards">
            <button
              className={`role-card ${userType === 'parent' ? 'active' : ''}`}
              onClick={() => setUserType('parent')}
              type="button"
            >
              <span className="role-title">Parent</span>
              <span className="role-text">Gérez les cours et suivez la progression des enfants.</span>
            </button>
            <button
              className={`role-card ${userType === 'teacher' ? 'active' : ''}`}
              onClick={() => setUserType('teacher')}
              type="button"
            >
              <span className="role-title">Enseignant</span>
              <span className="role-text">Trouvez des élèves et développez votre activité.</span>
            </button>
          </div>
        )}

        <div className="form-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Connexion
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Inscription
          </button>
        </div>

        {userType === 'parent' ? (
          isLogin ? <ParentLoginForm /> : <ParentRegisterForm />
        ) : (
          isLogin ? <TeacherLoginForm /> : <TeacherRegisterForm />
        )}
      </div>
    </div>
  )
}

function ParentLoginForm() {
  return (
    <form className="auth-form">
      <h2>Connexion Parent</h2>
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

      <button type="submit" className="submit-btn">Se connecter</button>
    </form>
  )
}

function ParentRegisterForm() {
  return (
    <form className="auth-form">
      <h2>Inscription Parent</h2>
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
        <label>Nom de l'enfant</label>
        <input type="text" placeholder="Ex: Marie Dupont" required />
      </div>

      <div className="form-group">
        <label>Classe de l'enfant</label>
        <input type="text" placeholder="Ex: 4ème" required />
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
          <span>J'accepte les conditions d'utilisation et la politique de confidentialité</span>
        </label>
      </div>

      <button type="submit" className="submit-btn">S'inscrire en tant que Parent</button>
    </form>
  )
}

function TeacherLoginForm() {
  return (
    <form className="auth-form">
      <h2>Connexion Enseignant</h2>
      <div className="form-group">
        <label>Email professionnel</label>
        <input type="email" placeholder="pro.email@example.com" required />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="•••••••••" required />
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>Rester connecté</span>
        </label>
        <a href="#" className="forgot-password">Mot de passe oublié ?</a>
      </div>

      <button type="submit" className="submit-btn">Se connecter</button>
    </form>
  )
}

function TeacherRegisterForm() {
  return (
    <form className="auth-form">
      <h2>Inscription Enseignant</h2>
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
        <label>Email professionnel</label>
        <input type="email" placeholder="pro.email@example.com" required />
      </div>

      <div className="form-group">
        <label>Téléphone</label>
        <input type="tel" placeholder="+237 6XX XXX XXX" required />
      </div>

      <div className="form-group">
        <label>Matière principale</label>
        <input type="text" placeholder="Ex: Mathématiques" required />
      </div>

      <div className="form-group">
        <label>Années d'expérience</label>
        <input type="number" placeholder="Ex: 5" min="0" required />
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
          <span>J'accepte les conditions d'utilisation et la politique de confidentialité</span>
        </label>
      </div>

      <button type="submit" className="submit-btn">S'inscrire en tant qu'Enseignant</button>
    </form>
  )
}
