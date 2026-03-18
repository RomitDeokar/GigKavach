import { useState, useRef, useEffect } from 'react'
import { Shield, ArrowLeft, Home, FileText, Award, Clock, Settings, Bell, ChevronRight, CloudRain, Wind, Thermometer, AlertTriangle, MapPin, Zap, TrendingUp, IndianRupee, Gift, Users, Star, CheckCircle2, XCircle, ChevronDown, Download, RefreshCw, Info, Flame, Target, Trophy, History, UserPlus, MessageCircle, Send, X, TrendingDown, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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
    <div className="bg-dark-card border border-dark-border rounded-lg p-2 text-xs">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: ₹{p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function WorkerApp({ onBack }) {
  const [screen, setScreen] = useState('splash')
  const [activeTab, setActiveTab] = useState('home')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [autoRenew, setAutoRenew] = useState(true)
  const [showGigBot, setShowGigBot] = useState(false)

  if (screen === 'splash') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame bg-dark relative z-10">
            <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-primary opacity-5" />
              <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] rounded-full bg-primary/10 blur-[60px]" />
              <div className="absolute bottom-[20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-accent/10 blur-[60px]" />
              <div className="relative z-10 text-center w-full">
                <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40 float">
                  <Shield size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-text-primary mb-1">GigShield</h1>
                <p className="text-text-secondary text-sm mb-10">Income Protection for Q-Commerce</p>
                <button onClick={() => { setScreen('app'); setShowOnboarding(true); setOnboardStep(0) }}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold text-base shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform mb-3">
                  Get Started
                </button>
                <button onClick={() => setScreen('app')}
                        className="w-full py-3.5 bg-dark-card border border-dark-border rounded-2xl text-text-primary font-semibold text-base active:scale-[0.98] transition-transform mb-6">
                  I Have an Account
                </button>
                <button onClick={onBack} className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                  Back to Landing Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    const steps = [
      {
        title: 'Select Your Platform',
        content: (
          <div className="space-y-3">
            {['Zepto', 'Blinkit', 'Swiggy Instamart'].map((p, i) => (
              <button key={i} className={`w-full p-4 rounded-2xl border text-left transition-all ${i === 0 ? 'border-primary/50 bg-primary/10' : 'border-dark-border bg-dark-card'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? 'gradient-primary' : 'bg-dark-surface'}`}>
                      <span className="text-white font-bold">{p[0]}</span>
                    </div>
                    <span className="font-semibold text-text-primary">{p}</span>
                  </div>
                  {i === 0 && <CheckCircle2 size={20} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )
      },
      {
        title: 'Your Zone Detected',
        content: (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-4">
              <MapPin size={36} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">HSR Layout</h3>
            <p className="text-text-secondary text-sm mb-4">Zone HSR-01 | Bangalore</p>
            <div className="glass rounded-2xl p-4 text-left space-y-2">
              {[
                ['Dark Store', 'Zepto HSR #14'],
                ['Zone Radius', '2.5 km'],
                ['Active Workers', '34 in zone'],
                ['Risk Score', '0.74'],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-muted">{k}</span>
                  <span className={`text-text-primary ${k === 'Risk Score' ? 'font-bold text-warning' : ''}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: 'Complete Your Profile',
        content: (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Daily Working Hours</label>
              <div className="flex gap-2">
                {['4-6 hrs', '6-10 hrs', '10-14 hrs'].map((h, i) => (
                  <button key={i} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${i === 1 ? 'gradient-primary text-white' : 'bg-dark-card border border-dark-border text-text-secondary'}`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Shift Pattern</label>
              <div className="flex gap-2">
                {['Morning', 'Afternoon', 'Full Day'].map((s, i) => (
                  <button key={i} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${i === 2 ? 'gradient-primary text-white' : 'bg-dark-card border border-dark-border text-text-secondary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <Award size={20} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-text-primary">+100 GigPoints</p>
                <p className="text-xs text-text-secondary">For completing your profile</p>
              </div>
            </div>
          </div>
        )
      },
    ]

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame bg-dark relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5">
              <div className="flex gap-2 mb-6 mt-2">
                {steps.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i <= onboardStep ? 'gradient-primary' : 'bg-dark-border'}`} />
                ))}
              </div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Step {onboardStep + 1} of {steps.length}</p>
              <h2 className="text-xl font-bold text-text-primary mb-5">{steps[onboardStep].title}</h2>
              <div className="flex-1 overflow-y-auto">{steps[onboardStep].content}</div>
              <button onClick={() => {
                if (onboardStep < steps.length - 1) setOnboardStep(onboardStep + 1)
                else { setShowOnboarding(false); setShowPurchase(true) }
              }} className="mt-4 w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform">
                {onboardStep < steps.length - 1 ? 'Continue' : 'Choose Your Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPurchase) {
    const plans = [
      { name: 'Basic Shield', price: 49, adjusted: 53, payout: 300, hours: 6, icon: 'B' },
      { name: 'Pro Shield', price: 99, adjusted: 108, payout: 600, hours: 10, icon: 'P' },
      { name: 'Elite Shield', price: 149, adjusted: 162, payout: 1000, hours: 14, icon: 'E' },
    ]
    const forecast = [
      { week: 'This week', price: plans[selectedPlan].adjusted, change: null },
      { week: 'Next week', price: Math.round(plans[selectedPlan].adjusted * 1.18), change: '+18%' },
      { week: 'Week +2', price: Math.round(plans[selectedPlan].adjusted * 1.24), change: '+24%' },
    ]

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame bg-dark relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5 overflow-y-auto">
              <button onClick={() => setShowPurchase(false)} className="flex items-center gap-2 text-text-secondary text-sm mb-3 mt-2">
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-bold text-text-primary mb-1">Choose Your Shield</h2>
              <p className="text-sm text-text-secondary mb-4">AI-adjusted for Zone HSR-01</p>

              <div className="glass rounded-2xl p-3 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Target size={18} className="text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">Zone Risk: 0.74</p>
                  <p className="text-xs text-text-secondary">Premium adjusted +9%</p>
                </div>
              </div>

              {/* Premium Price Forecast */}
              <div className="glass rounded-2xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-warning" />
                  <p className="text-xs font-semibold text-text-primary">Price Forecast</p>
                </div>
                <div className="space-y-1.5">
                  {forecast.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">{f.week}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${i === 0 ? 'text-success' : 'text-danger'}`}>₹{f.price}/wk</span>
                        {f.change && <span className="text-[10px] text-danger">{f.change}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-warning mt-2">Monsoon approaching — prices rising. Lock in today's rate.</p>
              </div>

              <div className="space-y-2.5 mb-4">
                {plans.map((plan, i) => (
                  <button key={i} onClick={() => setSelectedPlan(i)}
                          className={`w-full p-3.5 rounded-2xl border text-left transition-all ${selectedPlan === i ? 'border-primary/50 bg-primary/5' : 'border-dark-border bg-dark-card'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${selectedPlan === i ? 'gradient-primary' : 'bg-dark-surface'}`}>
                          {plan.icon}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{plan.name}</p>
                          <p className="text-xs text-text-secondary mt-0.5">₹{plan.payout}/disruption | {plan.hours}hrs/day</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted line-through">₹{plan.price}/wk</p>
                        <p className="text-base font-bold text-text-primary">₹{plan.adjusted}<span className="text-xs text-text-secondary">/wk</span></p>
                      </div>
                    </div>
                    {selectedPlan === i && (
                      <div className="mt-2.5 pt-2.5 border-t border-dark-border space-y-1">
                        {['All 6 trigger types', 'Instant UPI payout <60s', 'GigPoints on every event'].map((t, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-success">
                            <CheckCircle2 size={11} /><span>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="glass rounded-2xl p-3 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-primary" />
                    <span className="text-text-secondary">Reliable Tier (5%)</span>
                  </div>
                  <span className="font-bold text-success">-₹{Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                </div>
              </div>

              <div className="glass rounded-2xl p-3 mb-4">
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-text-secondary">Premium</span>
                  <span className="text-text-primary">₹{plans[selectedPlan].adjusted}</span>
                </div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-text-secondary">Discount</span>
                  <span className="text-success">-₹{Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                </div>
                <div className="border-t border-dark-border pt-1.5 flex justify-between">
                  <span className="font-bold text-text-primary">Total</span>
                  <span className="text-lg font-bold text-text-primary">₹{plans[selectedPlan].adjusted - Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                </div>
              </div>

              <button onClick={() => setShowPurchase(false)}
                      className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <IndianRupee size={18} /> Pay with UPI
              </button>
              <p className="text-center text-[10px] text-text-muted mt-2">Razorpay Sandbox Mode</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab setShowNotif={setShowNotif} showNotif={showNotif} setShowPurchase={setShowPurchase} />
      case 'policy': return <PolicyTab autoRenew={autoRenew} setAutoRenew={setAutoRenew} />
      case 'points': return <PointsTab />
      case 'history': return <HistoryTab />
      case 'profile': return <ProfileTab onBack={onBack} />
      default: return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative w-full max-w-[375px]">
        <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
        <div className="phone-frame bg-dark relative z-10">
          <div className="phone-notch" />
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pt-10 pb-20 px-5">
              {renderTab()}
            </div>
            {/* GigBot FAB */}
            <button onClick={() => setShowGigBot(!showGigBot)}
                    className="absolute bottom-20 right-4 w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/40 z-30 active:scale-95 transition-transform">
              {showGigBot ? <X size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
            </button>
            {/* GigBot Panel */}
            {showGigBot && <GigBotPanel onClose={() => setShowGigBot(false)} />}
            {/* Tab Bar */}
            <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-dark-border safe-area-bottom z-20">
              <div className="flex items-center justify-around py-2 pb-3">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`}>
                    <tab.icon size={18} />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                    {activeTab === tab.id && <div className="w-1 h-1 rounded-full bg-primary" />}
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

// GIGBOT PANEL
function GigBotPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m GigBot. Ask me anything about your policy, claims, or GigPoints. I speak Hindi and English.', time: 'now' }
  ])
  const [input, setInput] = useState('')
  const messagesEnd = useRef(null)

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { from: 'user', text: userMsg, time: 'now' }])
    setInput('')
    setTimeout(() => {
      let reply = 'I can help with policy details, claims, GigPoints, and more. What would you like to know?'
      const lower = userMsg.toLowerCase()
      if (lower.includes('claim') && (lower.includes('reject') || lower.includes('kyun') || lower.includes('why'))) {
        reply = 'Your last claim check:\n✅ GPS in zone (0.8 km)\n✅ Active (3 deliveries)\n✅ App logged in\n✅ No duplicate\n\nAll checks passed! Your claim was approved and ₹600 was credited.'
      } else if (lower.includes('mera') || lower.includes('hindi') || lower.includes('paise')) {
        reply = 'Agar aapke zone mein trigger hua hai aur aapki policy active hai, toh payout 60 seconds mein UPI pe aa jaata hai. Apna claim status check karein.'
      } else if (lower.includes('point') || lower.includes('gigpoint')) {
        reply = 'Your GigPoints: 2,450 (Reliable Tier)\nYou\'re only 50 pts away from Veteran Tier! Keep your streak going.'
      } else if (lower.includes('renew') || lower.includes('expire')) {
        reply = 'Your Pro Shield policy expires Sunday midnight. Auto-renew is ON. Next week premium: ₹127 (+18% due to monsoon forecast). Current rate: ₹108.'
      } else if (lower.includes('trigger') || lower.includes('cover')) {
        reply = 'GigShield covers:\n• Heavy Rain >15mm/hr\n• Severe AQI >300\n• Extreme Heat >43°C\n• Dark Store Closure\n• Local Curfew\n• Flash Flood Alert\n\nNOT covered: vehicle, health, or personal emergencies.'
      }
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: 'now' }])
    }, 800)
  }

  return (
    <div className="absolute bottom-16 left-3 right-3 h-[55%] glass-strong rounded-2xl flex flex-col z-30 overflow-hidden border border-primary/20">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <MessageCircle size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">GigBot</p>
            <p className="text-[10px] text-success">Online | Hindi + English</p>
          </div>
        </div>
        <button onClick={onClose} className="text-text-muted"><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
              m.from === 'user' ? 'gradient-primary text-white rounded-br-md' : 'bg-dark-surface text-text-primary rounded-bl-md'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>
      <div className="p-2.5 border-t border-dark-border flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && sendMessage()}
               placeholder="Ask about your policy..."
               className="flex-1 bg-dark-surface rounded-xl px-3 py-2 text-xs text-text-primary placeholder-text-muted outline-none border border-dark-border focus:border-primary/30" />
        <button onClick={sendMessage} className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  )
}

// HOME TAB
function HomeTab({ setShowNotif, showNotif, setShowPurchase }) {
  return (
    <div className="space-y-3.5 mt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">Good afternoon,</p>
          <h2 className="text-xl font-bold text-text-primary">Ravi Kumar</h2>
        </div>
        <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
          <Bell size={16} className="text-text-secondary" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-danger flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">3</span>
          </div>
        </button>
      </div>

      {showNotif && (
        <div className="glass rounded-2xl p-3 space-y-2 slide-up">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Notifications</p>
          {[
            { title: '₹600 Credited', desc: 'Rainfall trigger — HSR Layout', time: '12:11 PM', type: 'success' },
            { title: 'Zone Watch Active', desc: 'AQI rising — 280', time: '11:30 AM', type: 'warning' },
            { title: 'Policy Renewed', desc: 'Pro Shield — Week 8', time: 'Yesterday', type: 'info' },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-dark-surface/50 transition-colors">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-success/20' : n.type === 'warning' ? 'bg-warning/20' : 'bg-primary/20'}`}>
                {n.type === 'success' ? <CheckCircle2 size={12} className="text-success" /> : n.type === 'warning' ? <AlertTriangle size={12} className="text-warning" /> : <Info size={12} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary">{n.title}</p>
                <p className="text-[10px] text-text-secondary">{n.desc}</p>
              </div>
              <span className="text-[9px] text-text-muted shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone Status */}
      <div className="bg-success/10 border border-success/30 rounded-2xl p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success pulse-ring" />
            </div>
            <div>
              <p className="text-sm font-bold text-success">ZONE SAFE</p>
              <p className="text-[10px] text-text-secondary">HSR Layout | HSR-01</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-text-muted" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-success/20">
          {[
            { icon: CloudRain, label: 'Rain', val: '3mm' },
            { icon: Thermometer, label: 'Temp', val: '32°C' },
            { icon: Wind, label: 'AQI', val: '142' },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <m.icon size={12} className="text-text-muted mx-auto mb-0.5" />
              <p className="text-[10px] text-text-muted">{m.label}</p>
              <p className="text-sm font-bold text-text-primary">{m.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Policy */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Active Policy</p>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/20 text-primary">Pro Shield</span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-text-primary">₹600</span>
          <span className="text-xs text-text-secondary">/disruption day</span>
        </div>
        <p className="text-[10px] text-text-secondary mb-2">Valid Mar 10 – Mar 16, 2026</p>
        <div className="h-1.5 rounded-full bg-dark-border overflow-hidden mb-1">
          <div className="h-full w-[71%] gradient-primary rounded-full" />
        </div>
        <div className="flex justify-between">
          <p className="text-[9px] text-text-muted">5 of 7 days remaining</p>
          <p className="text-[9px] text-primary font-medium">₹103/wk</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Award size={14} className="text-primary" />
            <p className="text-[10px] text-text-muted">GigPoints</p>
          </div>
          <p className="text-xl font-bold text-gradient">2,450</p>
          <p className="text-[10px] text-text-secondary mt-0.5">Reliable Tier</p>
        </div>
        <div className="gradient-success rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp size={14} className="text-white/80" />
            <p className="text-[10px] text-white/70">Net Savings</p>
          </div>
          <p className="text-xl font-bold text-white">₹1,968</p>
          <p className="text-[10px] text-white/80 mt-0.5">556% ROI</p>
        </div>
      </div>

      {/* Streak */}
      <div className="glass rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-warning" />
            <p className="text-sm font-semibold text-text-primary">7-Week Streak</p>
          </div>
          <p className="text-[10px] text-primary">+75 pts/week</p>
        </div>
        <div className="flex gap-1">
          {['W1','W2','W3','W4','W5','W6','W7','W8'].map((w, i) => (
            <div key={i} className={`flex-1 py-1.5 rounded-lg text-center text-[9px] font-bold ${i < 7 ? 'gradient-primary text-white' : 'bg-dark-surface text-text-muted border border-dashed border-dark-border'}`}>
              {i < 7 ? '✓' : w}
            </div>
          ))}
        </div>
      </div>

      {/* Collective Pool */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-accent" />
            <p className="text-sm font-semibold text-text-primary">Zone Pool</p>
          </div>
          <span className="text-[10px] text-accent font-medium">HSR-01</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-text-primary">34</p>
            <p className="text-[9px] text-text-muted">Members</p>
          </div>
          <div className="bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-accent">₹1,240</p>
            <p className="text-[9px] text-text-muted">Pool Balance</p>
          </div>
          <div className="bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-success">Strong</p>
            <p className="text-[9px] text-text-muted">Health</p>
          </div>
        </div>
        <p className="text-[10px] text-text-secondary mt-2">Your contribution: ₹10/week | Covers ~2 below-threshold events</p>
      </div>

      {/* Timeline */}
      <div className="glass rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Today's Activity</p>
          <button className="text-[10px] text-primary font-medium">See All</button>
        </div>
        <div className="space-y-2.5">
          {[
            { icon: CloudRain, color: 'primary', title: 'Rainfall Trigger', time: '12:10 PM', zone: 'HSR Layout', payout: 600, pts: 200 },
            { icon: Shield, color: 'accent', title: 'Policy Active', time: '11:45 AM', zone: 'Pro Shield', payout: null, pts: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl bg-${item.color}/20 flex items-center justify-center shrink-0`}>
                <item.icon size={14} className={`text-${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">{item.title}</p>
                <p className="text-[10px] text-text-secondary">{item.time} — {item.zone}</p>
              </div>
              {item.payout && (
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-success">+₹{item.payout}</p>
                  <p className="text-[10px] text-primary">+{item.pts}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// POLICY TAB
function PolicyTab({ autoRenew, setAutoRenew }) {
  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">My Policy</h2>

      {/* Certificate */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span className="text-xs font-bold text-primary">GIGSHIELD POLICY</span>
            </div>
            <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium">
              <Download size={10} /> PDF
            </button>
          </div>
          <div className="space-y-2">
            {[
              ['Policy ID', 'GS-2026-HSR-00342'],
              ['Holder', 'Ravi Kumar'],
              ['Zone', 'HSR Layout, Bangalore'],
              ['Plan', 'Pro Shield'],
              ['Coverage', '₹600/disruption day'],
              ['Valid', '10 Mar – 16 Mar 2026'],
              ['Premium', '₹103 (5% tier discount)'],
              ['Tier', 'Reliable'],
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-text-muted">{k}</span>
                <span className="text-text-primary">{v}</span>
              </div>
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

      {/* Risk Score */}
      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2.5">Zone Risk Assessment</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(45,37,80,1)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="url(#g1)" strokeWidth="3" strokeDasharray="74, 100" strokeLinecap="round" />
              <defs><linearGradient id="g1"><stop offset="0%" stopColor="#6C5CE7" /><stop offset="100%" stopColor="#00D2D3" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-text-primary">0.74</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-warning">Moderate-High Risk</p>
            <p className="text-[10px] text-text-secondary">90-day zone history</p>
            <p className="text-[10px] text-text-muted">Premium: +9%</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Rainfall', value: 72, color: '#6C5CE7' },
            { label: 'AQI', value: 58, color: '#FDCB6E' },
            { label: 'Flood Risk', value: 45, color: '#FF6B6B' },
            { label: 'Seasonal', value: 85, color: '#00D2D3' },
          ].map((r, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[9px] text-text-muted">{r.label}</span>
                <span className="text-[9px] text-text-secondary">{r.value}%</span>
              </div>
              <div className="h-1 rounded-full bg-dark-border overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Renew */}
      <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RefreshCw size={16} className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Auto-Renew</p>
            <p className="text-[10px] text-text-secondary">UPI mandate active</p>
          </div>
        </div>
        <button onClick={() => setAutoRenew(!autoRenew)}
                className={`w-11 h-6 rounded-full transition-all relative ${autoRenew ? 'bg-primary' : 'bg-dark-border'}`}>
          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-[3px] transition-all ${autoRenew ? 'right-[3px]' : 'left-[3px]'}`} style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Latest Claim */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Latest Claim</p>
          <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium">
            <Download size={10} /> EOB
          </button>
        </div>
        <div className="space-y-1.5">
          {[
            ['Claim ID', 'GS-CLM-0892'],
            ['Event', 'Heavy Rainfall'],
            ['Triggered', '12:10 PM, Mar 10'],
            ['Payout', '₹600'],
            ['Status', 'SETTLED'],
          ].map(([k, v], i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-text-muted">{k}</span>
              {k === 'Payout' ? <span className="text-success font-bold">{v}</span> :
               k === 'Status' ? <span className="px-1.5 py-0.5 bg-success/20 text-success rounded-full text-[9px] font-bold">{v}</span> :
               <span className="text-text-primary">{v}</span>}
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2 border-t border-dark-border space-y-1">
          <p className="text-[9px] text-text-muted mb-1">VALIDATION</p>
          {['GPS in zone (0.8 km)', 'Active (3 deliveries)', 'App logged in', 'No duplicate'].map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-success" />
              <span className="text-[10px] text-text-secondary">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// POINTS TAB
function PointsTab() {
  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">GigPoints</h2>

      <div className="relative overflow-hidden rounded-2xl gradient-primary p-4">
        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-white/10 blur-[30px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/70 text-[10px]">Total Balance</p>
            <p className="text-3xl font-black text-white mt-0.5">2,450</p>
            <p className="text-xs text-white/80 mt-0.5">Reliable Tier | 5% off</p>
          </div>
          <div className="w-16 h-16 rounded-full border-3 border-white/30 flex items-center justify-center bg-white/10" style={{ borderWidth: 3 }}>
            <span className="text-2xl">🥈</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/70 mb-1">
            <span>2,450 / 2,500 to Veteran</span>
            <span>98%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-[98%] bg-white rounded-full" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2.5">Tier Roadmap</p>
        <div className="space-y-2">
          {[
            { name: 'Starter', emoji: '🥉', min: 0, desc: 'Standard' },
            { name: 'Reliable', emoji: '🥈', min: 1000, desc: '5% discount', current: true },
            { name: 'Veteran', emoji: '🥇', min: 2500, desc: '10% + priority' },
            { name: 'Champion', emoji: '💎', min: 5000, desc: '15% + free week' },
          ].map((t, i) => (
            <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl ${t.current ? 'bg-primary/10 border border-primary/30' : ''}`}>
              <span className="text-base">{t.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className={`text-xs font-semibold ${t.current ? 'text-primary' : 'text-text-primary'}`}>{t.name}</p>
                  <span className="text-[9px] text-text-muted">{t.min.toLocaleString()}+ pts</span>
                </div>
                <p className="text-[9px] text-text-secondary">{t.desc}</p>
              </div>
              {t.current && <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 rounded-full bg-primary/10">YOU</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2.5">Recent Points</p>
        <div className="space-y-2">
          {[
            { action: 'Payout received', pts: 200, time: 'Today 12:11 PM' },
            { action: 'Active during disruption', pts: 100, time: 'Today 12:10 PM' },
            { action: 'Streak bonus (W7)', pts: 75, time: 'Sunday' },
            { action: 'Policy renewal', pts: 50, time: 'Sunday' },
            { action: 'Referral: Suresh M.', pts: 500, time: 'Last week' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <div>
                <p className="text-xs text-text-primary">{item.action}</p>
                <p className="text-[9px] text-text-muted">{item.time}</p>
              </div>
              <span className="text-xs font-bold text-primary">+{item.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus size={16} className="text-accent" />
          <p className="text-sm font-bold text-text-primary">Refer Partners</p>
        </div>
        <p className="text-[10px] text-text-secondary mb-2.5">Both get ₹50 off + you earn 500 pts</p>
        <div className="flex gap-2 mb-2.5">
          <div className="flex-1 bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-text-primary">3</p>
            <p className="text-[9px] text-text-muted">Referrals</p>
          </div>
          <div className="flex-1 bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-accent">20/34</p>
            <p className="text-[9px] text-text-muted">Zone Goal</p>
          </div>
        </div>
        <button className="w-full py-2 bg-accent/10 border border-accent/30 rounded-xl text-accent text-xs font-semibold">
          Share Referral Link
        </button>
      </div>
    </div>
  )
}

// HISTORY TAB
function HistoryTab() {
  const lifetimeData = [
    { month: 'Jan', premiums: 400, payouts: 0 },
    { month: 'Feb', premiums: 400, payouts: 0 },
    { month: 'Mar', premiums: 400, payouts: 1800 },
  ]

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">Protection History</h2>

      {/* Savings */}
      <div className="glass rounded-2xl p-4">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">Lifetime Savings</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-text-muted">Premiums Paid</p>
            <p className="text-base font-bold text-text-primary">₹432</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted">Payouts Received</p>
            <p className="text-base font-bold text-success">₹2,400</p>
          </div>
        </div>
        <div className="border-t border-dark-border pt-2.5">
          <div className="flex justify-between">
            <p className="text-sm text-text-secondary">Net Savings</p>
            <p className="text-xl font-black text-gradient">₹1,968</p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[10px] text-text-muted">Return on Protection</p>
            <p className="text-sm font-bold text-success">556%</p>
          </div>
          <p className="text-[9px] text-text-muted mt-1.5 italic">Every ₹1 paid → ₹5.56 back</p>
        </div>
      </div>

      {/* Lifetime Chart */}
      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Lifetime Protection Graph</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={lifetimeData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.5)" />
            <XAxis dataKey="month" tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} />
            <YAxis tick={{ fill: '#7C72A0', fontSize: 9 }} axisLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="premiums" fill="#6C5CE7" radius={[4, 4, 0, 0]} name="Premiums" barSize={16} />
            <Bar dataKey="payouts" fill="#00B894" radius={[4, 4, 0, 0]} name="Payouts" barSize={16} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-1.5">
          <span className="flex items-center gap-1 text-[9px] text-text-secondary"><span className="w-2 h-2 rounded-sm bg-primary" /> Premiums</span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary"><span className="w-2 h-2 rounded-sm bg-success" /> Payouts</span>
        </div>
      </div>

      {/* This Week */}
      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">This Week</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-base font-bold text-text-primary">₹1,200</p>
            <p className="text-[9px] text-text-muted">Protected</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-primary">725</p>
            <p className="text-[9px] text-text-muted">Points</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-accent">2</p>
            <p className="text-[9px] text-text-muted">Triggers</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2.5">Timeline</p>
        <div className="space-y-3">
          <p className="text-[9px] font-semibold text-text-muted">TODAY</p>
          {[
            { icon: CloudRain, bg: 'bg-primary/20', ic: 'text-primary', title: 'Rainfall Trigger', sub: 'HSR Layout — 19mm/hr', time: '12:10 PM', pay: '+₹600', pts: '+200' },
          ].map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${e.bg} flex items-center justify-center shrink-0`}>
                <e.icon size={14} className={e.ic} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">{e.title}</p>
                <p className="text-[10px] text-text-secondary">{e.sub}</p>
                <p className="text-[9px] text-text-muted">{e.time}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-success">{e.pay}</p>
                <p className="text-[10px] text-primary">{e.pts}</p>
              </div>
            </div>
          ))}
          <p className="text-[9px] font-semibold text-text-muted pt-1">YESTERDAY</p>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
              <Wind size={14} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-primary">AQI Trigger</p>
              <p className="text-[10px] text-text-secondary">HSR Layout — AQI 320</p>
              <p className="text-[9px] text-text-muted">3:20 PM</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-success">+₹600</p>
              <p className="text-[10px] text-primary">+200</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone History */}
      <div className="glass rounded-2xl p-3.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Zone: HSR — 30 Days</p>
        <div className="space-y-2">
          {[
            { date: 'Mar 10', event: 'Rain (19mm/hr)', hours: 4, workers: 34, total: '₹20,400' },
            { date: 'Mar 08', event: 'AQI 320', hours: 2, workers: 31, total: '₹18,600' },
            { date: 'Mar 03', event: 'Store Closure', hours: 3, workers: 28, total: '₹16,800' },
            { date: 'Feb 28', event: 'Heat (44°C)', hours: 6, workers: 40, total: '₹24,000' },
          ].map((z, i) => (
            <div key={i} className="p-2 rounded-xl bg-dark-surface">
              <p className="text-[10px] font-bold text-text-primary mb-0.5">{z.date} — {z.event}</p>
              <div className="flex gap-2 text-[9px] text-text-muted">
                <span>{z.hours}h</span><span>|</span>
                <span>{z.workers} workers</span><span>|</span>
                <span className="text-success">{z.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// PROFILE TAB
function ProfileTab({ onBack }) {
  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">Profile</h2>

      <div className="glass rounded-2xl p-4 text-center">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-bold text-white">R</span>
        </div>
        <h3 className="text-base font-bold text-text-primary">Ravi Kumar</h3>
        <p className="text-xs text-text-secondary">Zepto | HSR Layout</p>
        <p className="text-[10px] text-primary font-semibold mt-1">Reliable Tier | 2,450 pts</p>
      </div>

      <div className="glass rounded-2xl p-3.5 space-y-2">
        {[
          ['Mobile', '+91 98765 43210'],
          ['Platform', 'Zepto'],
          ['Zone', 'HSR-01, Bangalore'],
          ['Shift', 'Full Day (10 hrs)'],
          ['Member Since', 'Jan 2026'],
          ['UPI', 'ravi@okicici'],
        ].map(([k, v], i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-text-muted">{k}</span>
            <span className="text-text-primary">{v}</span>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-3 space-y-2">
        {[
          { label: 'Notifications', icon: Bell },
          { label: 'Payment Methods', icon: IndianRupee },
          { label: 'Language / भाषा', icon: Settings },
          { label: 'Help & Support', icon: Info },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between py-1.5 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2.5">
              <item.icon size={14} className="text-text-muted" />
              <span className="text-xs text-text-primary">{item.label}</span>
            </div>
            <ChevronRight size={12} className="text-text-muted" />
          </button>
        ))}
      </div>

      <button onClick={onBack} className="w-full py-2.5 bg-dark-card border border-dark-border rounded-2xl text-text-secondary font-medium text-xs">
        Back to Landing Page
      </button>
    </div>
  )
}
