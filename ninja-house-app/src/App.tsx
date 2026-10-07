import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './styles/globals.css'
import { useLenis } from './hooks/useLenis'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'

// Sections
import { HeroSection } from './components/hero/HeroSection'
import { AboutSection } from './components/about/AboutSection'
import { LiveNowSection } from './components/live/LiveNowSection'
// import { CollectiblesSection } from './components/collectibles/CollectiblesSection'
import { ProgramsSection } from './components/programs/ProgramsSection'
import { MetricsSection } from './components/metrics/MetricsSection'
// import { TalentsSection } from './components/talents/TalentsSection'
import { SocialSection } from './components/social/SocialSection'
import { SpotifySection } from './components/spotify/SpotifySection'
import { ContactSection } from './components/contact/ContactSection'

// Pages
import { ProgramsPage } from './pages/ProgramsPage'
import { ContactPage } from './pages/ContactPage'
import { ProgramDetailPage } from './components/programs/ProgramDetailPage'
import { WhatsAppButton } from './components/ui/WhatsAppButton'

// Helper component to scroll to top or anchor with Lenis
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const lenis = (window as any).lenis
    // If navigating to an anchor link on home
    if (hash) {
      const element = document.getElementById(hash.substring(1))
      if (element) {
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(element, { offset: -60, duration: 1.2 })
          } else {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 120)
        return
      }
    }
    
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function LandingPage() {
  return (
    <>
      <HeroSection />
      
      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <AboutSection />

      <div className="h-px bg-gradient-to-r from-transparent via-red-700/20 to-transparent" />
      <ProgramsSection />

      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <LiveNowSection />
      
      {/*
      <div className="h-px bg-gradient-to-r from-transparent via-red-700/20 to-transparent" />
      <CollectiblesSection />
      */}

      <div className="h-px bg-gradient-to-r from-transparent via-red-700/20 to-transparent" />
      <MetricsSection />

      {/*
      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <TalentsSection />
      */}

      <div className="h-px bg-gradient-to-r from-transparent via-red-700/20 to-transparent" />
      <SocialSection />

      <div className="h-px bg-gradient-to-r from-transparent via-purple-600/20 to-transparent" />
      <SpotifySection />

      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <ContactSection />
    </>
  )
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  useLenis()

  useEffect(() => {
    // Show loading screen for 2.8s then fade out
    const timer = setTimeout(() => setIsLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-ninja-black">
      <LoadingScreen isLoading={isLoading} />
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/programa/:id" element={<ProgramDetailPage />} />
          <Route path="/programas" element={<ProgramsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
