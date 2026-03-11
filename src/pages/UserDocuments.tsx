import './UserDocuments.css'
import UserNavbar from '../components/UserNavbar'
export default function UserDocuments() {
  const documents = [
    {
      id: 1,
      title: "CV Template - Professeur",
      type: "PDF",
      size: "245 KB",
      modified: "Il y a 2 jours", 
    },
    {
      id: 2,
      title: "Contrat de cours - Mathématiques", 
      type: "DOCX",
      size: "128 KB",
      modified: "Il y a 3 jours", 
    },
    {
      id: 3,
      title: "Planning hebdomadaire",
      type: "XLSX", 
      size: "89 KB",
      modified: "Il y a 1 semaine", 
    },
    {
      id: 4,
      title: "Présentation - Méthodes pédagogiques",
      type: "PPTX",
      size: "2.3 MB", 
      modified: "Il y a 5 jours", 
    },
    {
      id: 5,
      title: "Fiche d'évaluation élève",
      type: "PDF",
      size: "156 KB",
      modified: "Il y a 1 jour",  
    },
    {
      id: 6,
      title: "Ressources - Exercices maths",
      type: "ZIP",
      size: "5.7 MB",
      modified: "Il y a 2 semaines", 
    }
  ]

 

  return (
<>  
    <UserNavbar></UserNavbar>
    <div className="documents-page">
      <div className="page-header">
        <h1>Mes documents</h1>
        <div className="header-actions">
          <button className="btn-primary">
            <svg viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Nouveau document
          </button>
        </div>
      </div>

      <div className="documents-content">
  
        

        {/* Recent Documents */}
        <section className="section">
          <h2>Documents récents</h2>
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-icon"></div>
                <div className="document-info">
                  <h3>{doc.title}</h3>
                  <div className="document-meta">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.modified}</span>
                  </div>
                </div>
                <div className="document-actions">
                  <button className="btn-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button className="btn-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  )
}
