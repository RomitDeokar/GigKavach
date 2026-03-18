import { useState, useEffect } from 'react'
import { Shield, Smartphone, BarChart3, Zap, ChevronRight, ArrowRight, CloudRain, Wind, Thermometer, AlertTriangle, Star, Users, Clock, IndianRupee, TrendingUp, CheckCircle2, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const stats = [
  { label: 'Avg Payout Time', value: '<60s', icon: Clock },
  { label: 'Workers Protected', value: '10,000+', icon: Users },
  { label: 'Claims Auto-Processed', value: '98%', icon: Zap },
  { label: 'Avg ROI for Workers', value: '556%', icon: TrendingUp },
]

const triggers = [
  { icon: CloudRain, label: 'Heavy Rain', threshold: '>15 mm/hr', color: '#6C5CE7' },
  { icon: Thermometer, label: 'Extreme Heat', threshold: '>43°C', color: '#FF6B6B' },
  { icon: Wind, label: 'Severe AQI', threshold: '>300 AQI', color: '#FDCB6E' },
  { icon: AlertTriangle, label: 'Flash Flood', threshold: 'IMD Alert', color: '#00D2D3' },
]

const howItWorks = [
  { step: '01', title: 'Register & Get Zoned', desc: 'Sign up with your mobile, pick your platform. We auto-detect your dark store zone.' },
  { step: '02', title: 'Choose Your Shield', desc: 'Pick Basic, Pro, or Elite. See your AI-adjusted premium transparently before paying.' },
  { step: '03', title: 'Stay Protected', desc: 'We monitor your zone 24/7. Get alerts when conditions approach trigger thresholds.' },
  { step: '04', title: 'Auto Payout', desc: 'Trigger breached? Fraud checks pass? Money in your UPI in under 60 seconds. Zero paperwork.' },
]

export default function LandingPage({ onNavigate }) {
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % triggers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" 
             style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]"
             style={{ transform: `translateY(${-scrollY * 0.08}px)` }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-danger/3 blur-[100px]"
             style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">GigShield</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#triggers" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Triggers</a>
            <a href="#plans" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Plans</a>
            <button onClick={() => onNavigate('admin')} className="text-sm text-text-secondary hover:text-text-primary transition-colors">Admin Portal</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center hover:border-primary/30 transition-all" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDark ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-text-secondary" />}
            </button>
            <button onClick={() => onNavigate('admin')} className="hidden md:block px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-xl hover:bg-primary/10 transition-all">
              Insurer Login
            </button>
            <button onClick={() => onNavigate('worker')} className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25">
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap size={14} />
              Parametric Insurance for India's Gig Economy
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-text-primary">Your Income.</span><br />
              <span className="text-gradient">Auto-Protected.</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              Rain shuts down your zone? AQI spikes? Dark store closes? GigShield detects it in real-time and pays you in under 60 seconds. No claims. No paperwork. No waiting.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => onNavigate('worker')} className="group flex items-center gap-2 px-8 py-4 gradient-primary rounded-2xl text-white font-semibold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all">
                Get Protected Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-8 py-4 bg-dark-card border border-dark-border rounded-2xl text-text-primary font-semibold text-lg hover:border-primary/30 transition-all">
                <BarChart3 size={20} />
                Insurer Dashboard
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {['R', 'P', 'A', 'M', 'S'].map((l, i) => (
                  <div key={i} className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold border-2 border-dark"
                       style={{ opacity: 1 - i * 0.1 }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FDCB6E" className="text-warning" />)}
                </div>
                <p className="text-sm text-text-secondary">Trusted by 10,000+ delivery partners</p>
              </div>
            </div>
          </div>

          {/* Hero Phone Preview */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[60px] opacity-20" />
              <div className="phone-frame bg-dark relative z-10">
                <div className="phone-notch" />
                <div className="h-full bg-dark overflow-y-auto pt-10 pb-6 px-5">
                  {/* Mini dashboard preview */}
                  <div className="mt-4 mb-6">
                    <p className="text-text-secondary text-sm">Good afternoon,</p>
                    <h2 className="text-2xl font-bold text-text-primary">Ravi Kumar</h2>
                  </div>
                  
                  {/* Zone Status */}
                  <div className="bg-success/10 border border-success/30 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                        <div>
                          <p className="text-sm font-semibold text-success">ZONE SAFE</p>
                          <p className="text-xs text-text-secondary">HSR Layout, Bangalore</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted">Rainfall</p>
                        <p className="text-sm font-bold text-text-primary">3mm/hr</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Policy */}
                  <div className="glass rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-text-muted uppercase tracking-wider">Active Policy</p>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">Pro Shield</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-text-primary">₹600</span>
                      <span className="text-sm text-text-secondary">/disruption day</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-dark-border overflow-hidden">
                      <div className="h-full w-[70%] gradient-primary rounded-full" />
                    </div>
                    <p className="text-xs text-text-muted mt-1">5 days remaining</p>
                  </div>

                  {/* GigPoints */}
                  <div className="glass rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-text-muted">GigPoints</p>
                        <p className="text-2xl font-bold text-gradient">2,450</p>
                        <p className="text-xs text-text-secondary">Reliable Tier</p>
                      </div>
                      <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center">
                        <span className="text-lg">🥈</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="gradient-success rounded-2xl p-4 mb-4">
                    <p className="text-xs text-white/70">Lifetime Net Savings</p>
                    <p className="text-3xl font-bold text-white mt-1">₹1,968</p>
                    <p className="text-sm text-white/80 mt-1">556% Return on Protection</p>
                  </div>

                  {/* Recent Timeline */}
                  <div className="glass rounded-2xl p-4">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Protection Timeline</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <CloudRain size={14} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">Rainfall Trigger</p>
                          <p className="text-xs text-text-secondary">12:10 PM — HSR Layout</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-success">+₹600</p>
                          <p className="text-xs text-primary">+200 pts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                          <Wind size={14} className="text-warning" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">AQI Trigger</p>
                          <p className="text-xs text-text-secondary">Yesterday — 3:20 PM</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-success">+₹600</p>
                          <p className="text-xs text-primary">+200 pts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative py-8 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={24} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-text-primary">
              Protected in <span className="text-gradient">4 Simple Steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="group relative glass rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl font-black text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <ChevronRight size={20} className="hidden lg:block absolute right-[-18px] top-1/2 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Triggers Section */}
      <section id="triggers" className="relative py-24 bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Parametric Triggers</p>
              <h2 className="text-4xl font-bold text-text-primary mb-6">
                We Watch. We Detect.<br /><span className="text-gradient">We Pay. Instantly.</span>
              </h2>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Our AI monitors your micro-zone every 5 minutes using live weather, AQI, and platform data. When a threshold is breached and sustained for 10 minutes, your payout fires automatically.
              </p>
              <div className="space-y-4">
                {triggers.map((t, i) => (
                  <div key={i} 
                       className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 cursor-pointer ${
                         activeFeature === i 
                           ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10' 
                           : 'bg-dark-card/50 border-dark-border hover:border-dark-border/80'
                       }`}
                       onClick={() => setActiveFeature(i)}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${t.color}20` }}>
                      <t.icon size={24} style={{ color: t.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary">{t.label}</p>
                      <p className="text-sm text-text-secondary">Threshold: {t.threshold}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${activeFeature === i ? 'bg-primary' : 'bg-dark-border'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 blur-[40px]" />
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30">
                    {(() => {
                      const Icon = triggers[activeFeature].icon
                      return <Icon size={36} className="text-white" />
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">{triggers[activeFeature].label}</h3>
                  <p className="text-text-secondary mt-1">Threshold: {triggers[activeFeature].threshold}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/50">
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="text-sm text-text-secondary">Threshold breached in your zone</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/50">
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="text-sm text-text-secondary">10-minute sustained breach confirmed</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/50">
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="text-sm text-text-secondary">GPS + activity fraud check passed</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/50">
                    <Zap size={18} className="text-warning" />
                    <span className="text-sm text-text-primary font-semibold">Payout sent to UPI in &lt;60 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Weekly Plans</p>
            <h2 className="text-4xl font-bold text-text-primary">
              Choose Your <span className="text-gradient">Shield Level</span>
            </h2>
            <p className="text-text-secondary mt-4 max-w-lg mx-auto">Weekly premiums that match your weekly payout cycle. AI-adjusted based on your zone's real risk score.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Basic Shield', price: '49', payout: '300', hours: '6', popular: false },
              { name: 'Pro Shield', price: '99', payout: '600', hours: '10', popular: true },
              { name: 'Elite Shield', price: '149', payout: '1,000', hours: '14', popular: false },
            ].map((plan, i) => (
              <div key={i} className={`relative glass rounded-3xl p-6 ${plan.popular ? 'border-primary/50 shadow-xl shadow-primary/10 scale-[1.02]' : ''} hover:-translate-y-2 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-primary rounded-full text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-text-primary mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-text-primary">₹{plan.price}</span>
                  <span className="text-text-secondary">/week</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">₹{plan.payout} per disruption day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">{plan.hours} hrs/day coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">All 6 trigger types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">Instant UPI payout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">GigPoints rewards</span>
                  </div>
                </div>
                <button onClick={() => onNavigate('worker')} 
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          plan.popular 
                            ? 'gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50' 
                            : 'bg-dark-surface border border-dark-border text-text-primary hover:border-primary/30'
                        }`}>
                  Get {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                Don't Lose Another Day of Income
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
                Join 10,000+ delivery partners who never worry about weather disruptions. Start your protection for as low as ₹49/week.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => onNavigate('worker')} className="group flex items-center gap-2 px-8 py-4 gradient-primary rounded-2xl text-white font-semibold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all">
                  <Smartphone size={20} />
                  Open Worker App
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-8 py-4 bg-dark-card border border-dark-border rounded-2xl text-text-primary font-semibold text-lg hover:border-primary/30 transition-all">
                  <BarChart3 size={20} />
                  Insurer Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-text-primary">GigShield</span>
            <span className="text-text-muted text-sm">| Guidewire DEVTrails 2026</span>
          </div>
          <p className="text-sm text-text-muted">Built by Team SRM — Rian, Romit, Saidhiraj, Pragalbh, Manmohan</p>
        </div>
      </footer>
    </div>
  )
}
