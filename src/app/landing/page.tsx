import Navbar from '@/components/layout/Navbar'
import { Hero } from './_components/Hero'
import { StatsStrip } from './_components/StatsStrip'
import { FeaturesSection } from './_components/FeaturesSection'
import { LicenseTypesSection } from './_components/LicenseTypesSection'
import { HowItWorksSection } from './_components/HowItWorksSection'
import { CtaBanner } from './_components/CtaBanner'
import { SiteFooter } from './_components/SiteFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page pb-16 md:pb-0">
      <Navbar />
      <Hero />
      <StatsStrip />
      <FeaturesSection />
      <LicenseTypesSection />
      <HowItWorksSection />
      <CtaBanner />
      <SiteFooter />
    </div>
  )
}
