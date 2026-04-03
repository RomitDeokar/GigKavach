import { useState, useRef, useEffect, useCallback } from 'react'
import { Shield, ArrowLeft, Home, FileText, Award, Clock, Settings, Bell, ChevronRight, CloudRain, Wind, Thermometer, AlertTriangle, MapPin, Zap, TrendingUp, IndianRupee, Gift, Users, Star, CheckCircle2, XCircle, ChevronDown, Download, RefreshCw, Info, Flame, Target, Trophy, History, UserPlus, MessageCircle, Send, X, TrendingDown, BarChart3, Moon, Sun, HeartPulse, ArrowRight, FileCheck, CreditCard, Headphones, Timer, Vote, PiggyBank, ShieldCheck, BellRing, Phone, Languages, Fingerprint, BadgeCheck, Siren, Navigation, Activity, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { api } from '../lib/api'

// ─── DATA ─────────────────────────────────────────────
const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'policy', label: 'Policy', icon: FileText },
  { id: 'points', label: 'Points', icon: Award },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: Settings },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="glass-strong rounded-xl p-3 text-xs">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

const SectionLabel = ({ children, action, actionLabel }) => (
  <div className="flex items-center justify-between mb-3">
    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-[0.08em]">{children}</p>
    {action && <button onClick={action} className="text-[11px] text-primary font-medium">{actionLabel || 'View All'}</button>}
  </div>
)

