import { useState } from 'react'
import './navbar.css'
import Button from './Button.tsx'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isStagesDropdownOpen, setIsStagesDropdownOpen] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null)
  const [stagesDropdownTimeout, setStagesDropdownTimeout] = useState<number | null>(null)

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    // Set timeout to close dropdown after 800ms
    const timeout = window.setTimeout(() => {
      setIsDropdownOpen(false)
    }, 800)
    setDropdownTimeout(timeout)
  }

  const handleStagesMouseEnter = () => {
    // Clear any existing timeout
    if (stagesDropdownTimeout) {
      clearTimeout(stagesDropdownTimeout)
      setStagesDropdownTimeout(null)
    }
    setIsStagesDropdownOpen(true)
  }

  const handleStagesMouseLeave = () => {
    // Set timeout to close dropdown after 800ms
    const timeout = window.setTimeout(() => {
      setIsStagesDropdownOpen(false)
    }, 800)
    setStagesDropdownTimeout(timeout)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Top bar with agency, phone and account */}
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

        {/* Main navigation */}
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
                    <div className="dropdown-section">
                      <h3>Cours particuliers</h3>
                      <ul>
                        <li><a href="/en-primaire">En primaire</a></li>
                        <li><a href="#">Au collège</a></li>
                        <li><a href= "#">Au lycée</a></li>
                        <li><a href="#">Dans le supérieur</a></li>
                        <li><a href="#">Pour adultes</a></li>
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
                    <div className="dropdown-image-section">
                      <img src="/m.jpg" alt="Crédit d'impôt immédiat" />
                      <div className="image-text">
                        <h4>Crédit d'impôt immédiat</h4>
                        <p>Tout savoir sur le crédit d'impôt immédiat</p>
                      </div>
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
                    <div className="dropdown-section">
                      <h3>Stages intensifs En visioconférence</h3>
                      <ul>
                        <li><a href="#">Hiver</a></li>
                        <li><a href="#">Printemps</a></li>
                      </ul>
                    </div>
                    <div className="dropdown-section">
                      <h3>Stages intensifs En présentiel</h3>
                      <ul>
                        <li><a href="#">Hiver</a></li>
                        <li><a href="#">Printemps</a></li>
                      </ul>
                    </div>
                    <div className="dropdown-section">
                      <h3>Journées prépa-examens En visioconférence</h3>
                      <ul>
                        <li><a href="#">Prépa-Brevet</a></li>
                        <li><a href="#">Prépa-Bac</a></li>
                      </ul>
                    </div>
                    <div className="dropdown-section">
                      <h3>Stages anglais oral En visioconférence</h3>
                      <ul>
                        <li><a href="#">Hiver</a></li>
                        <li><a href="#">Printemps</a></li>
                      </ul>
                    </div>
                    <div className="stages-methodo-box">
                      <h3>Stages de méthodologie</h3>
                      <p>Travailler efficacement, ça s'apprend !</p>
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
