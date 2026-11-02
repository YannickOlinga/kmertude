import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import AcadomiaInspiredSection from '../components/AcadomiaInspiredSection'
import TeacherSelectionSection from '../components/TeacherSelectionSection'
import NearYouSection from '../components/NearYouSection'
import FormSection from '../components/FormSection'
import TestimonialSection from '../components/TestimonialSection'
import Footer from '../components/Footer'
import LazyOnView from '../components/LazyOnView'
  

function SectionPlaceholder({ height = 420 }: { height?: number }) {
  return <div aria-hidden="true" style={{ minHeight: height }} />
}

export default function home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <TeacherSelectionSection />
      <AcadomiaInspiredSection />
      <NearYouSection />
     
      <FormSection /> 
      <LazyOnView fallback={<SectionPlaceholder height={620} />}>
        <Suspense fallback={<SectionPlaceholder height={620} />}>
          
        </Suspense>
      </LazyOnView>
      <TestimonialSection />
      <LazyOnView fallback={<SectionPlaceholder height={500} />}>
        <Suspense fallback={<SectionPlaceholder height={500} />}>
        
        </Suspense>
      </LazyOnView>
      <Footer />
    </div>
  )
}
