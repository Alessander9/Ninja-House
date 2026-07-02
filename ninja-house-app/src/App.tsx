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
import { InvestSection } from './components/invest/InvestSection'
import { MetricsSection } from './components/metrics/MetricsSection'
// import { TalentsSection } from './components/talents/TalentsSection'
import { SocialSection } from './components/social/SocialSection'
import { SpotifySection } from './components/spotify/SpotifySection'
import { ContactSection } from './components/contact/ContactSection'

// Pages
import { ProgramsPage } from './pages/ProgramsPage'
import { InvestPage } from './pages/InvestPage'
import { ContactPage } from './pages/ContactPage'
import { MediaKitPage } from './pages/MediaKitPage'
import { ProgramDetailPage } from './components/programs/ProgramDetailPage'

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // If navigating to an anchor link on home
    if (hash) {
      const element = document.getElementById(hash.substring(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        return
      }
    }
    window.scrollTo(0, 0)
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

      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <InvestSection />

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
          <Route path="/invierte" element={<InvestPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/media-kit" element={<MediaKitPage />} />
        </Routes>
      </main>
      <Footer />
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
