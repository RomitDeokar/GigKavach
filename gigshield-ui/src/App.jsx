import { useState, useEffect, lazy, Suspense } from 'react'
import './index.css'
import LandingPage from './components/LandingPage'
import { useTheme } from './context/ThemeContext'
import { Download, X, Loader2 } from 'lucide-react'

// Lazy load heavy components for faster initial load
const WorkerApp = lazy(() => import('./components/WorkerApp'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-themed flex items-center justify-center z-50">
    <div className="text-center">
      <Loader2 size={32} className="text-primary animate-spin mx-auto mb-3" />
      <p className="text-sm text-text-muted font-medium">Loading...</p>
    </div>
  </div>
)

function App() {
  const [view, setView] = useState('landing')
  const { isDark } = useTheme()
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  // Capture the PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      // Only show banner if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBanner(true)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Preload Worker and Admin components when user is on landing page
  useEffect(() => {
    if (view === 'landing') {
      // Start preloading after a short delay so landing page renders first
      const timer = setTimeout(() => {
        import('./components/WorkerApp')
        import('./components/AdminDashboard')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [view])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShowInstallBanner(false)
      setInstallPrompt(null)
    }
  }

  return (
    <>
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-primary/95 backdrop-blur-lg px-4 py-3 flex items-center justify-between gap-3 slide-up">
          <div className="flex items-center gap-3 min-w-0">
            <Download size={18} className="text-white shrink-0" />
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold">Install GigShield</p>
              <p className="text-white/70 text-xs truncate">Add to home screen for the best experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleInstall} className="px-3 py-1.5 bg-white text-primary text-xs font-bold rounded-lg">
              Install
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {view === 'landing' && <LandingPage onNavigate={setView} />}
      <Suspense fallback={<LoadingFallback />}>
        {view === 'worker' && <WorkerApp onBack={() => setView('landing')} />}
        {view === 'admin' && <AdminDashboard onBack={() => setView('landing')} />}
      </Suspense>
    </>
  )
}

export default App
