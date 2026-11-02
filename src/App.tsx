
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home.tsx'
import UserHome from './pages/UserHome.tsx'
import UserStudents from './pages/UserStudents.tsx'
import UserAccounts from './pages/UserAccounts.tsx'
import UserCourses from './pages/UserCourses.tsx'
import UserVideos from './pages/UserVideos.tsx'
import UserDocuments from './pages/UserDocuments.tsx'
import UserProfile from './pages/UserProfile.tsx'
import EnPrimaire from './pages/EnPrimaire.tsx'
import AuCollege from './pages/AuCollege.tsx'
import AuLycee from './pages/AuLycee.tsx'
import DansSuperieur from './pages/DansSuperieur.tsx'
import PourAdultes from './pages/PourAdultes.tsx'
import AuthPage from './pages/auth.tsx'
import UserParentDashboard from './pages/userparent/UserParentDashboard.tsx'
import UserParentOffers from './pages/userparent/UserParentOffers.tsx'
import UserParentTeachers from './pages/userparent/UserParentTeachers.tsx'
import UserParentApplications from './pages/userparent/UserParentApplications.tsx'
import UserParentPayments from './pages/userparent/UserParentPayments.tsx'
import './App.css'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
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
    </Router>
  )
}

export default App
