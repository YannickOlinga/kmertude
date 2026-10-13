import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import AuthCTA from '../components/AuthCTA'
import FormSection from '../components/FormSection'
import TestimonialSection from '../components/TestimonialSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <AuthCTA />
      <FormSection />
      <TestimonialSection />
      <Footer />
    </div>
  )
}
