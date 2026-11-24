import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/home.tsx'
import RequireAuth from './components/RequireAuth.tsx'
import './App.css'

// Chargement à la demande : chaque page devient un chunk séparé pour
// alléger le bundle initial (seule la page d'accueil est en eager).
const DemandePage = lazy(() => import('./pages/DemandePage.tsx'))
const DevenirEnseignantPage = lazy(() => import('./pages/DevenirEnseignantPage.tsx'))
const UserCourses = lazy(() => import('./pages/UserCourses.tsx'))
const UserVideos = lazy(() => import('./pages/UserVideos.tsx'))
const EnPrimaire = lazy(() => import('./pages/EnPrimaire.tsx'))
const AuCollege = lazy(() => import('./pages/AuCollege.tsx'))
const AuLycee = lazy(() => import('./pages/AuLycee.tsx'))
const DansSuperieur = lazy(() => import('./pages/DansSuperieur.tsx'))
const PourAdultes = lazy(() => import('./pages/PourAdultes.tsx'))
const LegalPage = lazy(() => import('./pages/legal/LegalPage.tsx'))
const AuthPage = lazy(() => import('./app/AuthPage.tsx'))
const ProfilPage = lazy(() => import('./app/ProfilPage.tsx'))
const ClientHome = lazy(() => import('./app/client/ClientHome.tsx'))
const ClientDemande = lazy(() => import('./app/client/ClientDemande.tsx'))
const ClientMissions = lazy(() => import('./app/client/ClientMissions.tsx'))
const ClientFactures = lazy(() => import('./app/client/ClientFactures.tsx'))
const EnsHome = lazy(() => import('./app/enseignant/EnsHome.tsx'))
const EnsDossier = lazy(() => import('./app/enseignant/EnsDossier.tsx'))
const EnsPropositions = lazy(() => import('./app/enseignant/EnsPropositions.tsx'))
const EnsSeance = lazy(() => import('./app/enseignant/EnsSeance.tsx'))
const EnsGains = lazy(() => import('./app/enseignant/EnsGains.tsx'))
const AdminCockpit = lazy(() => import('./app/admin/AdminCockpit.tsx'))
const AdminDemandes = lazy(() => import('./app/admin/AdminDemandes.tsx'))
const AdminFinance = lazy(() => import('./app/admin/AdminFinance.tsx'))

// Ancienne URL de connexion : renvoie vers /login en conservant les paramètres
function LegacyAuthRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/login${search}`} replace />
}

const famille = (el: ReactNode) => <RequireAuth role="famille">{el}</RequireAuth>
const enseignant = (el: ReactNode) => <RequireAuth role="enseignant">{el}</RequireAuth>
const admin = (el: ReactNode) => <RequireAuth role="administrateur">{el}</RequireAuth>
const go = (to: string) => <Navigate to={to} replace />

// Anciennes URL des espaces connectés → nouvelles routes par rôle
const LEGACY: [string, string][] = [
  ['/user-parent', '/client'], ['/user-parent/demandes', '/client/demande'], ['/user-parent/offers', '/client/demande'],
  ['/user-parent/missions', '/client/missions'], ['/user-parent/teachers', '/client/missions'], ['/user-parent/seances', '/client/missions'],
  ['/user-parent/applications', '/client/missions'], ['/user-parent/payments', '/client/factures'],
  ['/user-home', '/enseignant'], ['/user-students', '/enseignant/seance'], ['/user-accounts', '/enseignant/gains'],
  ['/user-documents', '/enseignant/dossier'], ['/user-profile', '/profil'],
]

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demande" element={<DemandePage />} />
          <Route path="/devenir-enseignant" element={<DevenirEnseignantPage />} />
          <Route path="/auth" element={<LegacyAuthRedirect />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/profil" element={<RequireAuth><ProfilPage /></RequireAuth>} />

          <Route path="/client" element={famille(<ClientHome />)} />
          <Route path="/client/demande" element={famille(<ClientDemande />)} />
          <Route path="/client/missions" element={famille(<ClientMissions />)} />
          <Route path="/client/factures" element={famille(<ClientFactures />)} />

          <Route path="/enseignant" element={enseignant(<EnsHome />)} />
          <Route path="/enseignant/dossier" element={enseignant(<EnsDossier />)} />
          <Route path="/enseignant/propositions" element={enseignant(<EnsPropositions />)} />
          <Route path="/enseignant/seance" element={enseignant(<EnsSeance />)} />
          <Route path="/enseignant/gains" element={enseignant(<EnsGains />)} />

          <Route path="/admin" element={admin(<AdminCockpit />)} />
          <Route path="/admin/demandes" element={admin(<AdminDemandes />)} />
          <Route path="/admin/finance" element={admin(<AdminFinance />)} />

          {LEGACY.map(([from, to]) => <Route key={from} path={from} element={go(to)} />)}
          <Route path="/user-courses" element={enseignant(<UserCourses />)} />
          <Route path="/user-videos" element={enseignant(<UserVideos />)} />
          <Route path="/en-primaire" element={<EnPrimaire />} />
          <Route path="/au-college" element={<AuCollege />} />
          <Route path="/au-lycee" element={<AuLycee />} />
          <Route path="/dans-superieur" element={<DansSuperieur />} />
          <Route path="/pour-adultes" element={<PourAdultes />} />
          {['mentions-legales', 'conditions-generales', 'donnees-personnelles', 'cookies'].map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<LegalPage slug={slug} />} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
