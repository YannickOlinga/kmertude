
import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import FormSection from '../components/FormSection'
import TestimonialSection from '../components/TestimonialSection'
import Footer from '../components/Footer'

export default function home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FormSection /> 
      <TestimonialSection/>
      <Footer />
    </div>
  )
}