const StatusPill = ({ status, children }) => {
  const colors = {
    success: 'bg-success/15 text-success border-success/20',
    warning: 'bg-warning/15 text-warning border-warning/20',
    danger: 'bg-danger/15 text-danger border-danger/20',
    info: 'bg-primary/15 text-primary border-primary/20',
    neutral: 'bg-dark-surface text-text-secondary border-dark-border',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[status] || colors.neutral}`}>
      {children}
    </span>
  )
}

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 size={24} className="text-primary animate-spin" />
  </div>
)

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Helper to get zone status styles without dynamic Tailwind class construction
function getZoneStyles(status) {
  switch (status) {
    case 'safe': return {
      bg: 'bg-success/10', border: 'border-success/30', text: 'text-success',
      dotBg: 'bg-success', borderInner: 'border-success/20'
    }
    case 'watch': return {
      bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning',
      dotBg: 'bg-warning', borderInner: 'border-warning/20'
    }
    case 'disrupted': return {
      bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger',
      dotBg: 'bg-danger', borderInner: 'border-danger/20'
    }
    default: return {
      bg: 'bg-success/10', border: 'border-success/30', text: 'text-success',
      dotBg: 'bg-success', borderInner: 'border-success/20'
    }
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────
export default function WorkerApp({ onBack }) {
  const [screen, setScreen] = useState('splash')
  const [activeTab, setActiveTab] = useState('home')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showGigBot, setShowGigBot] = useState(false)

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationStep, setRegistrationStep] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [profile, setProfile] = useState({ name: '', platform: 'Zepto', avgDailyHours: 8, shiftPattern: 'Full Day', upiId: '' })
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Live data from API
  const [dashData, setDashData] = useState(null)
  const [plansData, setPlansData] = useState(null)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [dashError, setDashError] = useState(null)

  const { isDark, toggleTheme } = useTheme()

  const workerId = localStorage.getItem('gigshield_worker_id') || 'WRK-001'

  // Reset session when worker no longer exists on server
  const resetSession = useCallback(() => {
    localStorage.removeItem('gigshield_registered')
    localStorage.removeItem('gigshield_worker_id')
    setIsRegistered(false)
    setDashData(null)
    setDashError(null)
    setScreen('splash')
  }, [])

  // Load dashboard data
  const loadDashboard = useCallback(async () => {
    try {
      setDashError(null)
      const data = await api.dashboard(workerId)
      setDashData(data)
    } catch (err) {
      console.error('Dashboard load error:', err)
      const msg = err.message || 'Failed to load dashboard'
      // If worker not found on server, auto-reset to registration
      if (msg.toLowerCase().includes('not found') || msg.includes('404')) {
        console.warn('Worker ID not found on server, resetting session...')
        resetSession()
        return
      }
      setDashError(msg)
    }
  }, [workerId, resetSession])

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      const data = await api.notifications(workerId)
      setNotifications(data.notifications || [])
    } catch { /* ignore */ }
  }, [workerId])

  useEffect(() => {
    const registered = localStorage.getItem('gigshield_registered')
    if (registered) {
      // Verify the stored worker still exists on the server
      const storedId = localStorage.getItem('gigshield_worker_id') || 'WRK-001'
      api.workerExists(storedId).then(data => {
        if (data.exists) {
          setIsRegistered(true)
          setScreen('app')
          loadDashboard()
          loadNotifications()
        } else {
          console.warn(`Worker ${storedId} no longer exists, resetting session`)
          resetSession()
        }
      }).catch(() => {
        // Network error — try loading dashboard anyway (it will show error state if it fails)
        setIsRegistered(true)
        setScreen('app')
        loadDashboard()
        loadNotifications()
      })
    }
  }, [loadDashboard, loadNotifications, resetSession])

  // Auto-refresh dashboard every 30s
  useEffect(() => {
    if (screen !== 'app') return
    const interval = setInterval(() => { loadDashboard() }, 30000)
    return () => clearInterval(interval)
  }, [screen, loadDashboard])

  const getLocation = () => {
    if (navigator.geolocation) {
      setError('')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Location detected:', pos.coords.latitude, pos.coords.longitude)
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => {
          console.warn('Geolocation error:', err.code, err.message)
          // Use null so backend assigns default zone instead of a hardcoded Bangalore fallback
          setLocation({ lat: null, lng: null })
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      )
    } else {
      setLocation({ lat: null, lng: null })
    }
  }

  const sendOtp = async () => {
    setLoading(true); setError('')
    try {
      await api.requestOtp(mobile.startsWith('+91') ? mobile : `+91${mobile}`)
      setRegistrationStep('otp')
    } catch (err) { setError(err.message || 'Failed to send OTP') }
    setLoading(false)
  }

  const verifyOtp = async () => {
    setLoading(true); setError('')
    try {
      const data = await api.verifyOtp(mobile.startsWith('+91') ? mobile : `+91${mobile}`, otp)
      if (data.isNewUser) {
        setRegistrationStep('profile')
        getLocation()
      } else {
        localStorage.setItem('gigshield_registered', 'true')
        localStorage.setItem('gigshield_worker_id', data.workerId)
        setIsRegistered(true)
        setScreen('app')
        loadDashboard()
        loadNotifications()
      }
    } catch (err) { setError(err.message || 'Invalid OTP') }
    setLoading(false)
  }

  const completeRegistration = async () => {
    setLoading(true); setError('')
    try {
      const mobileFull = mobile.startsWith('+91') ? mobile : `+91${mobile}`
      const data = await api.onboard({ mobile: mobileFull, ...profile, lat: location?.lat, lng: location?.lng })
      localStorage.setItem('gigshield_registered', 'true')
      localStorage.setItem('gigshield_worker_id', data.worker.id)
      setIsRegistered(true)
      setScreen('app')
      setShowOnboarding(true)
      setOnboardStep(0)
      loadDashboard()
    } catch (err) { setError(err.message || 'Registration failed') }
    setLoading(false)
  }

  // Load plans for purchase screen
  const openPurchase = async () => {
    setShowPurchase(true)
    try {
      const [plRes, polRes] = await Promise.all([api.plans(), api.policy(workerId).catch(() => null)])
      setPlansData({ plans: plRes.plans, policyInfo: polRes })
    } catch { /* ignore */ }
  }

  // Actual policy purchase
  const handlePurchase = async () => {
    setPurchaseLoading(true)
    try {
      const planIds = ['basic', 'pro', 'elite']
      await api.purchasePolicy(workerId, { planId: planIds[selectedPlan], autoRenew: true, upiId: dashData?.worker?.upiId })
      setShowPurchase(false)
      await loadDashboard()
    } catch (err) { setError(err.message) }
    setPurchaseLoading(false)
  }

  // Registration screens
  if (!isRegistered && screen === 'register') {
    return (
      <div className="worker-app-shell">
        <div className="worker-phone-wrapper">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="worker-phone-frame relative z-10">
            <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-40" />
              <div className="relative z-10 w-full">
                {registrationStep === 'mobile' && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6"><Phone size={32} className="text-white" /></div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome to GigShield</h2>
                    <p className="text-text-secondary text-sm mb-8">Enter your mobile number to get started</p>
                    <div className="space-y-4">
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input type="tel" placeholder="Enter mobile number" value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
                      </div>
                      <p className="text-[10px] text-text-muted">Demo: Use any 10-digit number. OTP is always 1234.</p>
                      {error && <p className="text-danger text-sm">{error}</p>}
                      <button onClick={sendOtp} disabled={mobile.length !== 10 || loading}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}
                {registrationStep === 'otp' && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6"><Shield size={32} className="text-white" /></div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Verify Your Number</h2>
                    <p className="text-text-secondary text-sm mb-2">We sent an OTP to +91 {mobile}</p>
                    <p className="text-text-muted text-xs mb-8">Demo OTP: <span className="text-primary font-bold">1234</span></p>
                    <div className="space-y-4">
                      <input type="text" placeholder="0000" value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
                      {error && <p className="text-danger text-sm">{error}</p>}
                      <button onClick={verifyOtp} disabled={otp.length !== 4 || loading}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button onClick={() => { setRegistrationStep('mobile'); setError('') }} className="text-primary text-sm hover:underline">Change number</button>
                    </div>
                  </div>
                )}
                {registrationStep === 'profile' && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6"><UserPlus size={32} className="text-white" /></div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Complete Your Profile</h2>
                    <p className="text-text-secondary text-sm mb-8">Help us personalize your coverage</p>
                    <div className="space-y-4">
                      <input type="text" placeholder="Full Name" value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
                      <select value={profile.platform} onChange={(e) => setProfile({...profile, platform: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary focus:border-primary focus:outline-none">
                        <option value="Zepto">Zepto</option><option value="Blinkit">Blinkit</option><option value="Swiggy Instamart">Swiggy Instamart</option>
                      </select>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Daily Hours" value={profile.avgDailyHours}
                          onChange={(e) => setProfile({...profile, avgDailyHours: parseInt(e.target.value) || 8})}
                          className="px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
                        <select value={profile.shiftPattern} onChange={(e) => setProfile({...profile, shiftPattern: e.target.value})}
                          className="px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary focus:border-primary focus:outline-none">
                          <option value="Full Day">Full Day</option><option value="Morning">Morning</option><option value="Evening">Evening</option>
                        </select>
                      </div>
                      <input type="text" placeholder="UPI ID (e.g. name@upi)" value={profile.upiId}
                        onChange={(e) => setProfile({...profile, upiId: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
                      {location && (
                        <div className="glass rounded-2xl p-4 text-left">
                          <div className="flex items-center gap-2 mb-2"><MapPin size={16} className="text-success" /><span className="text-sm font-semibold text-text-primary">Location Detected</span></div>
                          <p className="text-xs text-text-muted">Your zone will be auto-assigned based on GPS</p>
                        </div>
                      )}
                      {error && <p className="text-danger text-sm">{error}</p>}
                      <button onClick={completeRegistration} disabled={!profile.name || loading}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Creating Account...' : 'Complete Registration'}
                      </button>
                    </div>
                  </div>
                )}
                <button onClick={onBack} className="absolute top-4 left-4 text-text-muted hover:text-text-secondary"><ArrowLeft size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'splash') {
    return (
      <div className="worker-app-shell">
        <div className="worker-phone-wrapper">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="worker-phone-frame relative z-10">
            <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-40" />
              <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] rounded-full bg-primary/10 blur-[60px]" />
              <div className="absolute bottom-[20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-accent/10 blur-[60px]" />
              <div className="relative z-10 text-center w-full">
                <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40 float">
                  <Shield size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-text-primary mb-1">GigShield</h1>
                <p className="text-text-secondary text-sm mb-1">Parametric Income Protection</p>
                <p className="text-text-muted text-[11px] mb-10 tracking-wide">for Q-Commerce Delivery Partners</p>
                <button onClick={() => { setScreen('register'); setRegistrationStep('mobile') }}
                  className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold text-base shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform mb-3">
                  Get Started
                </button>
                <button onClick={() => { setScreen('register'); setRegistrationStep('mobile') }}
                  className="w-full py-3.5 bg-dark-card border border-dark-border rounded-2xl text-text-primary font-semibold text-base active:scale-[0.98] transition-transform mb-6">
                  I Have an Account
                </button>
                <button onClick={onBack} className="text-sm text-text-muted hover:text-text-secondary transition-colors">← Back to Landing</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    const zoneName = dashData?.zone?.name || 'Your Zone'
    const zoneId = dashData?.zone?.id || ''
    const steps = [
      { title: 'Select Your Platform', subtitle: 'We support all major Q-commerce platforms', content: (
        <div className="space-y-3">
          {['Zepto', 'Blinkit', 'Swiggy Instamart'].map((p, i) => {
            const sel = (dashData?.worker?.platform || profile.platform) === p
            return (
              <button key={i} className={`w-full p-4 rounded-2xl border text-left transition-all ${sel ? 'border-primary/50 bg-primary/10' : 'border-dark-border bg-dark-card'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${sel ? 'gradient-primary' : 'bg-dark-surface'}`}>{p[0]}</div>
                    <span className="font-semibold text-text-primary">{p}</span>
                  </div>
                  {sel && <CheckCircle2 size={20} className="text-primary" />}
                </div>
              </button>
            )
          })}
        </div>
      )},
      { title: 'Your Zone Detected', subtitle: 'We found your delivery zone automatically', content: (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-4"><MapPin size={36} className="text-success" /></div>
          <h3 className="text-xl font-bold text-text-primary mb-2">{zoneName}</h3>
          <p className="text-text-secondary text-sm mb-4">Zone {zoneId} · {dashData?.zone?.city || 'Bangalore'}</p>
          <div className="glass rounded-2xl p-4 text-left space-y-2">
            {[['Dark Store', dashData?.zone?.darkStore || '-'], ['Zone Radius', `${((dashData?.zone?.radiusMeters || 2500) / 1000).toFixed(1)} km`], ['Active Workers', `${dashData?.zone?.activeWorkers || 0} in zone`], ['Risk Score', `${dashData?.zone?.riskScore || 0}`]].map(([k, v], i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-text-muted">{k}</span>
                <span className={`text-text-primary ${k === 'Risk Score' ? 'font-bold text-warning' : ''}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )},
      { title: 'Complete Your Profile', subtitle: 'Help us personalize your coverage', content: (
        <div className="space-y-4">
          <div><label className="text-xs text-text-muted mb-1.5 block">Daily Working Hours</label>
            <div className="flex gap-2">
              {['4-6 hrs', '6-10 hrs', '10-14 hrs'].map((h, i) => (
                <button key={i} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${i === 1 ? 'gradient-primary text-white' : 'bg-dark-card border border-dark-border text-text-secondary'}`}>{h}</button>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center gap-3"><Award size={20} className="text-primary" /><div><p className="text-sm font-semibold text-text-primary">+100 GigPoints</p><p className="text-xs text-text-secondary">Welcome bonus added to your wallet</p></div></div>
        </div>
      )}
    ]
    return (
      <div className="worker-app-shell">
        <div className="worker-phone-wrapper">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="worker-phone-frame relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5">
              <div className="flex gap-2 mb-6 mt-2">{steps.map((_, i) => (<div key={i} className={`flex-1 h-1 rounded-full ${i <= onboardStep ? 'gradient-primary' : 'bg-dark-border'}`} />))}</div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Step {onboardStep + 1} of {steps.length}</p>
              <h2 className="text-xl font-bold text-text-primary mb-1">{steps[onboardStep].title}</h2>
              <p className="text-[13px] text-text-secondary mb-5">{steps[onboardStep].subtitle}</p>
              <div className="flex-1 overflow-y-auto">{steps[onboardStep].content}</div>
              <button onClick={() => { if (onboardStep < steps.length - 1) setOnboardStep(onboardStep + 1); else { setShowOnboarding(false); openPurchase() } }}
                className="mt-4 w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform shrink-0">
                {onboardStep < steps.length - 1 ? 'Continue' : 'Choose Your Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPurchase) {
    const plans = plansData?.plans || [
      { id: 'basic', name: 'Basic Shield', basePremium: 49, payoutPerDay: 300, coverageHours: 6 },
      { id: 'pro', name: 'Pro Shield', basePremium: 99, payoutPerDay: 600, coverageHours: 10 },
      { id: 'elite', name: 'Elite Shield', basePremium: 149, payoutPerDay: 1000, coverageHours: 14 },
    ]
    const riskScore = dashData?.zone?.riskScore || 0.5
    const discountPct = dashData?.loyalty?.tier?.discountPercent || 5
    const tierName = dashData?.loyalty?.tier?.name || 'Reliable'
    const forecast = dashData?.forecast || []

    return (
      <div className="worker-app-shell">
        <div className="worker-phone-wrapper">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="worker-phone-frame relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5 overflow-y-auto">
              <button onClick={() => setShowPurchase(false)} className="flex items-center gap-2 text-text-secondary text-sm mb-3 mt-2"><ArrowLeft size={16} /> Back</button>
              <h2 className="text-xl font-bold text-text-primary mb-1">Choose Your Shield</h2>
              <p className="text-sm text-text-secondary mb-4">AI-adjusted premiums for Zone {dashData?.zone?.id || ''}</p>
              <div className="glass rounded-2xl p-3 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center"><Target size={18} className="text-warning" /></div>
                <div className="flex-1"><p className="text-sm font-semibold text-text-primary">Zone Risk: {riskScore.toFixed(2)}</p><p className="text-xs text-text-secondary">Premium adjusted +{Math.round((riskScore - 0.5) * 30)}%</p></div>
              </div>
              {forecast.length > 0 && (
                <div className="bg-primary/[0.04] border border-primary/15 rounded-2xl p-3.5 mb-4">
                  <div className="flex items-center gap-2 mb-2.5"><TrendingUp size={13} className="text-primary" /><p className="text-[11px] font-semibold text-primary uppercase tracking-wider">7-Day Forecast</p></div>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {forecast.slice(0, 7).map((d, i) => (
                      <div key={i} className={`flex-shrink-0 w-[42px] text-center py-1.5 px-1 rounded-lg transition-all ${d.label === 'Critical' ? 'bg-danger/10 border border-danger/25' : 'bg-dark-surface/40'}`}>
                        <p className="text-[9px] text-text-muted font-medium">{d.day}</p>
                        <p className={`text-[11px] font-bold mt-0.5 ${d.premium > 130 ? 'text-danger' : d.premium > 110 ? 'text-warning' : 'text-text-primary'}`}>₹{d.premium}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">Buy today before prices change</p>
                </div>
              )}
              <div className="space-y-2.5 mb-4">
                {plans.map((plan, i) => {
                  const adjusted = Math.round(plan.basePremium * (1 + 0.3 * (riskScore - 0.5)))
                  return (
                    <button key={i} onClick={() => setSelectedPlan(i)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all relative ${selectedPlan === i ? 'border-primary/50 bg-primary/5' : 'border-dark-border bg-dark-card'}`}>
                      {i === 1 && <div className="absolute -top-2.5 right-4"><span className="px-2.5 py-0.5 gradient-primary rounded-full text-[9px] font-bold text-white uppercase tracking-wider">Most Popular</span></div>}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${selectedPlan === i ? 'gradient-primary' : 'bg-dark-surface'}`}>{plan.name[0]}</div>
                          <div><p className="font-bold text-text-primary text-sm">{plan.name}</p><p className="text-xs text-text-secondary mt-0.5">₹{plan.payoutPerDay}/disruption | {plan.coverageHours}hrs/day</p></div>
                        </div>
                        <div className="text-right"><p className="text-xs text-text-muted line-through">₹{plan.basePremium}/wk</p><p className="text-base font-bold text-text-primary">₹{adjusted}<span className="text-xs text-text-secondary">/wk</span></p></div>
                      </div>
                      {selectedPlan === i && (
                        <div className="mt-2.5 pt-2.5 border-t border-dark-border space-y-1">
                          {['All 6 trigger types', 'Instant UPI payout <60s', 'GigPoints on every event'].map((t, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-success"><CheckCircle2 size={11} /><span>{t}</span></div>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {(() => {
                const plan = plans[selectedPlan]
                const adjusted = Math.round(plan.basePremium * (1 + 0.3 * (riskScore - 0.5)))
                const discount = Math.round(adjusted * (discountPct / 100))
                const final$ = adjusted - discount
                return (
                  <div className="glass rounded-2xl p-3 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-text-secondary">Weekly Premium</span><span className="text-text-primary">₹{adjusted}</span></div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5"><Award size={13} className="text-primary" /><span className="text-text-secondary">{tierName} Tier ({discountPct}%)</span></div>
                        <span className="font-bold text-success">-₹{discount}</span>
                      </div>
                      <div className="border-t border-dark-border pt-2 flex justify-between"><span className="font-bold text-text-primary">You Pay</span><span className="text-lg font-bold text-text-primary">₹{final$}</span></div>
                    </div>
                  </div>
                )
              })()}
              <button onClick={handlePurchase} disabled={purchaseLoading}
                className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 shrink-0">
                {purchaseLoading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><IndianRupee size={18} /> Pay with UPI</>}
              </button>
              <p className="text-center text-[10px] text-text-muted mt-2">Razorpay Sandbox · Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab dashData={dashData} setShowNotif={setShowNotif} showNotif={showNotif} openPurchase={openPurchase} notifications={notifications} loadDashboard={loadDashboard} workerId={workerId} setActiveTab={setActiveTab} setShowGigBot={setShowGigBot} />
      case 'policy': return <PolicyTab dashData={dashData} workerId={workerId} loadDashboard={loadDashboard} openPurchase={openPurchase} />
      case 'points': return <PointsTab dashData={dashData} workerId={workerId} />
      case 'history': return <HistoryTab dashData={dashData} workerId={workerId} />
      case 'profile': return <ProfileTab dashData={dashData} onBack={onBack} workerId={workerId} loadDashboard={loadDashboard} />
      default: return null
    }
  }

  return (
    <div className="worker-app-shell">
      <div className="worker-phone-wrapper">
        <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
        <div className="worker-phone-frame relative z-10">
          <div className="phone-notch" />
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pt-10 pb-20 px-5">
              {dashData ? renderTab() : dashError ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <AlertTriangle size={24} className="text-danger" />
                  <p className="text-sm text-text-secondary text-center">Failed to load dashboard</p>
                  <p className="text-xs text-text-muted text-center">{dashError}</p>
                  <button onClick={loadDashboard} className="mt-2 px-4 py-2 gradient-primary rounded-xl text-white text-xs font-semibold">
                    Retry
                  </button>
                  <button onClick={resetSession} className="px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-text-secondary text-xs font-semibold">
                    Re-register
                  </button>
                </div>
              ) : <Spinner />}
            </div>
            {!showGigBot && (
              <button onClick={() => setShowGigBot(true)}
                className="absolute bottom-20 right-4 w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/40 z-30 active:scale-95 transition-transform">
                <MessageCircle size={20} className="text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] rounded-full bg-success flex items-center justify-center border border-white"><span className="text-[6px] text-white font-bold">AI</span></div>
              </button>
            )}
            {showGigBot && <GigBotPanel onClose={() => setShowGigBot(false)} workerId={workerId} />}
            <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-dark-border safe-area-bottom z-20">
              <div className="flex items-center justify-around py-2 pb-3">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`}>
                    <tab.icon size={18} /><span className="text-[10px] font-medium">{tab.label}</span>
                    {activeTab === tab.id && <div className="w-4 h-[2px] rounded-full bg-primary mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── GIGBOT PANEL ─────────────────────────────────────
function GigBotPanel({ onClose, workerId }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m GigBot, your insurance assistant. Ask me about claims, premiums, triggers, or GigPoints!' },
    { from: 'bot', text: 'Namaste! Hindi ya English mein puchiye!' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lang, setLang] = useState('en')
  const { isDark } = useTheme()
  const messagesEnd = useRef(null)

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg) return
    setMessages(prev => [...prev, { from: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)
    let retries = 2
    while (retries >= 0) {
      try {
        const data = await api.gigbot(workerId, userMsg)
        if (data && data.reply) {
          setMessages(prev => [...prev, { from: 'bot', text: data.reply }])
          setIsTyping(false)
          return
        }
        throw new Error('Empty reply')
      } catch (err) {
        retries--
        if (retries < 0) {
          console.error('GigBot error after retries:', err)
          setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again!' }])
        } else {
          await new Promise(r => setTimeout(r, 500))
        }
      }
    }
    setIsTyping(false)
  }

  return (
    <div className={`absolute inset-x-0 bottom-[56px] z-40 backdrop-blur-2xl flex flex-col rounded-t-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-dark/97 border-t border-primary/20' : 'bg-white/98 border-t border-gray-200'}`} style={{ height: '55%', maxHeight: '420px' }}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b shrink-0 ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center"><MessageCircle size={14} className="text-white" /></div>
          <div><p className="text-sm font-bold text-text-primary">GigBot</p>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-success" /><p className="text-[10px] text-text-muted">AI-powered · {lang === 'en' ? 'English' : 'Hindi'}</p></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${isDark ? 'bg-dark-surface border-dark-border text-text-secondary' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{lang === 'en' ? 'हिं' : 'EN'}</button>
          <button onClick={onClose} className="text-text-muted"><X size={16} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} slide-up`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${m.from === 'user' ? 'gradient-primary text-white rounded-br-md' : isDark ? 'bg-dark-surface text-text-primary rounded-bl-md' : 'bg-gray-100 text-gray-700 rounded-bl-md'}`}>{m.text}</div>
          </div>
        ))}
        {isTyping && <div className="flex justify-start"><div className={`rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 ${isDark ? 'bg-dark-surface' : 'bg-gray-100'}`}><div className="w-2 h-2 rounded-full animate-bounce bg-text-muted/60" style={{animationDelay:'0ms'}}/><div className="w-2 h-2 rounded-full animate-bounce bg-text-muted/60" style={{animationDelay:'150ms'}}/><div className="w-2 h-2 rounded-full animate-bounce bg-text-muted/60" style={{animationDelay:'300ms'}}/></div></div>}
        <div ref={messagesEnd} />
      </div>
      <div className="px-3 pb-1.5 flex gap-1.5 overflow-x-auto shrink-0">
        {['Claim Status', 'My Premium', 'Triggers', 'GigPoints', 'Pool Info'].map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all hover:border-primary/30 hover:text-primary ${isDark ? 'bg-dark-surface border-dark-border text-text-secondary' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{q}</button>
        ))}
      </div>
      <div className={`p-2.5 border-t flex gap-2 shrink-0 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask GigBot anything..."
          className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border focus:border-primary/30 ${isDark ? 'bg-dark-surface text-text-primary placeholder-text-muted border-dark-border' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'}`} />
        <button onClick={() => sendMessage()} className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${input.trim() ? 'gradient-primary' : isDark ? 'bg-dark-surface' : 'bg-gray-200'}`}>
          <Send size={14} className={input.trim() ? 'text-white' : 'text-text-muted'} />
        </button>
      </div>
    </div>
  )
}


// ─── HOME TAB (API-connected) ────────────────────────
function HomeTab({ dashData, setShowNotif, showNotif, openPurchase, notifications, loadDashboard, workerId, setActiveTab, setShowGigBot }) {
  const { isDark, toggleTheme } = useTheme()
  const d = dashData
  if (!d) return <Spinner />

  const worker = d.worker || {}
  const zone = d.zone || {}
  const policy = d.policy
  const loyalty = d.loyalty || {}
  const savings = d.savings || {}
  const forecast = d.forecast || []
  const timeline = d.timeline || []
  const reminders = d.upcomingReminders || []
  const coverageGap = d.coverageGap

  const zoneStyles = getZoneStyles(zone.status)
  const zoneStatusLabel = (zone.status || 'safe').toUpperCase()

  return (
    <div className="space-y-3.5 mt-2">
      <div className="flex items-center justify-between">
        <div><p className="text-text-secondary text-sm">{getGreeting()},</p><h2 className="text-xl font-bold text-text-primary">{worker.name || 'Partner'}</h2></div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="relative w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            {isDark ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-text-secondary" />}
          </button>
          <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <Bell size={16} className="text-text-secondary" />
            {notifications.length > 0 && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-danger flex items-center justify-center"><span className="text-[8px] text-white font-bold">{notifications.length}</span></div>}
          </button>
        </div>
      </div>

      {showNotif && notifications.length > 0 && (
        <div className="glass rounded-2xl p-3 space-y-2 slide-up">
          <SectionLabel>Notifications</SectionLabel>
          {notifications.slice(0, 5).map((n, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-dark-surface/50">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-primary/20"><Bell size={12} className="text-primary" /></div>
              <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-text-primary">{n.message?.slice(0, 50)}{n.message?.length > 50 ? '...' : ''}</p><p className="text-[9px] text-text-muted">{n.channel?.toUpperCase()} · {formatTime(n.sentAt)}</p></div>
            </div>
          ))}
        </div>
      )}

      {/* Zone Status - clickable card */}
      <button onClick={() => setActiveTab('policy')} className={`w-full text-left ${zoneStyles.bg} border ${zoneStyles.border} rounded-2xl p-3.5 active:scale-[0.98] transition-transform`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative"><div className={`w-2.5 h-2.5 rounded-full ${zoneStyles.dotBg}`} /><div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${zoneStyles.dotBg} pulse-ring`} /></div>
            <div><p className={`text-sm font-bold ${zoneStyles.text}`}>ZONE {zoneStatusLabel}</p><p className="text-[10px] text-text-secondary">{zone.name} · {zone.city || 'Your City'} · {zone.id}</p></div>
          </div>
          <ChevronRight size={14} className="text-text-muted" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-dark-border/20">
          {[{ icon: CloudRain, label: 'Rain', val: `${zone.metrics?.rainfall ?? 0}mm` }, { icon: Thermometer, label: 'Temp', val: `${zone.metrics?.temperature ?? 0}°C` }, { icon: Wind, label: 'AQI', val: `${zone.metrics?.aqi ?? 0}` }].map((m, i) => (
            <div key={i} className="text-center"><m.icon size={12} className="text-text-muted mx-auto mb-0.5" /><p className="text-[10px] text-text-muted">{m.label}</p><p className="text-sm font-bold text-text-primary">{m.val}</p></div>
          ))}
        </div>
      </button>

      {/* Active Policy - clickable to view details */}
      {policy ? (
        <button onClick={() => setActiveTab('policy')} className="w-full text-left glass rounded-2xl p-3.5 relative overflow-hidden active:scale-[0.98] transition-transform">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.04] rounded-bl-[60px]" />
          <div className="flex items-center justify-between mb-2 relative"><SectionLabel>Active Policy</SectionLabel><StatusPill status="info">{policy.planName}</StatusPill></div>
          <div className="flex items-baseline gap-1 mb-1"><span className="text-2xl font-bold text-text-primary">₹{policy.payoutPerDay}</span><span className="text-xs text-text-secondary">/disruption day</span></div>
          <p className="text-[10px] text-text-secondary mb-2">Valid {formatDate(policy.startsAt)} – {formatDate(policy.endsAt)}</p>
          <div className="h-1.5 rounded-full bg-dark-border overflow-hidden mb-1"><div className="h-full gradient-primary rounded-full" style={{ width: `${Math.min(100, (policy.daysRemaining / 7) * 100)}%` }} /></div>
          <div className="flex justify-between"><p className="text-[9px] text-text-muted">{policy.daysRemaining} of 7 days remaining</p><p className="text-[9px] text-primary font-medium">₹{policy.finalPremium}/wk</p></div>
        </button>
      ) : (
        <button onClick={openPurchase} className="w-full glass rounded-2xl p-4 text-center border-2 border-dashed border-primary/30">
          <Shield size={24} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-bold text-text-primary">Get Protected Now</p>
          <p className="text-xs text-text-muted">Choose a plan starting from ₹49/week</p>
        </button>
      )}

      {/* Premium Forecast - clickable */}
      {forecast.length > 0 && (
        <button onClick={() => setActiveTab('policy')} className="w-full text-left bg-primary/[0.04] border border-primary/15 rounded-2xl p-3.5 active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><TrendingUp size={15} className="text-primary" /><p className="text-[13px] font-bold text-text-primary">Premium Forecast</p></div>
            {forecast.some(f => f.trend === 'rising') && <StatusPill status="warning">Rising</StatusPill>}
          </div>
          <div className="h-14">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs><linearGradient id="premGradHome" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a45b33" stopOpacity={0.25} /><stop offset="100%" stopColor="#a45b33" stopOpacity={0} /></linearGradient></defs>
                <Area type="monotone" dataKey="premium" stroke="#a45b33" fill="url(#premGradHome)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </button>
      )}

      {/* Quick Stats - clickable */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setActiveTab('points')} className="text-left glass rounded-2xl p-3 active:scale-[0.97] transition-transform">
          <div className="flex items-center gap-1.5 mb-1.5"><Award size={14} className="text-primary" /><p className="text-[10px] text-text-muted">GigPoints</p></div>
          <p className="text-xl font-bold text-gradient">{loyalty.points?.toLocaleString() || 0}</p>
          <div className="flex items-center gap-1.5 mt-0.5"><p className="text-[10px] text-text-secondary">{loyalty.tier?.name || 'Starter'} Tier</p></div>
        </button>
        <button onClick={() => setActiveTab('history')} className="text-left gradient-success rounded-2xl p-3 active:scale-[0.97] transition-transform">
          <div className="flex items-center gap-1.5 mb-1.5"><TrendingUp size={14} className="text-white/80" /><p className="text-[10px] text-white/70">Net Savings</p></div>
          <p className="text-xl font-bold text-white">₹{savings.netSavings?.toLocaleString() || 0}</p>
          <p className="text-[10px] text-white/80 mt-0.5">{savings.roiPercent || 0}% ROI</p>
        </button>
      </div>

      {/* Streak - clickable */}
      <button onClick={() => setActiveTab('points')} className="w-full text-left glass rounded-2xl p-3 active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5"><Flame size={14} className="text-warning" /><p className="text-sm font-semibold text-text-primary">{loyalty.streakWeeks || 0}-Week Streak</p></div>
          <p className="text-[10px] text-primary">+75 pts/week</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`flex-1 py-1.5 rounded-lg text-center text-[9px] font-bold ${i < (loyalty.streakWeeks || 0) ? 'gradient-primary text-white' : 'bg-dark-surface text-text-muted border border-dashed border-dark-border'}`}>
              {i < (loyalty.streakWeeks || 0) ? '✓' : `W${i + 1}`}
            </div>
          ))}
        </div>
      </button>

      {/* Smart Reminders - items clickable */}
      {reminders.length > 0 && (
        <div className="glass rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><BellRing size={15} className="text-accent" /><p className="text-[13px] font-semibold text-text-primary">Smart Reminders</p></div><StatusPill status="info">AI-Powered</StatusPill></div>
          <div className="space-y-2">
            {reminders.slice(0, 2).map((r, i) => (
              <button key={i} onClick={() => setShowNotif(!showNotif)} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface/50 hover:bg-dark-surface/70 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.dispatchedAt ? 'bg-success/15' : 'bg-warning/15'}`}>
                  {r.channel === 'push' ? <Bell size={12} className={r.dispatchedAt ? 'text-success' : 'text-warning'} /> : <Phone size={12} className="text-success" />}
                </div>
                <div className="flex-1 min-w-0 text-left"><p className="text-[10px] text-text-secondary truncate leading-relaxed">{r.message}</p><p className="text-[9px] text-text-muted mt-0.5">{r.label} · {r.channel?.toUpperCase()}</p></div>
                <span className={`text-[9px] font-bold shrink-0 ${r.dispatchedAt ? 'text-success' : 'text-warning'}`}>{r.dispatchedAt ? '✓' : '⏱'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {[{ icon: FileCheck, label: 'Claims', color: 'text-success', bg: 'bg-success/10', action: () => setActiveTab('history') },
            { icon: CreditCard, label: 'Pay', color: 'text-primary', bg: 'bg-primary/10', action: openPurchase },
            { icon: Users, label: 'Refer', color: 'text-accent', bg: 'bg-accent/10', action: () => setActiveTab('points') },
            { icon: Headphones, label: 'Help', color: 'text-warning', bg: 'bg-warning/10', action: () => setShowGigBot(true) }
          ].map((a, i) => (
            <button key={i} onClick={a.action} className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-dark-surface/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}><a.icon size={18} className={a.color} /></div>
              <span className="text-[10px] text-text-muted font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Activity from timeline - clickable */}
      {timeline.length > 0 && (
        <div className="glass rounded-2xl p-3">
          <SectionLabel action={() => setActiveTab('history')} actionLabel="View All">Recent Activity</SectionLabel>
          <div className="space-y-2.5">
            {timeline.slice(0, 3).map((item, i) => (
              <button key={i} onClick={() => setActiveTab('history')} className="w-full flex items-center gap-2.5 hover:bg-dark-surface/30 rounded-xl p-1 -m-1 transition-colors">
                <div className={`w-8 h-8 rounded-xl ${item.type === 'claim' ? 'bg-primary/20' : 'bg-accent/20'} flex items-center justify-center shrink-0`}>
                  {item.type === 'claim' ? <CloudRain size={14} className="text-primary" /> : <Shield size={14} className="text-accent" />}
                </div>
                <div className="flex-1 min-w-0 text-left"><p className="text-xs font-medium text-text-primary">{item.title}</p><p className="text-[10px] text-text-secondary">{formatTime(item.at)} · {item.zoneId || ''}</p></div>
                {item.amount > 0 && <div className="text-right shrink-0"><p className="text-xs font-bold text-success">+₹{item.amount}</p>{item.points > 0 && <p className="text-[10px] text-primary">+{item.points} pts</p>}</div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coverage Gap Alert */}
      {coverageGap && (
        <button onClick={openPurchase} className="w-full text-left bg-danger/[0.04] border border-danger/15 rounded-2xl p-3.5 active:scale-[0.98] transition-transform">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle size={16} className="text-danger" /></div>
            <div>
              <p className="text-[13px] font-bold text-danger">Coverage Gap Alert</p>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">You could have received ₹{coverageGap.wouldHaveReceived} from the last event. Renew now for ₹{coverageGap.renewNowPrice}/week.</p>
              <span className="mt-2.5 inline-flex px-4 py-2 text-[11px] font-semibold gradient-primary text-white rounded-xl shadow-sm shadow-primary/15">Renew Now →</span>
            </div>
          </div>
        </button>
      )}

      {/* Emergency SOS */}
      <SosButton />
    </div>
  )
}


// ─── POLICY TAB (API-connected) ───────────────────────
function PolicyTab({ dashData, workerId, loadDashboard, openPurchase }) {
  const [autoRenew, setAutoRenew] = useState(dashData?.policy?.autoRenew ?? true)
  const [claims, setClaims] = useState([])
  const [cert, setCert] = useState('')

  const d = dashData
  const policy = d?.policy
  const forecast = d?.forecast || []
  const zone = d?.zone || {}
  const worker = d?.worker || {}
  const loyalty = d?.loyalty || {}

  useEffect(() => {
    if (!workerId) return
    api.history(workerId).then(data => setClaims(data.claims || [])).catch(() => {})
  }, [workerId])

  const handleAutoRenew = async () => {
    const newVal = !autoRenew
    setAutoRenew(newVal)
    try { await api.toggleAutoRenew(workerId, newVal) } catch { setAutoRenew(!newVal) }
  }

  const downloadCert = async () => {
    try {
      const text = await api.certificate(workerId)
      setCert(text)
    } catch { /* ignore */ }
  }

  if (!policy) return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">My Policy</h2>
      <div className="glass rounded-2xl p-6 text-center">
        <Shield size={32} className="text-primary mx-auto mb-3" />
        <p className="text-sm font-bold text-text-primary mb-2">No Active Policy</p>
        <p className="text-xs text-text-muted mb-4">Get protected against weather disruptions</p>
        <button onClick={openPurchase} className="px-6 py-3 gradient-primary rounded-2xl text-white font-bold">Choose a Plan</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">My Policy</h2>

      {/* Certificate */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30">
        <div className="absolute inset-0 pattern-dots opacity-30" /><div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Shield size={16} className="text-primary" /><span className="text-xs font-bold text-primary">GIGSHIELD POLICY</span></div>
            <button onClick={downloadCert} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium"><Download size={10} /> View</button>
          </div>
          <div className="space-y-2">
            {[['Policy ID', policy.certificateId], ['Holder', worker.name], ['Zone', `${zone.name}, ${zone.city || 'Bangalore'}`], ['Plan', policy.planName], ['Coverage', `₹${policy.payoutPerDay}/disruption day`], ['Valid', `${formatDate(policy.startsAt)} – ${formatDate(policy.endsAt)}`], ['Premium', `₹${policy.finalPremium} (${loyalty.tier?.discountPercent || 0}% tier discount)`], ['Tier', loyalty.tier?.name || 'Starter']].map(([k, v], i) => (
              <div key={i} className="flex justify-between text-xs"><span className="text-text-muted">{k}</span><span className="text-text-primary">{v}</span></div>
            ))}
          </div>
          <div className="mt-3 pt-2.5 border-t border-dark-border">
            <p className="text-[9px] text-text-muted mb-1.5">COVERED TRIGGERS</p>
            <div className="flex flex-wrap gap-1">
              {['Rain >15mm', 'AQI >300', 'Temp >43°C', 'Flood', 'Store Closure', 'Curfew'].map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-dark-surface rounded-full text-[9px] text-text-secondary">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {cert && (
        <div className="glass rounded-2xl p-3"><pre className="text-[9px] text-text-secondary whitespace-pre-wrap font-mono">{cert}</pre></div>
      )}

      {/* 7-Day Premium Forecast */}
      {forecast.length > 0 && (
        <div className="glass rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-3"><SectionLabel>7-Day Premium Forecast</SectionLabel></div>
          <div className="h-32 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="forecastGradPolicy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bf5b45" stopOpacity={0.2} /><stop offset="100%" stopColor="#bf5b45" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,48,40,0.2)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#9e907f', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9e907f', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="premium" stroke="#bf5b45" fill="url(#forecastGradPolicy)" strokeWidth={2} dot={{ r: 3, fill: '#bf5b45', strokeWidth: 0 }} name="Premium" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Risk Drivers</p>
            {[{ label: 'Rainfall forecast', pct: 35, color: '#a45b33' }, { label: 'AQI trend', pct: 30, color: '#c38a2e' }, { label: 'Historical risk', pct: 25, color: '#8a6a52' }, { label: 'Traffic + news', pct: 10, color: '#bf5b45' }].map((dr, i) => (
              <div key={i}><div className="flex justify-between mb-0.5"><span className="text-[10px] text-text-secondary">{dr.label}</span><span className="text-[10px] text-text-muted font-medium">{dr.pct}%</span></div>
                <div className="h-[3px] rounded-full bg-dark-border overflow-hidden"><div className="h-full rounded-full" style={{ width: `${dr.pct * 2.5}%`, background: dr.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-Renew */}
      <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5"><RefreshCw size={16} className="text-primary" /><div><p className="text-sm font-semibold text-text-primary">Auto-Renew</p><p className="text-[10px] text-text-secondary">UPI mandate active</p></div></div>
        <button onClick={handleAutoRenew} className={`w-11 h-6 rounded-full transition-all relative ${autoRenew ? 'bg-primary' : 'bg-dark-border'}`}>
          <div className={`rounded-full bg-white absolute top-[3px] transition-all ${autoRenew ? 'right-[3px]' : 'left-[3px]'}`} style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Latest Claim */}
      {claims.length > 0 && (() => {
        const c = claims[0]
        return (
          <div className="glass rounded-2xl p-3.5">
            <SectionLabel>Latest Claim</SectionLabel>
            <div className="space-y-1.5">
              {[['Claim ID', c.id], ['Event', c.type], ['Triggered', formatTime(c.triggeredAt) + ', ' + formatDate(c.triggeredAt)], ['Payout', `₹${c.payoutAmount}`], ['Status', c.status?.toUpperCase()]].map(([k, v], i) => (
                <div key={i} className="flex justify-between text-xs"><span className="text-text-muted">{k}</span>
                  {k === 'Payout' ? <span className="text-success font-bold">{v}</span> : k === 'Status' ? <StatusPill status="success">{v}</StatusPill> : <span className="text-text-primary">{v}</span>}
                </div>
              ))}
            </div>
            {c.validation && (
              <div className="mt-2.5 pt-2 border-t border-dark-border space-y-1">
                <p className="text-[9px] text-text-muted mb-1">VALIDATION</p>
                {[['GPS in zone', c.validation.gps], ['Active recently', c.validation.activity], ['App logged in', c.validation.session], ['No duplicate', c.validation.duplicate]].map(([label, pass], i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    {pass ? <CheckCircle2 size={10} className="text-success" /> : <XCircle size={10} className="text-danger" />}
                    <span className="text-[10px] text-text-secondary">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}


// ─── POINTS TAB (API-connected) ───────────────────────
function PointsTab({ dashData, workerId }) {
  const [pointsData, setPointsData] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [refName, setRefName] = useState('')
  const [refMobile, setRefMobile] = useState('')

  useEffect(() => {
    if (!workerId) return
    api.points(workerId).then(setPointsData).catch(() => {})
    api.referrals(workerId).then(d => setReferrals(d.referrals || [])).catch(() => {})
  }, [workerId])

  const createRef = async () => {
    if (!refName || !refMobile) return
    try {
      await api.createReferral(workerId, { referredName: refName, referredMobile: `+91${refMobile}` })
      setRefName(''); setRefMobile('')
      const d = await api.referrals(workerId)
      setReferrals(d.referrals || [])
    } catch { /* ignore */ }
  }

  const pts = pointsData || {}
  const balance = pts.balance || dashData?.loyalty?.points || 0
  const tier = pts.tier || dashData?.loyalty?.tier || { name: 'Starter', discountPercent: 0 }
  const ledger = pts.ledger || []
  const milestones = pts.milestones || []
  const tierEmoji = { Starter: '🥉', Reliable: '🥈', Veteran: '🥇', Champion: '💎' }[tier.name] || '🥉'

  const nextTier = tier.name === 'Starter' ? { name: 'Reliable', min: 1000 } : tier.name === 'Reliable' ? { name: 'Veteran', min: 2500 } : tier.name === 'Veteran' ? { name: 'Champion', min: 5000 } : null
  const progressPct = nextTier ? Math.min(100, Math.round((balance / nextTier.min) * 100)) : 100

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">GigPoints</h2>

      <div className="relative overflow-hidden rounded-2xl gradient-primary p-4">
        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-white/10 blur-[30px]" />
        <div className="relative flex items-center justify-between">
          <div><p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Total Balance</p><p className="text-3xl font-black text-white mt-0.5">{balance.toLocaleString()}</p><p className="text-xs text-white/80 mt-0.5">{tierEmoji} {tier.name} · {tier.discountPercent}% discount</p></div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10" style={{ borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', borderStyle: 'solid' }}><span className="text-2xl">{tierEmoji}</span></div>
        </div>
        {nextTier && (
          <div className="mt-3"><div className="flex justify-between text-[10px] text-white/70 mb-1"><span>{balance.toLocaleString()} / {nextTier.min.toLocaleString()} to {nextTier.name}</span><span>{progressPct}%</span></div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: `${progressPct}%` }} /></div>
          </div>
        )}
      </div>

      {/* Tier Roadmap */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Tier Roadmap</SectionLabel>
        <div className="space-y-2">
          {[{ name: 'Starter', emoji: '🥉', min: 0, desc: 'Standard coverage' }, { name: 'Reliable', emoji: '🥈', min: 1000, desc: '5% premium discount' }, { name: 'Veteran', emoji: '🥇', min: 2500, desc: '10% off + priority payout' }, { name: 'Champion', emoji: '💎', min: 5000, desc: '15% off + free week/quarter' }].map((t, i) => {
            const isCurrent = t.name === tier.name
            return (
              <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl ${isCurrent ? 'bg-primary/10 border border-primary/30' : ''}`}>
                <span className="text-base">{t.emoji}</span>
                <div className="flex-1"><div className="flex justify-between"><p className={`text-xs font-semibold ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>{t.name}</p><span className="text-[9px] text-text-muted">{t.min.toLocaleString()}+ pts</span></div><p className="text-[9px] text-text-secondary">{t.desc}</p></div>
                {isCurrent && <StatusPill status="info">You</StatusPill>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="glass rounded-2xl p-3.5">
          <SectionLabel>Reward Milestones</SectionLabel>
          <div className="space-y-2.5">
            {milestones.map((m, i) => {
              const prog = Math.min(100, Math.round((balance / m.points) * 100))
              return (
                <div key={i} className="p-2.5 rounded-xl bg-dark-surface/40">
                  <div className="flex justify-between mb-1.5"><p className="text-[11px] text-text-primary font-medium">{m.reward}</p><span className="text-[10px] text-primary font-semibold">{m.points.toLocaleString()} pts</span></div>
                  <div className="h-[3px] rounded-full bg-dark-border overflow-hidden"><div className="h-full gradient-primary rounded-full" style={{ width: `${prog}%` }} /></div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Points */}
      {ledger.length > 0 && (
        <div className="glass rounded-2xl p-3.5">
          <SectionLabel>Recent Points</SectionLabel>
          <div className="space-y-2">
            {ledger.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between py-0.5">
                <div><p className="text-xs text-text-primary">{item.action}</p><p className="text-[9px] text-text-muted">{formatDate(item.at)}</p></div>
                <span className="text-xs font-bold text-primary">+{item.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center gap-2 mb-2"><UserPlus size={16} className="text-accent" /><p className="text-sm font-bold text-text-primary">Refer Partners</p></div>
        <p className="text-[10px] text-text-secondary mb-2.5">Both get ₹50 off + you earn 500 pts</p>
        <div className="space-y-2 mb-3">
          <input type="text" placeholder="Friend's name" value={refName} onChange={e => setRefName(e.target.value)} className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
          <input type="tel" placeholder="Mobile number" value={refMobile} onChange={e => setRefMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
        </div>
        <button onClick={createRef} disabled={!refName || refMobile.length !== 10} className="w-full py-2 bg-accent/10 border border-accent/30 rounded-xl text-accent text-xs font-semibold disabled:opacity-50">Send Referral</button>
        {referrals.length > 0 && (
          <div className="mt-3 space-y-1">
            {referrals.map((r, i) => (
              <div key={i} className="flex justify-between text-[10px]"><span className="text-text-secondary">{r.referredName}</span><StatusPill status={r.status === 'confirmed' ? 'success' : 'warning'}>{r.status}</StatusPill></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


// ─── HISTORY TAB (API-connected) ─────────────────────
function HistoryTab({ dashData, workerId }) {
  const [histData, setHistData] = useState(null)
  const [poolData, setPoolData] = useState(null)
  const [subTab, setSubTab] = useState('savings')

  useEffect(() => {
    if (!workerId) return
    api.history(workerId).then(setHistData).catch(() => {})
    api.pool(workerId).then(d => setPoolData(d.pool)).catch(() => {})
  }, [workerId])

  const summary = histData?.summary || dashData?.savings || {}
  const claims = histData?.claims || []
  const zoneHistory = histData?.zoneHistory || []
  const lifetime = histData?.lifetimeProtection || []
  const timeline = dashData?.timeline || []

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">Protection History</h2>
      <div className="flex gap-1 bg-dark-card/80 rounded-xl p-[3px] border border-dark-border/40">
        {[{ id: 'savings', label: 'Savings' }, { id: 'graph', label: 'Graph' }, { id: 'pool', label: 'Pool' }, { id: 'timeline', label: 'Timeline' }].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} className={`flex-1 py-2 rounded-[9px] text-[11px] font-semibold transition-all ${subTab === t.id ? 'gradient-primary text-white shadow-sm shadow-primary/15' : 'text-text-muted'}`}>{t.label}</button>
        ))}
      </div>

      {subTab === 'savings' && (
        <div className="space-y-3.5">
          <div className="glass rounded-2xl p-4">
            <SectionLabel>Lifetime Savings</SectionLabel>
            <div className="grid grid-cols-2 gap-3 mb-3"><div><p className="text-[10px] text-text-muted">Premiums Paid</p><p className="text-base font-bold text-text-primary">₹{summary.premiumsPaid?.toLocaleString() || 0}</p></div><div><p className="text-[10px] text-text-muted">Payouts Received</p><p className="text-base font-bold text-success">₹{summary.payoutsReceived?.toLocaleString() || 0}</p></div></div>
            <div className="border-t border-dark-border pt-2.5">
              <div className="flex justify-between"><p className="text-sm text-text-secondary">Net Savings</p><p className="text-xl font-black text-gradient">₹{summary.netSavings?.toLocaleString() || 0}</p></div>
              <div className="flex justify-between mt-1"><p className="text-[10px] text-text-muted">Return on Protection</p><p className="text-sm font-bold text-success">{summary.roiPercent || 0}%</p></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-3.5"><SectionLabel>This Week</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center"><p className="text-base font-bold text-text-primary">₹{summary.weeklyProtectedIncome?.toLocaleString() || 0}</p><p className="text-[9px] text-text-muted">Protected</p></div>
              <div className="text-center"><p className="text-base font-bold text-primary">{summary.weeklyPointsEarned || 0}</p><p className="text-[9px] text-text-muted">Points</p></div>
              <div className="text-center"><p className="text-base font-bold text-accent">{summary.weeklyTriggerCount || 0}</p><p className="text-[9px] text-text-muted">Triggers</p></div>
            </div>
          </div>
          {zoneHistory.length > 0 && (
            <div className="glass rounded-2xl p-3.5"><SectionLabel>Zone Events — 30 Days</SectionLabel>
              <div className="space-y-2">
                {zoneHistory.slice(0, 4).map((z, i) => (
                  <div key={i} className="p-2 rounded-xl bg-dark-surface">
                    <p className="text-[10px] font-bold text-text-primary mb-0.5">{formatDate(z.triggeredAt)} — {z.parameter}</p>
                    <div className="flex gap-2 text-[9px] text-text-muted"><span>{z.durationHours}h</span><span>|</span><span>{z.affectedWorkers} workers</span><span>|</span><span className="text-success">₹{z.totalPayout?.toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {subTab === 'graph' && (
        <div className="space-y-3.5">
          {lifetime.length > 0 && (
            <div className="glass rounded-2xl p-3.5"><SectionLabel>Monthly Premiums vs Payouts</SectionLabel>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lifetime} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,48,40,0.2)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#9e907f', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9e907f', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="premiums" fill="#bf5b45" radius={[4, 4, 0, 0]} name="Premiums" barSize={16} />
                    <Bar dataKey="payouts" fill="#bc8750" radius={[4, 4, 0, 0]} name="Payouts" barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {claims.length > 0 && (
            <div className="glass rounded-2xl p-3.5"><SectionLabel>Event Markers</SectionLabel>
              <div className="space-y-2">
                {claims.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <span className="text-[10px] text-text-muted w-8 font-medium">{formatDate(c.triggeredAt).split(' ').slice(0, 2).join(' ')}</span>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-primary/15"><CloudRain size={12} className="text-primary" /></div>
                    <p className="text-[11px] text-text-secondary flex-1">{c.type}</p>
                    <span className="text-[11px] font-bold text-success">+₹{c.payoutAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {subTab === 'pool' && (
        <div className="space-y-3.5">
          {poolData ? (
            <>
              <div className="relative overflow-hidden rounded-2xl bg-accent/[0.06] border border-accent/20 p-4">
                <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center"><Users size={22} className="text-accent" /></div>
                  <div><p className="text-[14px] font-bold text-text-primary">{dashData?.zone?.name || 'Zone'} Pool</p><p className="text-[11px] text-text-muted">Community Fund</p></div>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[{ label: 'Members', value: poolData.members, color: 'text-text-primary' }, { label: 'Weekly', value: `₹${poolData.weeklyContribution}`, color: 'text-accent' }, { label: 'Balance', value: `₹${poolData.balance?.toLocaleString()}`, color: 'text-success' }].map((item, i) => (
                    <div key={i} className="text-center p-2.5 rounded-xl bg-dark-card/50 backdrop-blur-sm"><p className="text-[9px] text-text-muted uppercase tracking-wider">{item.label}</p><p className={`text-[17px] font-bold ${item.color} mt-0.5`}>{item.value}</p></div>
                  ))}
                </div>
              </div>
              {poolData.motions?.length > 0 && (
                <div className="glass rounded-2xl p-3.5"><SectionLabel>Pool Motions</SectionLabel>
                  <div className="space-y-2">
                    {poolData.motions.map((m, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-dark-surface/40">
                        <div className="flex justify-between mb-1"><p className="text-[11px] text-text-primary font-medium">{m.reason}</p><StatusPill status={m.status === 'approved' ? 'success' : m.status === 'rejected' ? 'danger' : 'warning'}>{m.status}</StatusPill></div>
                        <p className="text-[10px] text-text-muted">₹{m.requestedAmount} · {m.votesFor} for / {m.votesAgainst} against</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : <Spinner />}
        </div>
      )}

      {subTab === 'timeline' && (
        <div className="space-y-3.5">
          <div className="glass rounded-2xl p-3.5"><SectionLabel>Protection Timeline</SectionLabel>
            <div className="space-y-3">
              {timeline.length > 0 ? timeline.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${e.type === 'claim' ? 'bg-primary/20' : 'bg-accent/20'} flex items-center justify-center shrink-0`}>
                    {e.type === 'claim' ? <CloudRain size={14} className="text-primary" /> : <Shield size={14} className="text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium text-text-primary">{e.title}</p><p className="text-[10px] text-text-secondary">{e.zoneId}</p><p className="text-[9px] text-text-muted">{formatTime(e.at)} · {formatDate(e.at)}</p></div>
                  {e.amount > 0 && <div className="text-right shrink-0"><p className="text-xs font-bold text-success">+₹{e.amount}</p>{e.points > 0 && <p className="text-[10px] text-primary">+{e.points}</p>}</div>}
                </div>
              )) : <p className="text-xs text-text-muted text-center py-4">No events yet</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


// ─── PROFILE TAB (API-connected) ──────────────────────
function ProfileTab({ dashData, onBack, workerId, loadDashboard }) {
  const { isDark, toggleTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const worker = dashData?.worker || {}
  const zone = dashData?.zone || {}
  const loyalty = dashData?.loyalty || {}
  const savings = dashData?.savings || {}

  const startEdit = () => {
    setEditData({ name: worker.name || '', platform: worker.platform || 'Zepto', avgDailyHours: worker.avgDailyHours || 8, shiftPattern: worker.shiftPattern || 'Full Day', upiId: worker.upiId || '' })
    setEditing(true)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.updateProfile(workerId, editData)
      setEditing(false)
      if (loadDashboard) await loadDashboard()
    } catch { /* ignore */ }
    setSaving(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('gigshield_registered')
    localStorage.removeItem('gigshield_worker_id')
    window.location.reload()
  }

  const tierEmoji = { Starter: '🥉', Reliable: '🥈', Veteran: '🥇', Champion: '💎' }[loyalty.tier?.name] || '🥉'

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">Profile</h2>

      <div className="glass rounded-2xl p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2"><span className="text-2xl font-bold text-white">{(worker.name || 'U')[0]}</span></div>
          <h3 className="text-base font-bold text-text-primary">{worker.name || 'User'}</h3>
          <p className="text-xs text-text-secondary">{worker.platform} Partner · {zone.name}</p>
          <div className="flex items-center justify-center gap-2 mt-1"><span className="text-[12px]">{tierEmoji}</span><p className="text-[10px] text-primary font-semibold">{loyalty.tier?.name || 'Starter'} · {loyalty.points?.toLocaleString() || 0} pts</p></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[{ label: 'Streak', value: `${loyalty.streakWeeks || 0}w`, color: 'text-warning' }, { label: 'Referrals', value: `${loyalty.referralCount || 0}`, color: 'text-accent' }, { label: 'ROI', value: `${savings.roiPercent || 0}%`, color: 'text-success' }].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center"><p className={`text-[17px] font-bold ${s.color}`}>{s.value}</p><p className="text-[10px] text-text-muted mt-0.5">{s.label}</p></div>
        ))}
      </div>

      <div className="glass rounded-2xl p-3.5">
        {!editing ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Details</p>
              <button onClick={startEdit} className="text-[10px] text-primary font-medium">Edit</button>
            </div>
            <div className="space-y-2">
              {[['Mobile', worker.mobile || '-'], ['Platform', worker.platform || '-'], ['Zone', `${zone.id || '-'}, ${zone.city || 'Bangalore'}`], ['Shift', `${worker.shiftPattern || '-'} (${worker.avgDailyHours || 0} hrs)`], ['Member Since', worker.memberSince || '-'], ['UPI', worker.upiId || '-']].map(([k, v], i) => (
                <div key={i} className="flex justify-between text-xs"><span className="text-text-muted">{k}</span><span className="text-text-primary">{v}</span></div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Edit Profile</p>
            <input type="text" placeholder="Full Name" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}
              className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
            <select value={editData.platform} onChange={e => setEditData({...editData, platform: e.target.value})}
              className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary focus:border-primary focus:outline-none">
              <option value="Zepto">Zepto</option><option value="Blinkit">Blinkit</option><option value="Swiggy Instamart">Swiggy Instamart</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Daily Hours" value={editData.avgDailyHours} onChange={e => setEditData({...editData, avgDailyHours: parseInt(e.target.value) || 8})}
                className="px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary focus:border-primary focus:outline-none" />
              <select value={editData.shiftPattern} onChange={e => setEditData({...editData, shiftPattern: e.target.value})}
                className="px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary focus:border-primary focus:outline-none">
                <option value="Full Day">Full Day</option><option value="Morning">Morning</option><option value="Evening">Evening</option>
              </select>
            </div>
            <input type="text" placeholder="UPI ID" value={editData.upiId} onChange={e => setEditData({...editData, upiId: e.target.value})}
              className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className="flex-1 py-2 gradient-primary rounded-xl text-white text-xs font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
              <button onClick={() => setEditing(false)} className="flex-1 py-2 bg-dark-surface border border-dark-border rounded-xl text-text-secondary text-xs font-semibold">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">{isDark ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-warning" />}<div><p className="text-sm font-semibold text-text-primary">Dark Mode</p><p className="text-[10px] text-text-secondary">{isDark ? 'Dark bluish theme' : 'Light theme'}</p></div></div>
        <button onClick={toggleTheme} className={`w-11 h-6 rounded-full transition-all relative ${isDark ? 'bg-primary' : 'bg-dark-border'}`}><div className={`rounded-full bg-white absolute top-[3px] transition-all ${isDark ? 'right-[3px]' : 'left-[3px]'}`} style={{ width: 18, height: 18 }} /></button>
      </div>

      <ProfileSettingsPanel dashData={dashData} workerId={workerId} loadDashboard={loadDashboard} />

      <button onClick={handleLogout} className="w-full py-2.5 bg-danger/10 border border-danger/25 rounded-2xl text-danger font-medium text-xs">Logout</button>
      <button onClick={onBack} className="w-full py-2.5 bg-dark-card border border-dark-border rounded-2xl text-text-secondary font-medium text-xs">{'\u2190'} Back to Landing Page</button>
    </div>
  )
}


// ─── SOS BUTTON ──────────────────────────────────
function SosButton() {
  const [sosTriggered, setSosTriggered] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!sosTriggered) return
    if (countdown <= 0) {
      setSosTriggered(false)
      setCountdown(5)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [sosTriggered, countdown])

  const handleSos = () => {
    if (sosTriggered) {
      setSosTriggered(false)
      setCountdown(5)
    } else {
      setSosTriggered(true)
    }
  }

  return (
    <div className="glass rounded-2xl p-3.5">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${sosTriggered ? 'bg-danger/30 animate-pulse' : 'bg-danger/15'}`}>
          <HeartPulse size={22} className="text-danger" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-text-primary">Emergency SOS</p>
          <p className="text-[11px] text-text-muted">
            {sosTriggered ? `Alert sent! Resetting in ${countdown}s...` : 'Accident, health emergency, or safety issue'}
          </p>
        </div>
        <button onClick={handleSos}
          className={`px-3 py-2 border rounded-xl text-[11px] font-bold active:scale-95 transition-transform ${
            sosTriggered ? 'bg-success/10 border-success/25 text-success' : 'bg-danger/10 border-danger/25 text-danger'
          }`}>
          {sosTriggered ? 'Cancel' : 'SOS'}
        </button>
      </div>
    </div>
  )
}

// ─── PROFILE SETTINGS PANEL ─────────────────────
function ProfileSettingsPanel({ dashData, workerId, loadDashboard }) {
  const [activePanel, setActivePanel] = useState(null)
  const [notifPush, setNotifPush] = useState(true)
  const [notifSms, setNotifSms] = useState(true)
  const [language, setLanguage] = useState('en')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencySaved, setEmergencySaved] = useState(false)
  const [sosActive, setSosActive] = useState(false)

  const worker = dashData?.worker || {}

  const handleSos = () => {
    setSosActive(true)
    setTimeout(() => setSosActive(false), 3000)
  }

  const saveEmergency = () => {
    setEmergencySaved(true)
    setTimeout(() => setEmergencySaved(false), 2000)
  }

  const handleDownloadData = () => {
    const data = JSON.stringify({
      worker: dashData?.worker,
      zone: dashData?.zone,
      policy: dashData?.policy,
      loyalty: dashData?.loyalty,
      savings: dashData?.savings,
      exportedAt: new Date().toISOString()
    }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gigshield-data-${workerId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (activePanel === 'notifications') {
    return (
      <div className="glass rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-text-primary">Notification Settings</p>
          <button onClick={() => setActivePanel(null)} className="text-xs text-primary">Done</button>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2"><Bell size={14} className="text-text-muted" /><span className="text-xs text-text-primary">Push Notifications</span></div>
          <button onClick={() => setNotifPush(!notifPush)} className={`w-10 h-5 rounded-full transition-all relative ${notifPush ? 'bg-primary' : 'bg-dark-border'}`}>
            <div className={`rounded-full bg-white absolute top-[2px] transition-all ${notifPush ? 'right-[2px]' : 'left-[2px]'}`} style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2"><Phone size={14} className="text-text-muted" /><span className="text-xs text-text-primary">SMS Alerts</span></div>
          <button onClick={() => setNotifSms(!notifSms)} className={`w-10 h-5 rounded-full transition-all relative ${notifSms ? 'bg-primary' : 'bg-dark-border'}`}>
            <div className={`rounded-full bg-white absolute top-[2px] transition-all ${notifSms ? 'right-[2px]' : 'left-[2px]'}`} style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <p className="text-[9px] text-text-muted">Pre-disruption, payout, and renewal alerts</p>
      </div>
    )
  }

  if (activePanel === 'payment') {
    return (
      <div className="glass rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-text-primary">Payment Methods</p>
          <button onClick={() => setActivePanel(null)} className="text-xs text-primary">Done</button>
        </div>
        <div className="p-3 rounded-xl bg-dark-surface/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center"><CreditCard size={14} className="text-primary" /></div>
            <div><p className="text-xs font-semibold text-text-primary">UPI</p><p className="text-[10px] text-text-muted">{worker.upiId || 'Not set'}</p></div>
          </div>
          <StatusPill status="success">Active</StatusPill>
        </div>
        <p className="text-[9px] text-text-muted">Payouts are sent via Razorpay sandbox to your UPI</p>
      </div>
    )
  }

  if (activePanel === 'language') {
    return (
      <div className="glass rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-text-primary">Language / {'\u092D\u093E\u0937\u093E'}</p>
          <button onClick={() => setActivePanel(null)} className="text-xs text-primary">Done</button>
        </div>
        {[{ id: 'en', label: 'English', sub: 'Default' }, { id: 'hi', label: '\u0939\u093F\u0928\u094D\u0926\u0940', sub: 'Hindi' }].map(lang => (
          <button key={lang.id} onClick={() => setLanguage(lang.id)}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${language === lang.id ? 'border-primary/40 bg-primary/5' : 'border-dark-border'}`}>
            <div><p className="text-xs font-semibold text-text-primary">{lang.label}</p><p className="text-[10px] text-text-muted">{lang.sub}</p></div>
            {language === lang.id && <CheckCircle2 size={16} className="text-primary" />}
          </button>
        ))}
        <p className="text-[9px] text-text-muted">GigBot will respond in your chosen language</p>
      </div>
    )
  }

  if (activePanel === 'emergency') {
    return (
      <div className="glass rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-text-primary">Emergency Contact</p>
          <button onClick={() => setActivePanel(null)} className="text-xs text-primary">Done</button>
        </div>
        <input type="tel" placeholder="Emergency phone number" value={emergencyContact}
          onChange={e => setEmergencyContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
          className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none" />
        <button onClick={saveEmergency} disabled={emergencyContact.length !== 10}
          className="w-full py-2 gradient-primary rounded-xl text-white text-xs font-semibold disabled:opacity-50">
          {emergencySaved ? '\u2713 Saved' : 'Save Contact'}
        </button>
        <p className="text-[9px] text-text-muted">This contact will be notified when you press SOS</p>
      </div>
    )
  }

  if (activePanel === 'help') {
    return (
      <div className="glass rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-text-primary">Help & Support</p>
          <button onClick={() => setActivePanel(null)} className="text-xs text-primary">Done</button>
        </div>
        {[
          { title: 'How triggers work', desc: 'Automatic detection when threshold is breached for 10 min' },
          { title: 'How payouts work', desc: 'UPI transfer in <60 seconds after fraud checks pass' },
          { title: 'About GigPoints', desc: 'Earn points on every action, unlock premium discounts' },
          { title: 'Contact Support', desc: 'support@gigshield.app | Use GigBot for instant help' },
        ].map((item, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-dark-surface/50">
            <p className="text-xs font-semibold text-text-primary">{item.title}</p>
            <p className="text-[10px] text-text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-3 space-y-2">
      {[
        { label: 'Notification Settings', icon: Bell, action: () => setActivePanel('notifications') },
        { label: 'Payment Methods', icon: CreditCard, action: () => setActivePanel('payment') },
        { label: 'Language / \u092D\u093E\u0937\u093E', icon: Languages, action: () => setActivePanel('language') },
        { label: 'Help & Support', icon: Headphones, action: () => setActivePanel('help') },
        { label: 'Emergency Contact', icon: Phone, action: () => setActivePanel('emergency') },
        { label: 'Download My Data', icon: Download, action: handleDownloadData },
      ].map((item, i) => (
        <button key={i} onClick={item.action} className="w-full flex items-center justify-between py-1.5 hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2.5"><item.icon size={14} className="text-text-muted" /><span className="text-xs text-text-primary">{item.label}</span></div>
          <ChevronRight size={12} className="text-text-muted" />
        </button>
      ))}
    </div>
  )
}
