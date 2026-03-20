import UserNavbar from '../components/UserNavbar'
import TeacherOffers from '../components/TeacherOffers'
import BlogSection from '../components/BlogSection'

export default function UserHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <TeacherOffers />
      <BlogSection />
    </div>
  )
}
