import { useState, useEffect } from 'react'
import { Shield, Zap, ChevronRight, ArrowRight, CloudRain, Wind, Thermometer, AlertTriangle, Star, Users, Clock, IndianRupee, TrendingUp, CheckCircle2, BarChart3, Lock, Wifi, ChevronDown, Smartphone, Globe, Activity, Moon, Sun, MapPin, Award, HeartPulse, FileText, MessageCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const stats = [
  { label: 'Avg Payout Time', value: '<60s', icon: Clock },
  { label: 'Workers Protected', value: '10,000+', icon: Users },
  { label: 'Claims Auto-Processed', value: '98%', icon: Zap },
  { label: 'Avg ROI for Workers', value: '556%', icon: TrendingUp },
]

const triggers = [
  { icon: CloudRain, label: 'Heavy Rain', threshold: '>15 mm/hr', desc: 'Automatic detection when rainfall exceeds safe delivery limits' },
  { icon: Thermometer, label: 'Extreme Heat', threshold: '>43\u00b0C', desc: 'Heat wave protection for outdoor delivery workers' },
  { icon: Wind, label: 'Severe AQI', threshold: '>300 AQI', desc: 'Air quality monitoring for health-risk conditions' },
  { icon: AlertTriangle, label: 'Flash Flood', threshold: 'IMD Alert', desc: 'Government alert integration for flood warnings' },
  { icon: Lock, label: 'Dark Store Closure', threshold: 'Platform Signal', desc: 'When your assigned store shuts down due to any disruption' },
  { icon: Wifi, label: 'Local Curfew', threshold: 'Govt Alert', desc: 'Government-imposed movement restrictions in your zone' },
]

const howItWorks = [
  { step: '01', title: 'Register & Get Zoned', desc: 'Sign up with your mobile, pick your platform. We auto-detect your dark store zone using GPS.', time: '2 min', icon: MapPin },
  { step: '02', title: 'Choose Your Shield', desc: 'Pick Basic, Pro, or Elite plan. See your AI-adjusted premium transparently before paying.', time: '1 min', icon: Shield },
  { step: '03', title: 'Stay Protected 24/7', desc: 'We monitor your zone with real-time weather, AQI, and traffic data. Get alerts when conditions approach triggers.', time: 'Always on', icon: Activity },
  { step: '04', title: 'Instant Auto Payout', desc: 'Trigger breached? 4 fraud checks pass automatically. Money in your UPI in under 60 seconds. Zero paperwork.', time: '<60 sec', icon: Zap },
]

const features = [
  { icon: Award, title: 'GigPoints Loyalty', desc: 'Earn points on every policy, every payout. Unlock premium discounts up to 15%.' },
  { icon: TrendingUp, title: 'Premium Forecast', desc: '7-day forward pricing. Buy when rates are low, like airline ticket tracking.' },
  { icon: MessageCircle, title: 'GigBot AI', desc: 'Hindi + English chatbot explains claims, policies, and points instantly.' },
  { icon: Users, title: 'Collective Pool', desc: 'Zone community fund covers borderline situations below trigger threshold.' },
  { icon: HeartPulse, title: 'Emergency SOS', desc: 'One-tap emergency contact for accidents or health issues on the road.' },
  { icon: FileText, title: 'Policy Certificate', desc: 'Downloadable PDF proof of coverage. Sharable with family or zone-mates.' },
]

export default function LandingPage({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(0)
  const [activeFaq, setActiveFaq] = useState(null)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % howItWorks.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-themed min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b" style={{ background: isDark ? 'rgba(23,18,15,0.94)' : 'rgba(251,247,241,0.94)', borderColor: isDark ? 'rgba(58,48,40,0.6)' : 'rgba(217,204,187,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)' }}>
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">GigShield</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-text-muted hover:text-text-primary transition-colors">How It Works</a>
            <a href="#triggers" className="text-sm text-text-muted hover:text-text-primary transition-colors">Triggers</a>
            <a href="#plans" className="text-sm text-text-muted hover:text-text-primary transition-colors">Plans</a>
            <a href="#features" className="text-sm text-text-muted hover:text-text-primary transition-colors">Features</a>
            <button onClick={() => onNavigate('admin')} className="text-sm text-text-muted hover:text-text-primary transition-colors">Admin Portal</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center hover:border-primary/30 transition-all" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDark ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-text-secondary" />}
            </button>
            <button onClick={() => onNavigate('admin')} className="hidden md:block px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Insurer Login
            </button>
            <button onClick={() => onNavigate('worker')} className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-all shadow-sm" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', boxShadow: '0 4px 15px rgba(164,91,51,0.25)' }}>
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-20 right-[20%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'rgba(164,91,51,0.08)' }} />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(164,91,51,0.06)' }} />
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(164,91,51,0.12)', border: '1px solid rgba(164,91,51,0.25)', color: '#a45b33' }}>
                <Zap size={14} />
                Parametric Insurance for India's Gig Economy
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-text-primary">
                Your Income.{' '}
                <span style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Auto-Protected.</span>
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
                Rain shuts down your zone? AQI spikes? Dark store closes? GigShield detects it in real-time and pays you in under 60 seconds. No claims. No paperwork. No waiting.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => onNavigate('worker')} className="group flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', boxShadow: '0 8px 25px rgba(164,91,51,0.3)' }}>
                  Get Protected Now
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-6 py-3.5 bg-dark-card border border-dark-border rounded-xl text-text-primary font-semibold text-sm hover:border-primary/30 transition-all">
                  <BarChart3 size={16} />
                  Insurer Dashboard
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['R', 'P', 'A', 'M', 'S'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2" style={{ background: `linear-gradient(135deg, #a45b33, #d49a59)`, borderColor: isDark ? '#17120f' : '#fbf7f1' }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#a45b33" className="text-[#a45b33]" />)}
                  </div>
                  <p className="text-xs text-text-muted">Trusted by 10,000+ delivery partners</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-[60px] blur-[80px] scale-110" style={{ background: 'rgba(164,91,51,0.1)' }} />
                <PhoneMockup isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y" style={{ borderColor: isDark ? 'rgba(58,48,40,0.6)' : 'rgba(217,204,187,0.6)', background: isDark ? 'rgba(43,35,29,0.5)' : 'rgba(239,230,218,0.5)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(164,91,51,0.1)' }}>
                  <stat.icon size={18} style={{ color: '#a45b33' }} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#a45b33' }}>How It Works</p>
            <h2 className="text-3xl font-bold text-text-primary">Protected in 4 simple steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <button key={i}
                   onClick={() => setActiveStep(i)}
                   className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                     activeStep === i 
                       ? 'shadow-lg' 
                       : 'bg-dark-card border-dark-border hover:border-dark-border/80'
                   }`}
                   style={activeStep === i ? { borderColor: 'rgba(164,91,51,0.35)', background: isDark ? 'rgba(164,91,51,0.06)' : 'rgba(164,91,51,0.04)', boxShadow: '0 8px 30px rgba(164,91,51,0.08)' } : {}}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-4 transition-colors ${
                  activeStep === i ? 'text-white' : 'bg-dark-surface text-text-muted'
                }`} style={activeStep === i ? { background: 'linear-gradient(135deg, #a45b33, #d49a59)' } : {}}>
                  {activeStep === i ? <step.icon size={18} /> : step.step}
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
                  activeStep === i ? '' : 'text-text-muted'
                }`} style={activeStep === i ? { color: '#a45b33' } : {}}>
                  <Clock size={12} />
                  {step.time}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Triggers */}
      <section id="triggers" className="py-20" style={{ background: isDark ? 'rgba(43,35,29,0.3)' : 'rgba(239,230,218,0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#a45b33' }}>What We Cover</p>
            <h2 className="text-3xl font-bold text-text-primary">6 parametric triggers, zero manual claims</h2>
            <p className="text-text-muted mt-3 max-w-lg mx-auto">When conditions breach thresholds, payouts happen automatically. No forms, no waiting, no ambiguity.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {triggers.map((trigger, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-dark-card rounded-2xl border border-dark-border/60 hover:border-[#a45b33]/25 transition-all group cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:scale-105" style={{ background: 'rgba(164,91,51,0.1)' }}>
                  <trigger.icon size={18} style={{ color: '#a45b33' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-primary">{trigger.label}</h3>
                    <span className="px-2 py-0.5 bg-dark-surface rounded-full text-xs text-text-muted font-medium">{trigger.threshold}</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{trigger.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#a45b33' }}>Pricing</p>
            <h2 className="text-3xl font-bold text-text-primary">Weekly plans that fit gig budgets</h2>
            <p className="text-text-muted mt-3">No long-term lock-ins. Pay weekly, stay flexible. AI adjusts your premium based on zone risk.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Basic Shield', price: 49, payout: 300, hours: 6, features: ['All 6 triggers', 'UPI payout <60s', 'GigPoints rewards', 'GigBot support'] },
              { name: 'Pro Shield', price: 99, payout: 600, hours: 10, popular: true, features: ['All 6 triggers', 'UPI payout <60s', 'GigPoints rewards', 'Premium forecast alerts', 'Smart reminders', 'Collective Pool access'] },
              { name: 'Elite Shield', price: 149, payout: 1000, hours: 14, features: ['All 6 triggers', 'Priority UPI payout', 'GigPoints 2x multiplier', 'Premium forecast alerts', 'Dedicated support', 'Free week/quarter'] },
            ].map((plan, i) => (
              <div key={i} className={`relative p-6 rounded-2xl border transition-all ${
                plan.popular 
                  ? 'shadow-lg' 
                  : 'border-dark-border bg-dark-card'
              }`} style={plan.popular ? { borderColor: 'rgba(164,91,51,0.35)', background: isDark ? 'rgba(164,91,51,0.05)' : 'rgba(164,91,51,0.03)', boxShadow: '0 8px 30px rgba(164,91,51,0.1)' } : {}}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', boxShadow: '0 4px 12px rgba(164,91,51,0.25)' }}>Most Popular</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
                <p className="text-sm text-text-muted mt-1">Up to {plan.hours} hrs/day coverage</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-text-primary">{'\u20b9'}{plan.price}</span>
                  <span className="text-sm text-text-muted">/week</span>
                  <p className="text-sm font-medium mt-1" style={{ color: '#bc8750' }}>{'\u20b9'}{plan.payout}/disruption payout</p>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 size={14} className="shrink-0" style={{ color: '#a45b33' }} />
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => onNavigate('worker')}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          plan.popular 
                            ? 'text-white hover:opacity-90' 
                            : 'bg-dark-surface text-text-primary border border-dark-border hover:border-[#a45b33]/30'
                        }`}
                        style={plan.popular ? { background: 'linear-gradient(135deg, #a45b33, #d49a59)', boxShadow: '0 4px 15px rgba(164,91,51,0.2)' } : {}}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20" style={{ background: isDark ? 'rgba(43,35,29,0.3)' : 'rgba(239,230,218,0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#a45b33' }}>Features</p>
            <h2 className="text-3xl font-bold text-text-primary">More than just insurance</h2>
            <p className="text-text-muted mt-3">GigShield transforms passive insurance into an active rewards experience.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((feat, i) => (
              <div key={i} className="p-5 bg-dark-card rounded-2xl border border-dark-border/60 hover:border-[#a45b33]/20 transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(164,91,51,0.1)' }}>
                  <feat.icon size={18} style={{ color: '#a45b33' }} />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{feat.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary">Common questions</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: 'What is parametric insurance?', a: 'Unlike traditional insurance where you file a claim and wait, parametric insurance pays you automatically when a pre-defined trigger condition is met (e.g., rainfall >15mm/hr). No paperwork, no adjuster, no delays.' },
              { q: 'How fast are payouts?', a: 'Under 60 seconds. When a trigger is detected, our system runs 4 automated fraud checks (GPS, activity, session, duplicate) and sends money directly to your UPI if all pass.' },
              { q: 'What if I\'m not working when a trigger happens?', a: 'Our 4-layer fraud detection verifies you were actively working in the zone during the disruption. GPS location, delivery activity, app session, and duplicate claim checks all must pass.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Weekly plans with no lock-in. Simply don\'t renew the next week. Your GigPoints and tier status are preserved for 30 days.' },
              { q: 'How is this different from regular health/accident insurance?', a: 'GigShield strictly covers income loss from external disruptions (weather, AQI, store closures). We do NOT cover health, accidents, or vehicle damage. This is complementary coverage for the earnings you lose when you can\'t work.' },
              { q: 'What is the Collective Pool?', a: 'A zone-level community fund where workers contribute \u20b910/week. It covers borderline situations where the trigger didn\'t formally fire but workers still lost income. Disbursement requires >50% member vote.' },
              { q: 'How do GigPoints work?', a: 'Earn points on every policy purchase (+50), payout received (+200), active during disruption (+100), and streak renewals (+75/week). Points unlock premium discounts: 5% at 1,000 pts, 10% at 2,500, 15% at 5,000+.' },
            ].map((faq, i) => (
              <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: isDark ? 'rgba(58,48,40,0.6)' : 'rgba(217,204,187,0.6)' }}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-surface/30 transition-colors"
                >
                  <span className="text-sm font-medium text-text-primary pr-4">{faq.q}</span>
                  <ChevronDown size={16} className={`text-text-muted transition-transform shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4 slide-up">
                    <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: isDark ? 'rgba(43,35,29,0.3)' : 'rgba(239,230,218,0.5)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', boxShadow: '0 8px 30px rgba(164,91,51,0.3)' }}>
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">Stop losing income to bad weather</h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">Join 10,000+ delivery partners who never worry about rain days again. Start protection in under 3 minutes.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => onNavigate('worker')} className="group flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', boxShadow: '0 8px 25px rgba(164,91,51,0.3)' }}>
              Open Worker App
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-8 py-3.5 border border-dark-border rounded-xl text-text-secondary font-semibold text-sm hover:border-[#a45b33]/30 transition-all">
              <BarChart3 size={16} />
              Insurer Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: isDark ? 'rgba(58,48,40,0.6)' : 'rgba(217,204,187,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)' }}>
              <Shield size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">GigShield</span>
            <span className="text-xs text-text-muted">| Guidewire DEVTrails 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('worker')} className="text-xs text-text-muted hover:text-text-primary transition-colors">Worker App</button>
            <button onClick={() => onNavigate('admin')} className="text-xs text-text-muted hover:text-text-primary transition-colors">Admin Dashboard</button>
            <a href="#triggers" className="text-xs text-text-muted hover:text-text-primary transition-colors">Triggers</a>
            <a href="#plans" className="text-xs text-text-muted hover:text-text-primary transition-colors">Plans</a>
          </div>
          <p className="text-xs text-text-muted">Built by Team SRM &mdash; Rian, Romit, Saidhiraj, Pragalbh, Manmohan</p>
        </div>
      </footer>
    </div>
  )
}


// Phone Mockup with orangish accent
function PhoneMockup({ isDark }) {
  return (
    <div className="w-[320px] rounded-[36px] border-2 overflow-hidden shadow-2xl relative landing-phone-frame" style={{ borderColor: isDark ? 'rgba(58,48,40,0.8)' : '#3a3028', background: isDark ? '#17120f' : '#fbf7f1', boxShadow: isDark ? '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(164,91,51,0.12)' : '0 25px 80px rgba(83,59,34,0.12), 0 0 60px rgba(164,91,51,0.08)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-black rounded-b-2xl z-10" />
      
      <div className="p-5 pt-10 pb-6 space-y-3.5">
        <div>
          <p className="text-text-muted text-[11px]">Good afternoon,</p>
          <h2 className="text-[20px] font-bold text-text-primary tracking-tight">Ravi Kumar</h2>
        </div>

        <div className="rounded-xl p-3" style={{ background: 'rgba(188,135,80,0.1)', border: '1px solid rgba(188,135,80,0.25)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-40" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-success tracking-wide">ZONE SAFE</p>
                <p className="text-[9px] text-text-muted">HSR Layout, Bangalore</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-text-muted">Rainfall</p>
              <p className="text-[12px] font-bold text-text-primary">3mm/hr</p>
            </div>
          </div>
        </div>

        <div className="card-insurance rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-[40px]" style={{ background: 'rgba(164,91,51,0.06)' }} />
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Active Policy</p>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold text-white" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)' }}>Pro Shield</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-[22px] font-bold text-text-primary tracking-tight">{'\u20b9'}600</span>
            <span className="text-[10px] text-text-muted">/disruption day</span>
          </div>
          <div className="h-[4px] rounded-full bg-dark-border/60 overflow-hidden mb-1">
            <div className="h-full w-[71%] rounded-full" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)' }} />
          </div>
          <p className="text-[9px] text-text-muted">5 days remaining</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="card-insurance rounded-xl p-3">
            <p className="text-[9px] text-text-muted mb-1">GigPoints</p>
            <p className="text-[18px] font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, #a45b33, #d49a59)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2,450</p>
            <p className="text-[9px] text-text-muted mt-0.5">Reliable Tier</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #bc8750, #d8b086)' }}>
            <p className="text-[9px] text-white/60 mb-1">Net Savings</p>
            <p className="text-[18px] font-bold text-white tracking-tight">{'\u20b9'}1,968</p>
            <p className="text-[9px] text-white/70 mt-0.5">556% ROI</p>
          </div>
        </div>

        <div className="card-insurance rounded-xl p-3">
          <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider mb-2">Protection Timeline</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(164,91,51,0.12)' }}>
                <CloudRain size={13} style={{ color: '#a45b33' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-text-primary">Rainfall Trigger</p>
                <p className="text-[9px] text-text-muted">12:10 PM &mdash; HSR Layout</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-success">+{'\u20b9'}600</p>
                <p className="text-[8px]" style={{ color: '#a45b33' }}>+200 pts</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center">
                <Wind size={13} className="text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-text-primary">AQI Trigger</p>
                <p className="text-[9px] text-text-muted">Yesterday &mdash; 3:20 PM</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-success">+{'\u20b9'}600</p>
                <p className="text-[8px]" style={{ color: '#a45b33' }}>+200 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
