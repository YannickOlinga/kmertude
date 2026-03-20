import { useState } from 'react'

export default function TeacherOffers() {
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    location: 'all',
    contract: 'all'
  })

  const offers = [
    {
      id: 1,
      title: "Professeur de Mathématiques",
      company: "Kmertude Excellence",
      location: "Douala, Cameroun",
      type: "Cours particuliers",
      contract: "Freelance",
      salary: "15-25€/heure",
      tags: ["Mathématiques", "Lycée", "Préparation examens"],
      logo: "🎓",
      featured: true,
      new: false,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Professeur de Physique-Chimie",
      company: "Kmertude Stages",
      location: "Yaoundé, Cameroun", 
      type: "Stages en groupes",
      contract: "CDD saisonnier",
      salary: "20-30€/heure",
      tags: ["Physique", "Chimie", "Stages vacances"],
      logo: "🔬",
      featured: true,
      new: true,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Tuteur en Ligne - Anglais",
      company: "Kmertude Digital",
      location: "Télétravail",
      type: "Soutien en ligne",
      contract: "Freelance",
      salary: "12-20€/heure",
      tags: ["Anglais", "Télétravail", "Flexibilité"],
      logo: "💻",
      featured: false,
      new: true,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Professeur de Français",
      company: "Kmertude Primaire",
      location: "Bafoussam, Cameroun",
      type: "Cours particuliers",
      contract: "Freelance", 
      salary: "10-18€/heure",
      tags: ["Français", "Primaire", "Collège"],
      logo: "📚",
      featured: false,
      new: false,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop&crop=center"
    },
    {
      id: 5,
      title: "Coach en Programmation",
      company: "Kmertude Code",
      location: "Télétravail",
      type: "Soutien en ligne",
      contract: "Freelance",
      salary: "25-35€/heure",
      tags: ["Programmation", "Web", "Mobile"],
      logo: "💻",
      featured: false,
      new: false,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&crop=center"
    },
    {
      id: 6,
      title: "Professeur d'Histoire-Géographie",
      company: "Kmertude Culture",
      location: "Garoua, Cameroun",
      type: "Cours particuliers",
      contract: "Freelance",
      salary: "12-20€/heure", 
      tags: ["Histoire", "Géographie", "Culture générale"],
      logo: "🌍",
      featured: false,
      new: false,
      image: "https://images.unsplash.com/photo-1456513080510-28bf7a4b754c?w=400&h=200&fit=crop&crop=center"
    }
  ]

  return (
  <div className="jobs-page">

    {/* HEADER */}
    <div className="jobs-header">
      <h1>Offres d’enseignement</h1>
      <p>{offers.length} opportunités disponibles</p>
    </div>

    <div className="jobs-container">

      {/* SIDEBAR FILTERS */}
      <aside className="jobs-filters">

        <h3>Filtres</h3>

        <div className="filter-group">
          <label>Type</label>
          <select
            value={selectedFilters.type}
            onChange={(e) =>
              setSelectedFilters({ ...selectedFilters, type: e.target.value })
            }
          >
            <option value="all">Tous</option>
            <option value="particuliers">Cours particuliers</option>
            <option value="stages">Stages</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ville</label>
          <select
            value={selectedFilters.location}
            onChange={(e) =>
              setSelectedFilters({ ...selectedFilters, location: e.target.value })
            }
          >
            <option value="all">Toutes</option>
            <option value="douala">Douala</option>
            <option value="yaounde">Yaoundé</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Contrat</label>
          <select
            value={selectedFilters.contract}
            onChange={(e) =>
              setSelectedFilters({ ...selectedFilters, contract: e.target.value })
            }
          >
            <option value="all">Tous</option>
            <option value="freelance">Freelance</option>
            <option value="cdd">CDD</option>
          </select>
        </div>

      </aside>

      {/* JOB LIST */}
      <div className="jobs-list">

        {offers.map((offer) => (
          <div key={offer.id} className="job-card">

            <img src={offer.image} alt="" />

            <div className="job-content">

              <div className="job-header">
                <h3>{offer.title}</h3>
                <span className="job-salary">{offer.salary}</span>
              </div>

              <p className="job-company">{offer.company}</p>

              <div className="job-meta">
                <span>{offer.location}</span>
                <span>{offer.contract}</span>
              </div>

              <div className="job-tags">
                {offer.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="job-actions">
                <button className="btn-outline">Voir</button>
                <button className="btn-primary">Postuler</button>
              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  </div>
)
}
