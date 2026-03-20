import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import GlobeDemo from '../components/ui/globe-demo'
import FormSection from '../components/FormSection' 
import TestimonialSection from '../components/TestimonialSection'
import ThreeDMarqueeDemo from '../components/3d-marquee-demo'
import Footer from '../components/Footer'

export default function home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FormSection /> 
      <GlobeDemo /> 
      <TestimonialSection/>
      <ThreeDMarqueeDemo />
      <Footer />
    </div>
  )
}
