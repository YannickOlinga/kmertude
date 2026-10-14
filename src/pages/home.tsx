import { lazy, Suspense } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import AcadomiaInspiredSection from '../components/AcadomiaInspiredSection'
import AuthCTA from '../components/AuthCTA'
import FormSection from '../components/FormSection'
import TestimonialSection from '../components/TestimonialSection'
import Footer from '../components/Footer'
import LazyOnView from '../components/LazyOnView'

const GlobeDemo = lazy(() => import('../components/ui/globe-demo'))
const ThreeDMarqueeDemo = lazy(() => import('../components/3d-marquee-demo'))

function SectionPlaceholder({ height = 420 }: { height?: number }) {
  return <div aria-hidden="true" style={{ minHeight: height }} />
}

export default function home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <AcadomiaInspiredSection />
      <AuthCTA />
      <FormSection />
      <LazyOnView fallback={<SectionPlaceholder height={620} />}>
        <Suspense fallback={<SectionPlaceholder height={620} />}>
          <GlobeDemo />
        </Suspense>
      </LazyOnView>
      <TestimonialSection />
      <LazyOnView fallback={<SectionPlaceholder height={500} />}>
        <Suspense fallback={<SectionPlaceholder height={500} />}>
          <ThreeDMarqueeDemo />
        </Suspense>
      </LazyOnView>
      <Footer />
    </div>
  )
}
