import { useState } from 'react'
import './navbar.css'
import Button from './Button.tsx'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isStagesDropdownOpen, setIsStagesDropdownOpen] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null)
  const [stagesDropdownTimeout, setStagesDropdownTimeout] = useState<number | null>(null)

  const handleMouseEnter = () => {
    if (isStagesDropdownOpen) {
      setIsStagesDropdownOpen(false)
    }
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      setIsDropdownOpen(false)
    }, 800)
    setDropdownTimeout(timeout)
  }

    const handleStagesMouseEnter = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false)
    }
    if (stagesDropdownTimeout) {
      clearTimeout(stagesDropdownTimeout)
      setStagesDropdownTimeout(null)
    }
    setIsStagesDropdownOpen(true)
  }

  const handleStagesMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      setIsStagesDropdownOpen(false)
    }, 800)
    setStagesDropdownTimeout(timeout)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <div className="navbar-top-right">
            <div className="navbar-item navbar-agency">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Choisir mon agence</span>
            </div>
            <div className="navbar-item navbar-phone">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>06 22 24 49 94</span>
            </div>
            <div className="navbar-item navbar-account">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <a href="/user-home" style={{textDecoration: 'none', color: 'inherit'}}>Mon compte</a>
            </div>
          </div>
        </div>

        <nav className="navbar-main">
          <div className="navbar-logo">
            <div className="logo-content">
              <h1 className="logo-title">Kmertude</h1>
              <div className="logo-subtitle">
                <div className="logo-icon"></div>
                <span>soutien scolaire</span>
              </div>
            </div>
          </div>

          <div className="navbar-menu">
            <ul className="nav-links">
              <li 
                className="nav-item dropdown" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="nav-link">COURS PARTICULIERS</a>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-image-section">
                      <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=200&fit=crop&crop=center" alt="Cours particuliers" />
                      <div className="dropdown-image-content">
                        <h3>Excellence garantie</h3>
                        <p>Nos professeurs qualifiés vous accompagnent vers la réussite</p>
                        <button className="btn-tarif">VOIR MON TARIF</button>
                      </div>
                    </div>
                    <div className="dropdown-section">
                      <h3>Cours particuliers</h3>
                      <ul>
                        <li><a href="/en-primaire">En primaire</a></li>
                        <li><a href="/au-college">Au collège</a></li>
                        <li><a href="/au-lycee">Au lycée</a></li>
                        <li><a href="/dans-superieur">Dans le supérieur</a></li>
                        <li><a href="/pour-adultes">Pour adultes</a></li>
                      </ul>
                    </div>
                    <div className="dropdown-section">
                      <h3>Tarif</h3>
                      <ul>
                        <li><a href="#">Nos tarifs</a></li>
                        <li><a href="#">Crédit d'impôt immédiat</a></li>
                        <li><a href="#">Nos garanties</a></li>
                      </ul>
                      <button className="btn-tarif">VOIR MON TARIF</button>
                    </div>
                  </div>
                )}
              </li>
              <li 
                className="nav-item dropdown" 
                onMouseEnter={handleStagesMouseEnter} 
                onMouseLeave={handleStagesMouseLeave}
              >
                <a href="#" className="nav-link">STAGES EN PETITS GROUPES</a>
                {isStagesDropdownOpen && (
                  <div className="dropdown-menu stages-dropdown">
                    <div className="dropdown-image-section">
                      <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop&crop=center" alt="Stages" />
                      <div className="dropdown-image-content">
                        <h3>Stages d'excellence</h3>
                        <p>Des stages intensifs pour booster vos compétences</p>
                        <button className="btn-tarif">DÉCOUVRIR LES STAGES</button>
                      </div>
                    </div>
                    <div className="dropdown-section">
                      <h3>Stages scolaires</h3>
                      <ul>
                        <li><a href="#">Stage primaire</a></li>
                        <li><a href="#">Stage collège</a></li>
                        <li><a href="#">Stage lycée</a></li>
                      </ul>
                    </div>
                    <div className="dropdown-section">
                      <h3>Stages vacances</h3>
                      <ul>
                        <li><a href="#">Stage été</a></li>
                        <li><a href="#">Stage Toussaint</a></li>
                        <li><a href="#">Stage Noël</a></li>
                        <li><a href="#">Stage Hiver</a></li>
                        <li><a href="#">Stage Printemps</a></li>
                      </ul>
                    </div>
                    <div className="dropdown-section">
                      <h3>Préparation examens</h3>
                      <ul>
                        <li><a href="#">Brevet des collèges</a></li>
                        <li><a href="#">Baccalauréat</a></li>
                        <li><a href="#">Concours</a></li>
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            </ul>
            <Button />
          </div>
        </nav>
      </div>
    </header>
  )
}
