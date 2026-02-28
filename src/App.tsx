
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home.tsx'
import UserHome from './pages/UserHome.tsx'
import UserStudents from './pages/UserStudents.tsx'
import UserAccounts from './pages/UserAccounts.tsx'
import UserCourses from './pages/UserCourses.tsx'
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
      </Routes>
    </Router>
  )
}

export default App
