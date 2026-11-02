import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home.tsx'
import './App.css'

// Chargement à la demande : chaque page devient un chunk séparé pour
// alléger le bundle initial (seule la page d'accueil est en eager).
const AuthPage = lazy(() => import('./pages/auth.tsx'))
const UserHome = lazy(() => import('./pages/UserHome.tsx'))
const UserStudents = lazy(() => import('./pages/UserStudents.tsx'))
const UserAccounts = lazy(() => import('./pages/UserAccounts.tsx'))
const UserCourses = lazy(() => import('./pages/UserCourses.tsx'))
const UserVideos = lazy(() => import('./pages/UserVideos.tsx'))
const UserDocuments = lazy(() => import('./pages/UserDocuments.tsx'))
const UserProfile = lazy(() => import('./pages/UserProfile.tsx'))
const EnPrimaire = lazy(() => import('./pages/EnPrimaire.tsx'))
const AuCollege = lazy(() => import('./pages/AuCollege.tsx'))
const AuLycee = lazy(() => import('./pages/AuLycee.tsx'))
const DansSuperieur = lazy(() => import('./pages/DansSuperieur.tsx'))
const PourAdultes = lazy(() => import('./pages/PourAdultes.tsx'))
const UserParentDashboard = lazy(() => import('./pages/userparent/UserParentDashboard.tsx'))
const UserParentOffers = lazy(() => import('./pages/userparent/UserParentOffers.tsx'))
const UserParentTeachers = lazy(() => import('./pages/userparent/UserParentTeachers.tsx'))
const UserParentApplications = lazy(() => import('./pages/userparent/UserParentApplications.tsx'))
const UserParentPayments = lazy(() => import('./pages/userparent/UserParentPayments.tsx'))

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/user-parent" element={<UserParentDashboard />} />
          <Route path="/user-parent/offers" element={<UserParentOffers />} />
          <Route path="/user-parent/teachers" element={<UserParentTeachers />} />
          <Route path="/user-parent/applications" element={<UserParentApplications />} />
          <Route path="/user-parent/payments" element={<UserParentPayments />} />
          <Route path="/user-students" element={<UserStudents />} />
          <Route path="/user-accounts" element={<UserAccounts />} />
          <Route path="/user-courses" element={<UserCourses />} />
          <Route path="/user-videos" element={<UserVideos />} />
          <Route path="/user-documents" element={<UserDocuments />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/en-primaire" element={<EnPrimaire />} />
          <Route path="/au-college" element={<AuCollege />} />
          <Route path="/au-lycee" element={<AuLycee />} />
          <Route path="/dans-superieur" element={<DansSuperieur />} />
          <Route path="/pour-adultes" element={<PourAdultes />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
