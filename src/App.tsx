
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
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/user-students" element={<UserStudents />} />
        <Route path="/user-accounts" element={<UserAccounts />} />
        <Route path="/user-courses" element={<UserCourses />} />
        <Route path="/user-videos" element={<UserVideos />} />
        <Route path="/user-documents" element={<UserDocuments />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/en-primaire" element={<EnPrimaire />} />
      </Routes>
    </Router>
  )
}

export default App
