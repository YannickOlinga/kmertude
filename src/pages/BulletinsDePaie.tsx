import React, { useState } from "react";
import "./BulletinsDePaie.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PaySlip {
  id: number;
  periode: string;
  employeur: string;
  nombreHeures: number;
  netAvantPAS: number;
  tauxPAS: number;
  montantPAS: number;
  netApresPAS: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SLIPS_DATA: PaySlip[] = [
  {
    id: 1,
    periode: "Octobre 2025",
    employeur: "LUISETTI Domitille",
    nombreHeures: 3,
    netAvantPAS: 110.10,
    tauxPAS: 0,
    montantPAS: 0,
    netApresPAS: 110.10,
  },
  {
    id: 2,
    periode: "Octobre 2025",
    employeur: "GIRAUD Fabien",
    nombreHeures: 3,
    netAvantPAS: 110.10,
    tauxPAS: 0,
    montantPAS: 0,
    netApresPAS: 110.10,
  },
  {
    id: 3,
    periode: "Septembre 2025",
    employeur: "LUISETTI Domitille",
    nombreHeures: 4,
    netAvantPAS: 146.80,
    tauxPAS: 0,
    montantPAS: 0,
    netApresPAS: 146.80,
  },
  {
    id: 4,
    periode: "Septembre 2025",
    employeur: "GIRAUD Fabien",
    nombreHeures: 2,
    netAvantPAS: 73.40,
    tauxPAS: 0,
    montantPAS: 0,
    netApresPAS: 73.40,
  },
];

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Accueil", icon: "🏠" },
  { label: "Mes élèves", icon: "👥" },
  { label: "Mes acomptes", icon: "💳" },
  { label: "Mes bulletins de paie", icon: "📄", active: true },
  { label: "Mes récapitulatifs annuels", icon: "📎" },
  { label: "Mes vidéos", icon: "🎥" },
  { label: "Mes documents utiles", icon: "⚫" },
  { label: "Mes contacts", icon: "📞" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (value: number): string =>
  value.toFixed(2).replace(".", ",");

const formatPct = (value: number): string =>
  `${value.toFixed(2).replace(".", ",")}%`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const SlipCard: React.FC<{ slip: PaySlip }> = ({ slip }) => {
  const handleDownload = () => {
    alert(`Téléchargement du bulletin : ${slip.employeur} — ${slip.periode}`);
  };

  return (
    <div className="slip-card">
      <div className="slip-field">
        <span className="slip-label">Période :</span>
        <span className="slip-value">{slip.periode}</span>
      </div>
      <div className="slip-field">
        <span className="slip-label">Employeur :</span>
        <span className="slip-value">{slip.employeur}</span>
      </div>
      <div className="slip-field">
        <span className="slip-label">Nombre d'heures :</span>
        <span className="slip-value">{slip.nombreHeures}</span>
      </div>
      <div className="slip-field">
        <span className="slip-label">Net à payer (€) avant PAS :</span>
        <span className="slip-value">{formatAmount(slip.netAvantPAS)}</span>
      </div>
      <div className="slip-field">
        <span className="slip-label">Taux PAS :</span>
        <span className="slip-value">{formatPct(slip.tauxPAS)}</span>
      </div>
      <div className="slip-field">
        <span className="slip-label">Montant (€) PAS :</span>
        <span className="slip-value">{formatAmount(slip.montantPAS)}</span>
      </div>
      <div className="slip-field">
        <span className="slip-label">Net à payer (€) après PAS :</span>
        <span className="slip-value">{formatAmount(slip.netApresPAS)}</span>
      </div>
      <div className="slip-actions">
        <button className="btn-download" onClick={handleDownload}>
          <span className="btn-icon">📄</span>
          TÉLÉCHARGER
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BulletinsDePaie: React.FC = () => {
  const [employeurFilter, setEmployeurFilter] = useState<string>("Tous");
  const [periodeFilter, setPeriodeFilter] = useState<string>("Tous");

  // Unique values for filter dropdowns
  const employeurs = ["Tous", ...Array.from(new Set(SLIPS_DATA.map((s) => s.employeur)))];
  const periodes = ["Tous", ...Array.from(new Set(SLIPS_DATA.map((s) => s.periode)))];

  const filteredSlips = SLIPS_DATA.filter((slip) => {
    const matchEmployeur = employeurFilter === "Tous" || slip.employeur === employeurFilter;
    const matchPeriode = periodeFilter === "Tous" || slip.periode === periodeFilter;
    return matchEmployeur && matchPeriode;
  });

  return (
    <div>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="navbar-logo-text">
            complétude<span>✕</span>
          </div>
          <div className="navbar-logo-sub">soutien scolaire</div>
        </div>

        <ul className="navbar-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={item.active ? "active" : ""}
                onClick={(e) => e.preventDefault()}
              >
                <span className="navbar-icon">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button className="navbar-user" aria-label="Mon compte">
          👤
        </button>
      </nav>

      {/* ── Page Body ── */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="filter-employeur">Employeur</label>
              <select
                id="filter-employeur"
                value={employeurFilter}
                onChange={(e) => setEmployeurFilter(e.target.value)}
              >
                {employeurs.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-periode">Période</label>
              <select
                id="filter-periode"
                value={periodeFilter}
                onChange={(e) => setPeriodeFilter(e.target.value)}
              >
                {periodes.map((per) => (
                  <option key={per} value={per}>
                    {per}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slips list */}
          <div className="slips-container">
            {filteredSlips.length > 0 ? (
              filteredSlips.map((slip) => <SlipCard key={slip.id} slip={slip} />)
            ) : (
              <p style={{ padding: "24px", color: "#888", textAlign: "center" }}>
                Aucun bulletin trouvé.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulletinsDePaie;
