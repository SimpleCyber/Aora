import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import TechStack from "@/components/tech-stack"
import DownloadSection from "@/components/download-section"
import Footer from "@/components/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TechStack />
      <DownloadSection />
      <Footer />
    </>
  )
}
