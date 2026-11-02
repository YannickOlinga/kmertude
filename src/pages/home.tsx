import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import StatsStrip from '../components/StatsStrip'
import AcadomiaInspiredSection from '../components/AcadomiaInspiredSection'
import SubjectsSection from '../components/SubjectsSection'
import LevelSelector from '../components/LevelSelector'
import ProcessSteps from '../components/ProcessSteps'
import TeacherSelectionSection from '../components/TeacherSelectionSection'
import NearYouSection from '../components/NearYouSection'
import AuthCTA from '../components/AuthCTA'
import FormSection from '../components/FormSection'
import FaqSection from '../components/FaqSection'
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
      <StatsStrip />
      <AcadomiaInspiredSection />
      <SubjectsSection />
      <LevelSelector />
      <ProcessSteps />
      <TeacherSelectionSection />
      <NearYouSection />
      <AuthCTA />
      <FormSection />
      <FaqSection />
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
