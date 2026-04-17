import { useState, Suspense, lazy } from 'react'
import './index.css'

// Lazy-load the heavy views so the initial paint is faster and each section
// pays only for its own JS/CSS bundle. This noticeably improves first-load
// time on low-end Android devices our partners often use.
const WorkerApp = lazy(() => import('./components/WorkerApp'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const LandingPage = lazy(() => import('./components/LandingPage'))

function App() {
  const [view, setView] = useState('landing')

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Suspense fallback={
        <div className="min-w-full min-h-[100vh] flex flex-col items-center justify-center text-white bg-dark">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-[#94a3b8]">Loading GigKavach...</p>
        </div>
      }>
        {view === 'landing' && <LandingPage onNavigate={setView} />}
        {view === 'worker' && <WorkerApp onBack={() => setView('landing')} />}
        {view === 'admin' && <AdminDashboard onBack={() => setView('landing')} />}
      </Suspense>
    </div>
  )
}

export default App
