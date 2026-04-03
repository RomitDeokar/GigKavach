import { useState, useEffect, useRef, useCallback } from 'react'
import { Shield, ArrowLeft, Map, Activity, BarChart3, AlertTriangle, Sliders, Award, Users, Clock, TrendingUp, TrendingDown, IndianRupee, CloudRain, Wind, Thermometer, CheckCircle2, XCircle, MapPin, Zap, ChevronRight, ChevronDown, Bell, Search, Filter, RefreshCw, Eye, Download, Calendar, Globe, Layers, Target, PieChart, Flame, ShieldAlert, Fingerprint, Network, Radio, Wifi, Moon, Sun, Loader2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts'
import { api } from '../lib/api'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'map', label: 'Risk Map', icon: Map },
  { id: 'live', label: 'Live Feed', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'fraud', label: 'Fraud Console', icon: AlertTriangle },
  { id: 'antispoofing', label: 'Anti-Spoofing', icon: ShieldAlert },
  { id: 'simulator', label: 'Risk Simulator', icon: Sliders },
  { id: 'forecast', label: '7-Day Forecast', icon: Calendar },
  { id: 'loyalty', label: 'Loyalty Monitor', icon: Award },
]

const weeklyPayouts = [
  { week: 'W1', payouts: 12000, premiums: 48000 },
  { week: 'W2', payouts: 8000, premiums: 50000 },
  { week: 'W3', payouts: 35000, premiums: 52000 },
  { week: 'W4', payouts: 22000, premiums: 55000 },
  { week: 'W5', payouts: 45000, premiums: 58000 },
  { week: 'W6', payouts: 18000, premiums: 60000 },
  { week: 'W7', payouts: 28000, premiums: 62000 },
  { week: 'W8', payouts: 42000, premiums: 65000 },
]

const zones = [
  { name: 'HSR Layout', id: 'HSR-01', risk: 0.74, workers: 34, status: 'safe', rainfall: 3, aqi: 142, temp: 32, lat: 12.9116, lng: 77.6389 },
  { name: 'Koramangala', id: 'KOR-02', risk: 0.68, workers: 28, status: 'watch', rainfall: 12, aqi: 180, temp: 33, lat: 12.9352, lng: 77.6245 },
  { name: 'Indiranagar', id: 'IND-03', risk: 0.45, workers: 22, status: 'safe', rainfall: 1, aqi: 120, temp: 31, lat: 12.9784, lng: 77.6408 },
  { name: 'Whitefield', id: 'WF-04', risk: 0.22, workers: 18, status: 'safe', rainfall: 0, aqi: 95, temp: 30, lat: 12.9698, lng: 77.7500 },
  { name: 'BTM Layout', id: 'BTM-05', risk: 0.81, workers: 40, status: 'disrupted', rainfall: 22, aqi: 210, temp: 29, lat: 12.9166, lng: 77.6101 },
]

const liveFeed = [
  { time: '12:11 PM', zone: 'HSR-01', event: 'Rainfall 19mm/hr', claims: 34, payout: '₹20,400', status: 'auto-approved', type: 'rain' },
  { time: '12:10 PM', zone: 'HSR-01', event: 'Trigger breach detected', claims: null, payout: null, status: 'monitoring', type: 'alert' },
  { time: '11:45 AM', zone: 'BTM-05', event: 'Rainfall 22mm/hr', claims: 40, payout: '₹24,000', status: 'auto-approved', type: 'rain' },
  { time: '11:30 AM', zone: 'KOR-02', event: 'AQI approaching 300', claims: null, payout: null, status: 'watch', type: 'aqi' },
  { time: '10:15 AM', zone: 'BTM-05', event: 'Dark Store Closure', claims: 38, payout: '₹22,800', status: 'auto-approved', type: 'store' },
  { time: '09:00 AM', zone: 'IND-03', event: 'System health check', claims: null, payout: null, status: 'ok', type: 'system' },
]

const fraudCases = [
  { id: 'FRD-001', worker: 'Vikram S.', zone: 'HSR-01', event: 'Rainfall', gps: false, activity: false, session: true, duplicate: true, score: 0.25, status: 'blocked' },
  { id: 'FRD-002', worker: 'Amit K.', zone: 'BTM-05', event: 'Dark Store', gps: true, activity: false, session: false, duplicate: true, score: 0.50, status: 'review' },
  { id: 'FRD-003', worker: 'Raju M.', zone: 'KOR-02', event: 'Rainfall', gps: false, activity: true, session: true, duplicate: false, score: 0.50, status: 'review' },
]

const forecastData = [
  { zone: 'HSR Layout', days: [{ day: 'Mon', risk: 0.3, label: 'Low' }, { day: 'Tue', risk: 0.5, label: 'Med' }, { day: 'Wed', risk: 0.7, label: 'High' }, { day: 'Thu', risk: 0.74, label: 'High' }, { day: 'Fri', risk: 0.6, label: 'Med' }, { day: 'Sat', risk: 0.4, label: 'Low' }, { day: 'Sun', risk: 0.3, label: 'Low' }] },
  { zone: 'Koramangala', days: [{ day: 'Mon', risk: 0.4, label: 'Low' }, { day: 'Tue', risk: 0.6, label: 'Med' }, { day: 'Wed', risk: 0.8, label: 'High' }, { day: 'Thu', risk: 0.5, label: 'Med' }, { day: 'Fri', risk: 0.3, label: 'Low' }, { day: 'Sat', risk: 0.2, label: 'Low' }, { day: 'Sun', risk: 0.4, label: 'Low' }] },
  { zone: 'BTM Layout', days: [{ day: 'Mon', risk: 0.7, label: 'High' }, { day: 'Tue', risk: 0.85, label: 'High' }, { day: 'Wed', risk: 0.9, label: 'Critical' }, { day: 'Thu', risk: 0.6, label: 'Med' }, { day: 'Fri', risk: 0.5, label: 'Med' }, { day: 'Sat', risk: 0.3, label: 'Low' }, { day: 'Sun', risk: 0.35, label: 'Low' }] },
]

const COLORS = ['#a45b33', '#8a6a52', '#bf5b45', '#c38a2e', '#bc8750']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="glass-strong rounded-xl p-3 text-xs">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="fixed inset-0 bg-themed flex overflow-hidden z-10" style={{ height: '100dvh' }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} glass-strong border-r border-dark-border flex flex-col transition-all duration-300 shrink-0 h-full overflow-y-auto`}>
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          {sidebarOpen && <span className="text-sm font-bold text-text-primary whitespace-nowrap">GigShield Admin</span>}
        </div>
        <nav className="flex-1 px-2 py-2 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      activeTab === item.id 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface'
                    }`}>
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-border">
          <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-dark-surface transition-all">
            <ArrowLeft size={16} className="shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass-strong border-b border-dark-border px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text-muted hover:text-text-primary">
              <Layers size={18} />
            </button>
            <h1 className="text-sm font-bold text-text-primary capitalize">{sidebarItems.find(i => i.id === activeTab)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-surface text-xs text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live Monitoring
            </div>
            <button onClick={toggleTheme} className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center hover:border-primary/30 transition-all" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDark ? <Sun size={14} className="text-warning" /> : <Moon size={14} className="text-text-secondary" />}
            </button>
            <div className="relative">
              <Bell size={18} className="text-text-secondary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-danger" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewPanel />}
          {activeTab === 'map' && <MapPanel />}
          {activeTab === 'live' && <LiveFeedPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
          {activeTab === 'fraud' && <FraudPanel />}
          {activeTab === 'simulator' && <SimulatorPanel />}
          {activeTab === 'forecast' && <ForecastPanel />}
          {activeTab === 'antispoofing' && <AntiSpoofingPanel />}
          {activeTab === 'loyalty' && <LoyaltyPanel />}
        </div>
      </main>
    </div>
  )
}

const AdminSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 size={28} className="text-primary animate-spin" />
  </div>
)

// OVERVIEW PANEL
function OverviewPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const overview = await api.adminOverview()
        setData(overview)
      } catch (err) {
        console.error('Admin overview failed:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AdminSpinner />

  const s = data?.stats || {}
  const zoneDist = data?.zoneDistribution || { safe: 3, watch: 1, disrupted: 1 }
  const wpData = data?.weeklyPayouts || weeklyPayouts
  const zoneList = data?.activeZones || zones

  const stats = [
    { label: 'Active Workers', value: String(s.activeWorkers ?? 0), change: '+12%', up: true, icon: Users, iconBg: 'bg-primary/10', iconText: 'text-primary' },
    { label: 'Weekly Premiums', value: `₹${(s.weeklyPremiums ?? 0).toLocaleString()}`, change: '+8%', up: true, icon: IndianRupee, iconBg: 'bg-success/10', iconText: 'text-success' },
    { label: 'Claims Today', value: String(s.claimsToday ?? 0), change: '', up: true, icon: Zap, iconBg: 'bg-warning/10', iconText: 'text-warning' },
    { label: 'Total Payouts', value: `₹${(s.totalPayouts ?? 0).toLocaleString()}`, change: '', up: true, icon: TrendingUp, iconBg: 'bg-accent/10', iconText: 'text-accent' },
    { label: 'Loss Ratio', value: String(s.lossRatio ?? 0), change: '', up: false, icon: PieChart, iconBg: 'bg-primary/10', iconText: 'text-primary' },
    { label: 'Fraud Rate', value: `${((s.fraudRate ?? 0) * 100).toFixed(1)}%`, change: '', up: false, icon: AlertTriangle, iconBg: 'bg-danger/10', iconText: 'text-danger' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.iconText} />
              </div>
              <span className={`text-xs font-medium ${stat.up ? 'text-success' : 'text-success'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Premium vs Payout */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Premium Pool vs Payouts (Weekly)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,48,40,0.3)" />
              <XAxis dataKey="week" tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="premiums" fill="#a45b33" radius={[6, 6, 0, 0]} name="Premiums" />
              <Bar dataKey="payouts" fill="#8a6a52" radius={[6, 6, 0, 0]} name="Payouts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Risk Distribution */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Zone Status Distribution</h3>
          <div className="flex items-center justify-center h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie data={[
                  { name: 'Safe', value: zoneDist.safe || 0 },
                  { name: 'Watch', value: zoneDist.watch || 0 },
                  { name: 'Disrupted', value: zoneDist.disrupted || 0 },
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {[{ color: '#bc8750' }, { color: '#c38a2e' }, { color: '#bf5b45' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-text-secondary text-xs">{value}</span>} />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone Quick Status */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Active Zones</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs border-b border-dark-border">
                <th className="text-left py-2 px-3">Zone</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-center py-2 px-3">Risk</th>
                <th className="text-center py-2 px-3">Workers</th>
                <th className="text-center py-2 px-3">Rain</th>
                <th className="text-center py-2 px-3">AQI</th>
                <th className="text-center py-2 px-3">Temp</th>
              </tr>
            </thead>
            <tbody>
              {zoneList.map((zone, i) => (
                <tr key={i} className="border-b border-dark-border/50 hover:bg-dark-surface/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-semibold text-text-primary">{zone.name}</p>
                    <p className="text-[10px] text-text-muted">{zone.id}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      zone.status === 'safe' ? 'bg-success/20 text-success' :
                      zone.status === 'watch' ? 'bg-warning/20 text-warning' :
                      'bg-danger/20 text-danger'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        zone.status === 'safe' ? 'bg-success' :
                        zone.status === 'watch' ? 'bg-warning' : 'bg-danger'
                      }`} />
                      {zone.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-bold ${zone.risk > 0.7 ? 'text-danger' : zone.risk > 0.4 ? 'text-warning' : 'text-success'}`}>
                      {zone.risk.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-text-primary">{zone.workers}</td>
                  <td className="py-3 px-3 text-center text-text-secondary">{zone.rainfall}mm</td>
                  <td className="py-3 px-3 text-center text-text-secondary">{zone.aqi}</td>
                  <td className="py-3 px-3 text-center text-text-secondary">{zone.temp}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// MAP PANEL (with real Leaflet map)
function MapPanel() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [apiZones, setApiZones] = useState(null)

  useEffect(() => {
    api.adminZones().then(d => setApiZones(d.zones || [])).catch(() => {})
  }, [])

  const zoneData = (apiZones || zones).map(z => ({
    name: z.name, id: z.id,
    risk: z.riskScore ?? z.risk ?? 0, workers: z.activeWorkers ?? z.workers ?? 0,
    status: z.status, rainfall: z.metrics?.rainfall ?? z.rainfall ?? 0,
    aqi: z.metrics?.aqi ?? z.aqi ?? 0, temp: z.metrics?.temperature ?? z.temp ?? 0,
    lat: z.center?.lat ?? z.lat, lng: z.center?.lng ?? z.lng
  }))

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current || zoneData.length === 0) return

    const map = L.map(mapRef.current, {
      center: [12.9352, 77.6245],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Add zone markers with circles
    zoneData.forEach(zone => {
      const color = zone.status === 'safe' ? '#bc8750' : zone.status === 'watch' ? '#c38a2e' : '#bf5b45'

      // Zone radius circle
      L.circle([zone.lat, zone.lng], {
        radius: 2500,
        color: color,
        fillColor: color,
        fillOpacity: 0.12,
        weight: 2,
        opacity: 0.6,
      }).addTo(map)

      // Zone marker
      const markerIcon = L.divIcon({
        className: 'custom-zone-marker',
        html: `<div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: ${color}30; border: 2.5px solid ${color};
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px ${color}40;
        "><div style="width: 10px; height: 10px; border-radius: 50%; background: ${color};"></div></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([zone.lat, zone.lng], { icon: markerIcon }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${zone.name}</div>
          <div style="font-size: 10px; color: #94A3B8; margin-bottom: 8px;">${zone.id} &bull; ${zone.workers} workers</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; margin-bottom: 8px;">
            <div><div style="font-size: 9px; color: #94A3B8;">Rain</div><div style="font-size: 12px; font-weight: 600;">${zone.rainfall}mm</div></div>
            <div><div style="font-size: 9px; color: #94A3B8;">AQI</div><div style="font-size: 12px; font-weight: 600;">${zone.aqi}</div></div>
            <div><div style="font-size: 9px; color: #94A3B8;">Temp</div><div style="font-size: 12px; font-weight: 600;">${zone.temp}&deg;C</div></div>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid #E2E8F0; font-size: 10px;">
            <span style="color: #94A3B8;">Risk Score</span>
            <span style="font-weight: 700; color: ${color};">${zone.risk.toFixed(2)}</span>
          </div>
          <div style="margin-top: 4px; display: flex; justify-content: space-between; font-size: 10px;">
            <span style="color: #94A3B8;">Status</span>
            <span style="font-weight: 700; color: ${color}; text-transform: uppercase;">${zone.status}</span>
          </div>
        </div>
      `, { className: 'leaflet-popup' })
    })

    mapInstanceRef.current = map

    // Force resize after mount
    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [apiZones]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary">Zone Risk Heatmap — Bangalore</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-success" /> Safe</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-warning" /> Watch</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-danger" /> Disrupted</span>
          </div>
        </div>
        <div ref={mapRef} className="h-[500px] rounded-2xl overflow-hidden border border-dark-border" style={{ zIndex: 1 }} />
      </div>

      {/* Zone Detail Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zoneData.map((zone, i) => (
          <div key={i} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-text-primary text-sm">{zone.name}</p>
                <p className="text-[10px] text-text-muted">{zone.id}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                zone.status === 'safe' ? 'bg-success/20 text-success' :
                zone.status === 'watch' ? 'bg-warning/20 text-warning' :
                'bg-danger/20 text-danger'
              }`}>
                {zone.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-dark-surface">
                <p className="text-[10px] text-text-muted">Risk</p>
                <p className={`text-sm font-bold ${zone.risk > 0.7 ? 'text-danger' : zone.risk > 0.4 ? 'text-warning' : 'text-success'}`}>{zone.risk.toFixed(2)}</p>
              </div>
              <div className="p-2 rounded-lg bg-dark-surface">
                <p className="text-[10px] text-text-muted">Rain</p>
                <p className="text-sm font-bold text-text-primary">{zone.rainfall}mm</p>
              </div>
              <div className="p-2 rounded-lg bg-dark-surface">
                <p className="text-[10px] text-text-muted">AQI</p>
                <p className="text-sm font-bold text-text-primary">{zone.aqi}</p>
              </div>
              <div className="p-2 rounded-lg bg-dark-surface">
                <p className="text-[10px] text-text-muted">Workers</p>
                <p className="text-sm font-bold text-text-primary">{zone.workers}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// LIVE FEED PANEL
function LiveFeedPanel() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [feedData, setFeedData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadFeed = useCallback(async () => {
    try {
      const data = await api.adminLiveFeed()
      setFeedData(data.liveFeed || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { loadFeed() }, [loadFeed])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadFeed, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadFeed])

  const feed = (feedData || liveFeed).map(e => ({
    time: e.time ? new Date(e.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : e.time,
    zone: e.zoneId || e.zone,
    event: e.event,
    claims: e.claims || null,
    payout: e.payout ? (typeof e.payout === 'number' ? `₹${e.payout.toLocaleString()}` : e.payout) : null,
    status: e.status,
    type: e.type,
  }))

  if (loading) return <AdminSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <p className="text-sm text-text-secondary">Real-time event stream</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadFeed} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-surface text-text-muted border border-dark-border hover:border-primary/30 transition-all">
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    autoRefresh ? 'bg-success/10 text-success border border-success/20' : 'bg-dark-surface text-text-muted border border-dark-border'
                  }`}>
            <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {feed.map((event, i) => (
          <div key={i} className="glass rounded-2xl p-4 hover:border-primary/20 transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                event.type === 'rain' || event.type === 'rainfall' ? 'bg-primary/20' :
                event.type === 'aqi' ? 'bg-warning/20' :
                event.type === 'store' || event.type === 'dark_store_closure' ? 'bg-danger/20' :
                event.type === 'alert' || event.type === 'flash_flood' || event.type === 'flood' ? 'bg-warning/20' :
                'bg-dark-surface'
              }`}>
                {event.type === 'rain' || event.type === 'rainfall' ? <CloudRain size={18} className="text-primary" /> :
                 event.type === 'aqi' ? <Wind size={18} className="text-warning" /> :
                 event.type === 'store' || event.type === 'dark_store_closure' ? <AlertTriangle size={18} className="text-danger" /> :
                 event.type === 'alert' || event.type === 'flash_flood' || event.type === 'flood' ? <Zap size={18} className="text-warning" /> :
                 <CheckCircle2 size={18} className="text-success" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-text-primary">{event.event}</p>
                  <span className="text-xs text-text-muted">{event.time}</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">Zone: {event.zone}</p>
                <div className="flex items-center gap-4">
                  {event.claims > 0 && (
                    <span className="text-xs text-text-secondary">
                      <Users size={10} className="inline mr-1" />{event.claims} claims
                    </span>
                  )}
                  {event.payout && (
                    <span className="text-xs text-success font-semibold">{event.payout}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    event.status === 'auto-approved' ? 'bg-success/20 text-success' :
                    event.status === 'watch' ? 'bg-warning/20 text-warning' :
                    event.status === 'monitoring' ? 'bg-primary/20 text-primary' :
                    'bg-dark-surface text-text-muted'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ANALYTICS PANEL
function AnalyticsPanel() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.adminAnalytics()
        setAnalyticsData(data)
      } catch (err) {
        console.error('Analytics load failed:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AdminSpinner />

  const wpData = analyticsData?.weeklyPayouts || weeklyPayouts
  const zoneLossRatios = analyticsData?.zoneLossRatios || []
  const totalPayouts = zoneLossRatios.reduce((s, z) => s + z.payouts, 0) || 1

  const zoneBreakdown = zoneLossRatios.length > 0
    ? zoneLossRatios.map((z, i) => ({
        zone: z.zoneName, payouts: z.payouts,
        percent: Math.round((z.payouts / totalPayouts) * 100),
        color: COLORS[i % COLORS.length]
      }))
    : [
        { zone: 'BTM Layout', payouts: 46800, percent: 40, color: '#bf5b45' },
        { zone: 'HSR Layout', payouts: 20400, percent: 30, color: '#a45b33' },
        { zone: 'Koramangala', payouts: 18600, percent: 18, color: '#c38a2e' },
        { zone: 'Indiranagar', payouts: 6000, percent: 8, color: '#8a6a52' },
        { zone: 'Whitefield', payouts: 2400, percent: 4, color: '#bc8750' },
      ]

  const monthlyData = wpData.slice(0, 6).map((w, i) => ({
    month: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i] || w.week,
    lossRatio: w.premiums > 0 ? Number((w.payouts / w.premiums).toFixed(2)) : 0,
    payouts: w.payouts,
  }))

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Loss Ratio Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a45b33" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a45b33" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,48,40,0.3)" />
              <XAxis dataKey="month" tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="lossRatio" stroke="#a45b33" fill="url(#lossGrad)" strokeWidth={2} name="Loss Ratio" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Monthly Payouts</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,48,40,0.3)" />
              <XAxis dataKey="month" tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="payouts" fill="#8a6a52" radius={[6, 6, 0, 0]} name="Payouts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone Breakdown */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Zone-wise Payout Breakdown (This Week)</h3>
        <div className="space-y-3">
          {zoneBreakdown.map((z, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-text-primary font-medium">{z.zone}</span>
                <span className="text-xs text-text-secondary">₹{z.payouts.toLocaleString()} ({z.percent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-dark-border overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(z.percent, 2)}%`, background: z.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Premium vs Payout (8-Week Trend)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={wpData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,48,40,0.3)" />
            <XAxis dataKey="week" tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: '#9e907f', fontSize: 11 }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="premiums" stroke="#a45b33" strokeWidth={2} dot={{ r: 4, fill: '#a45b33' }} name="Premiums" />
            <Line type="monotone" dataKey="payouts" stroke="#8a6a52" strokeWidth={2} dot={{ r: 4, fill: '#8a6a52' }} name="Payouts" />
            <Legend formatter={(value) => <span className="text-text-secondary text-xs">{value}</span>} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// FRAUD PANEL
function FraudPanel() {
  const [cases, setCases] = useState(fraudCases)
  const [casesLoading, setCasesLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.adminFraudCases()
        if (data.fraudCases) {
          setCases(data.fraudCases.map(fc => ({
            id: fc.id,
            worker: fc.worker || fc.workerId,
            zone: fc.zoneId,
            event: fc.eventId,
            gps: fc.validation?.gps ?? false,
            activity: fc.validation?.activity ?? false,
            session: fc.validation?.session ?? false,
            duplicate: fc.validation?.duplicate ?? false,
            score: fc.validation?.score ?? 0,
            status: fc.status,
          })))
        }
      } catch (err) {
        console.error('Fraud cases load failed:', err)
      }
      setCasesLoading(false)
    }
    load()
  }, [])

  const handleDecision = async (caseId, decision) => {
    try {
      await api.adminFraudDecision(caseId, decision)
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: decision } : c))
    } catch (err) {
      alert('Decision failed: ' + err.message)
    }
  }

  if (casesLoading) return <AdminSpinner />

  return (
    <div className="space-y-6">
      {/* Fraud Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Flagged Claims', value: '3', textColor: 'text-danger' },
          { label: 'Blocked', value: '1', textColor: 'text-danger' },
          { label: 'Under Review', value: '2', textColor: 'text-warning' },
          { label: 'Fraud Rate', value: '2.1%', textColor: 'text-success' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4">
            <p className="text-xs text-text-muted">{s.label}</p>
            <p className={`text-2xl font-bold ${s.textColor} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Fraud Cases */}
      <div className="space-y-4">
        {cases.map((fc, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fc.status === 'blocked' ? 'bg-danger/20' : 'bg-warning/20'}`}>
                  <AlertTriangle size={18} className={fc.status === 'blocked' ? 'text-danger' : 'text-warning'} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{fc.worker}</p>
                  <p className="text-xs text-text-muted">{fc.id} • Zone {fc.zone} • {fc.event}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                fc.status === 'blocked' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
              }`}>
                {fc.status.toUpperCase()}
              </span>
            </div>
            
            {/* Fraud Check Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              {[
                { label: 'GPS in Zone', pass: fc.gps },
                { label: 'Activity Score', pass: fc.activity },
                { label: 'Session Active', pass: fc.session },
                { label: 'No Duplicate', pass: fc.duplicate },
              ].map((check, j) => (
                <div key={j} className={`p-3 rounded-xl border ${check.pass ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {check.pass ? <CheckCircle2 size={14} className="text-success" /> : <XCircle size={14} className="text-danger" />}
                    <span className={`text-xs font-semibold ${check.pass ? 'text-success' : 'text-danger'}`}>
                      {check.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary">{check.label}</p>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Fraud Score:</span>
                <span className={`text-sm font-bold ${fc.score < 0.5 ? 'text-danger' : 'text-warning'}`}>{fc.score.toFixed(2)}</span>
                <span className="text-xs text-text-muted">(threshold: 0.75)</span>
              </div>
              {fc.status === 'review' && (
                <div className="flex gap-2">
                  <button onClick={() => handleDecision(fc.id, 'approved')} className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold border border-success/20">Approve</button>
                  <button onClick={() => handleDecision(fc.id, 'blocked')} className="px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-semibold border border-danger/20">Block</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// SIMULATOR PANEL
function SimulatorPanel() {
  const [rainfall, setRainfall] = useState(15)
  const [aqi, setAqi] = useState(200)
  const [activeWorkers, setActiveWorkers] = useState(100)
  const [simResult, setSimResult] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        const result = await api.adminSimulator({ rainfall, aqi, activeWorkers })
        setSimResult(result)
      } catch (err) {
        console.error('Simulator failed:', err)
      }
    }
    const timer = setTimeout(run, 300)
    return () => clearTimeout(timer)
  }, [rainfall, aqi, activeWorkers])

  const affectedWorkers = simResult?.affectedWorkers ?? Math.round(
    activeWorkers * (
      (rainfall > 15 ? 0.4 : rainfall > 10 ? 0.15 : 0) +
      (aqi > 300 ? 0.3 : aqi > 200 ? 0.1 : 0)
    )
  )
  const estimatedPayout = simResult?.estimatedPayout ?? affectedWorkers * 600
  const premiumPool = simResult?.premiumPool ?? activeWorkers * 99
  const lossRatio = simResult?.lossRatio ?? (premiumPool > 0 ? (estimatedPayout / premiumPool).toFixed(2) : 0)

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-bold text-text-primary mb-6">Risk Scenario Simulator</h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-text-secondary flex items-center gap-2">
                  <CloudRain size={16} className="text-primary" /> Rainfall (mm/hr)
                </label>
                <span className={`text-sm font-bold ${rainfall > 15 ? 'text-danger' : 'text-text-primary'}`}>{rainfall} mm/hr</span>
              </div>
              <input type="range" min="0" max="50" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))}
                     className="w-full h-2 rounded-full appearance-none bg-dark-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>0</span>
                <span className="text-danger">Threshold: 15mm</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-text-secondary flex items-center gap-2">
                  <Wind size={16} className="text-warning" /> Air Quality Index
                </label>
                <span className={`text-sm font-bold ${aqi > 300 ? 'text-danger' : 'text-text-primary'}`}>{aqi}</span>
              </div>
              <input type="range" min="0" max="500" value={aqi} onChange={(e) => setAqi(Number(e.target.value))}
                     className="w-full h-2 rounded-full appearance-none bg-dark-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warning [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-warning/30" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>0</span>
                <span className="text-danger">Threshold: 300</span>
                <span>500</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-text-secondary flex items-center gap-2">
                  <Users size={16} className="text-accent" /> Active Workers
                </label>
                <span className="text-sm font-bold text-text-primary">{activeWorkers}</span>
              </div>
              <input type="range" min="10" max="500" value={activeWorkers} onChange={(e) => setActiveWorkers(Number(e.target.value))}
                     className="w-full h-2 rounded-full appearance-none bg-dark-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/30" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>10</span>
                <span>500</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4 text-center">
                <Users size={20} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-text-primary">{affectedWorkers}</p>
                <p className="text-xs text-text-muted">Affected Workers</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <IndianRupee size={20} className="text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-text-primary">₹{estimatedPayout.toLocaleString()}</p>
                <p className="text-xs text-text-muted">Est. Payout</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <IndianRupee size={20} className="text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-text-primary">₹{premiumPool.toLocaleString()}</p>
                <p className="text-xs text-text-muted">Premium Pool</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <TrendingUp size={20} className={`mx-auto mb-2 ${lossRatio > 1.5 ? 'text-danger' : lossRatio > 0.8 ? 'text-warning' : 'text-success'}`} />
                <p className={`text-2xl font-bold ${lossRatio > 1.5 ? 'text-danger' : lossRatio > 0.8 ? 'text-warning' : 'text-success'}`}>{lossRatio}</p>
                <p className="text-xs text-text-muted">Loss Ratio</p>
              </div>
            </div>

            {Number(lossRatio) > 1.5 && (
              <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-danger">Reinsurance Triggered</p>
                  <p className="text-xs text-text-secondary">Loss ratio exceeds 1.5x — reinsurer covers 70% of claims above threshold</p>
                  <p className="text-xs text-text-muted mt-1">Net exposure: ₹{Math.round(estimatedPayout * 0.3).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// FORECAST PANEL
function ForecastPanel() {
  const [forecastApiData, setForecastApiData] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.adminForecast()
        if (data.zones) {
          setForecastApiData(data.zones.map(z => ({
            zone: z.zoneName,
            days: z.forecast.map(f => ({
              day: f.day,
              risk: f.riskScore,
              label: f.label
            }))
          })))
        }
      } catch (err) {
        console.error('Forecast load failed:', err)
      }
    }
    load()
  }, [])

  const displayData = forecastApiData || forecastData

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-1">7-Day Zone Risk Forecast</h3>
        <p className="text-xs text-text-muted mb-6">Based on 90-day rolling average per zone + seasonal patterns</p>
        
        <div className="space-y-6">
          {displayData.map((zone, i) => (
            <div key={i} className="p-4 rounded-2xl bg-dark-surface">
              <p className="text-sm font-bold text-text-primary mb-3">{zone.zone}</p>
              <div className="grid grid-cols-7 gap-2">
                {zone.days.map((day, j) => (
                  <div key={j} className="text-center">
                    <p className="text-[10px] text-text-muted mb-2">{day.day}</p>
                    <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      day.risk >= 0.8 ? 'bg-danger/20 text-danger border border-danger/30' :
                      day.risk >= 0.6 ? 'bg-warning/20 text-warning border border-warning/30' :
                      'bg-success/20 text-success border border-success/30'
                    }`}>
                      {(day.risk * 100).toFixed(0)}%
                    </div>
                    <p className={`text-[9px] font-bold mt-1 ${
                      day.risk >= 0.8 ? 'text-danger' :
                      day.risk >= 0.6 ? 'text-warning' :
                      'text-success'
                    }`}>
                      {day.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Forecast Methodology</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Historical Data', desc: '90-day rolling window of disruption events per zone' },
            { title: 'Seasonal Patterns', desc: 'Monthly weights: monsoon (Jun-Sep) gets 3x adjustment' },
            { title: 'Day-of-Week', desc: 'Some zones have higher disruption rates on specific weekdays' },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-dark-surface">
              <p className="text-xs font-bold text-text-primary mb-1">{m.title}</p>
              <p className="text-[10px] text-text-secondary">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// LOYALTY PANEL
function LoyaltyPanel() {
  const [loyaltyData, setLoyaltyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.adminLoyalty()
        setLoyaltyData(data)
      } catch (err) {
        console.error('Loyalty load failed:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AdminSpinner />

  const totals = loyaltyData?.totals || {}
  const tierCounts = loyaltyData?.tierCounts || {}
  const leaders = loyaltyData?.leaders || []
  const redemptions = loyaltyData?.recentRedemptions || []
  const tierEmojis = { Starter: '🥉', Reliable: '🥈', Veteran: '🥇', Champion: '💎' }
  const tierData = [
    { name: 'Starter', value: tierCounts.Starter ?? 0, emoji: '🥉', color: '#9e907f' },
    { name: 'Reliable', value: tierCounts.Reliable ?? 0, emoji: '🥈', color: '#a45b33' },
    { name: 'Veteran', value: tierCounts.Veteran ?? 0, emoji: '🥇', color: '#c38a2e' },
    { name: 'Champion', value: tierCounts.Champion ?? 0, emoji: '💎', color: '#8a6a52' },
  ]

  return (
    <div className="space-y-6">
      {/* Loyalty Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Points Issued', value: (totals.totalPointsIssued || 0).toLocaleString(), icon: Award, iconBg: 'bg-primary/10', iconText: 'text-primary' },
          { label: 'Active Earners', value: String(totals.activeEarners || 0), icon: Users, iconBg: 'bg-accent/10', iconText: 'text-accent' },
          { label: 'Avg Points/Worker', value: (totals.avgPointsPerWorker || 0).toLocaleString(), icon: TrendingUp, iconBg: 'bg-success/10', iconText: 'text-success' },
          { label: 'Churn Risk (Low Tier)', value: `${tierCounts.Starter || 0} workers`, icon: AlertTriangle, iconBg: 'bg-warning/10', iconText: 'text-warning' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center mb-2`}>
              <s.icon size={16} className={s.iconText} />
            </div>
            <p className="text-xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tier Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RPieChart>
              <Pie data={tierData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RPieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {tierData.map((t, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-text-secondary">
                <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                {t.emoji} {t.name} ({t.value})
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Top GigPoints Earners</h3>
          <div className="space-y-3">
            {(leaders.length > 0 ? leaders.map(w => ({
              name: w.name, zone: w.zoneId, points: w.points,
              tier: tierEmojis[w.tier] || '🥉', streak: w.streakWeeks
            })) : [
              { name: 'Suresh K.', zone: 'HSR-01', points: 7820, tier: '💎', streak: 12 },
              { name: 'Priya M.', zone: 'BTM-05', points: 5400, tier: '💎', streak: 10 },
              { name: 'Ravi Kumar', zone: 'HSR-01', points: 2450, tier: '🥈', streak: 7 },
              { name: 'Arjun D.', zone: 'KOR-02', points: 1800, tier: '🥈', streak: 5 },
              { name: 'Meera R.', zone: 'IND-03', points: 980, tier: '🥉', streak: 3 },
            ]).map((w, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-surface transition-colors">
                <span className="text-sm font-bold text-text-muted w-5">{i + 1}</span>
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {w.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{w.name}</p>
                  <p className="text-[10px] text-text-muted">{w.zone} • {w.streak}w streak</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{w.points.toLocaleString()} pts</p>
                  <p className="text-[10px]">{w.tier}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redemption Activity */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Recent Redemptions</h3>
        <div className="space-y-2">
          {(redemptions.length > 0 ? redemptions : [
            { worker: 'Suresh K.', reward: '1 Free Week (Champion)', cost: '5,000 pts', time: 'Today' },
            { worker: 'Priya M.', reward: '₹500 Coverage Top-up', cost: '7,500 pts', time: 'Yesterday' },
            { worker: 'Group: HSR-01', reward: 'Zone Milestone ₹20 cashback', cost: '20+ enrolled', time: 'This week' },
          ]).map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-surface">
              <div>
                <p className="text-sm text-text-primary font-medium">{r.worker}</p>
                <p className="text-xs text-text-secondary">{r.reward}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary font-semibold">{r.cost}</p>
                <p className="text-[10px] text-text-muted">{r.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ANTI-SPOOFING PANEL
function AntiSpoofingPanel() {
  const spoofingAttempts = [
    { id: 'SPF-001', ring: 'Ring Alpha', accounts: 460, method: 'GPS Spoof + Fake Deliveries', detected: 'Network Graph', status: 'quarantined', time: '12:02 PM' },
    { id: 'SPF-002', ring: 'Ring Beta', accounts: 35, method: 'Cell Tower Mismatch', detected: 'Device Integrity', status: 'quarantined', time: '12:03 PM' },
    { id: 'SPF-003', ring: null, accounts: 3, method: 'Teleportation Event', detected: 'Velocity Analysis', status: 'blocked', time: '12:04 PM' },
  ]

  const validationLayers = [
    { name: 'GPS Velocity & Trajectory', weight: '20%', checks: 'Road-snapping, jitter analysis, teleportation detection', icon: MapPin, color: '#a45b33', passRate: 94 },
    { name: 'Device Integrity', weight: '25%', checks: 'Cell tower, Wi-Fi BSSID, IP geolocation cross-check', icon: Wifi, color: '#8a6a52', passRate: 97 },
    { name: 'Behavioral Biometrics', weight: '15%', checks: 'Shift patterns, accelerometer, delivery cadence', icon: Fingerprint, color: '#c38a2e', passRate: 91 },
    { name: 'Network Coordination', weight: '30%', checks: 'Temporal clustering, social graph, device fingerprint clusters', icon: Network, color: '#bf5b45', passRate: 99 },
    { name: 'Environmental Consistency', weight: '10%', checks: 'Ambient light, barometric pressure, signal quality', icon: Radio, color: '#bc8750', passRate: 88 },
  ]

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-danger/10 border border-danger/30 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center shrink-0">
          <ShieldAlert size={24} className="text-danger" />
        </div>
        <div>
          <h3 className="text-base font-bold text-danger mb-1">Market Crash Defense Active</h3>
          <p className="text-sm text-text-secondary mb-2">
            Coordinated GPS spoofing attack detected: 498 fraudulent claims from organized ring blocked in under 3 minutes. 
            2 legitimate workers paid normally. Liquidity pool intact.
          </p>
          <div className="flex gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-danger/20 text-danger text-xs font-bold">498 Blocked</span>
            <span className="px-2.5 py-1 rounded-lg bg-success/20 text-success text-xs font-bold">2 Approved</span>
            <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold">0 False Positives</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Ring Detected', value: '2', textColor: 'text-danger' },
          { label: 'Accounts Quarantined', value: '495', textColor: 'text-danger' },
          { label: 'Individual Blocks', value: '3', textColor: 'text-warning' },
          { label: 'False Positive Rate', value: '0.0%', textColor: 'text-success' },
          { label: 'Detection Time', value: '<3 min', textColor: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 5-Layer Validation Architecture */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-1">5-Layer Adversarial Scoring Architecture</h3>
        <p className="text-xs text-text-muted mb-4">Each layer produces an independent score. Composite score determines claim outcome.</p>
        
        <div className="space-y-3">
          {validationLayers.map((layer, i) => (
            <div key={i} className="p-4 rounded-xl bg-dark-surface border border-dark-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${layer.color}20` }}>
                  <layer.icon size={20} style={{ color: layer.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-text-primary">{layer.name}</p>
                    <span className="text-xs font-mono text-primary">{layer.weight}</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{layer.checks}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-dark-border overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${layer.passRate}%`, background: layer.color }} />
                    </div>
                    <span className="text-xs font-bold text-text-primary">{layer.passRate}%</span>
                    <span className="text-[10px] text-text-muted">legit pass rate</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scoring Thresholds */}
        <div className="mt-4 p-4 rounded-xl bg-dark-surface">
          <p className="text-xs font-bold text-text-primary mb-2">Composite Score Thresholds</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-text-primary font-medium w-24">≥ 0.75</span>
              <span className="text-xs text-success font-bold">AUTO APPROVE</span>
              <span className="text-xs text-text-muted">— Payout in &lt;60 seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs text-text-primary font-medium w-24">0.50 – 0.74</span>
              <span className="text-xs text-warning font-bold">SOFT HOLD</span>
              <span className="text-xs text-text-muted">— 15-min review window, auto-release if no action</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-xs text-text-primary font-medium w-24">&lt; 0.50</span>
              <span className="text-xs text-danger font-bold">AUTO BLOCK</span>
              <span className="text-xs text-text-muted">— Worker can appeal via GigBot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Spoofing Attempts */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Detected Spoofing Attempts (Today)</h3>
        <div className="space-y-3">
          {spoofingAttempts.map((attempt, i) => (
            <div key={i} className="p-4 rounded-xl bg-dark-surface border border-dark-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-danger" />
                  <span className="text-sm font-bold text-text-primary">{attempt.id}</span>
                  {attempt.ring && (
                    <span className="px-2 py-0.5 rounded-full bg-danger/20 text-danger text-[10px] font-bold">{attempt.ring}</span>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  attempt.status === 'quarantined' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                }`}>{attempt.status.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-text-muted">Accounts</p>
                  <p className="text-text-primary font-bold">{attempt.accounts}</p>
                </div>
                <div>
                  <p className="text-text-muted">Method</p>
                  <p className="text-text-primary">{attempt.method}</p>
                </div>
                <div>
                  <p className="text-text-muted">Detected By</p>
                  <p className="text-primary font-semibold">{attempt.detected}</p>
                </div>
                <div>
                  <p className="text-text-muted">Time</p>
                  <p className="text-text-primary">{attempt.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Graph Visualization (Simulated) */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-1">Fraud Ring Network Graph</h3>
        <p className="text-xs text-text-muted mb-4">Nodes = claimants | Edges = shared attributes (device, IP, referral, timing)</p>
        <div className="relative h-[300px] rounded-xl bg-dark-surface border border-dark-border overflow-hidden">
          {/* Legitimate cluster (small, spread) */}
          <div className="absolute left-[15%] top-[50%] -translate-y-1/2">
            <p className="text-[10px] text-success font-bold mb-2">Legitimate Workers</p>
            <div className="relative w-[120px] h-[120px]">
              {[
                { x: 20, y: 10 }, { x: 60, y: 5 }, { x: 95, y: 25 },
                { x: 10, y: 55 }, { x: 50, y: 45 }, { x: 85, y: 60 },
                { x: 30, y: 90 }, { x: 70, y: 85 },
              ].map((p, i) => (
                <div key={i} className="absolute w-3 h-3 rounded-full bg-success border border-success/50" 
                     style={{ left: p.x, top: p.y }} />
              ))}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="25" y1="15" x2="65" y2="10" stroke="#bc8750" strokeWidth="0.5" strokeOpacity="0.3" />
                <line x1="55" y1="50" x2="90" y2="65" stroke="#bc8750" strokeWidth="0.5" strokeOpacity="0.3" />
              </svg>
            </div>
          </div>
          
          {/* Fraud ring cluster (dense, tightly connected) */}
          <div className="absolute right-[10%] top-[50%] -translate-y-1/2">
            <p className="text-[10px] text-danger font-bold mb-2">Ring Alpha (460 accounts)</p>
            <div className="relative w-[160px] h-[160px]">
              {Array.from({ length: 20 }, (_, i) => {
                const angle = (i / 20) * Math.PI * 2
                const r = 40 + Math.random() * 25
                return { x: 80 + Math.cos(angle) * r, y: 80 + Math.sin(angle) * r }
              }).map((p, i) => (
                <div key={i} className="absolute w-2.5 h-2.5 rounded-full bg-danger border border-danger/50" 
                     style={{ left: p.x, top: p.y }} />
              ))}
              {/* Dense interconnections */}
              <svg className="absolute inset-0 w-full h-full">
                {Array.from({ length: 30 }, (_, i) => {
                  const a1 = (i / 20) * Math.PI * 2
                  const a2 = ((i + 3) / 20) * Math.PI * 2
                  const r1 = 50, r2 = 55
                  return <line key={i} x1={80+Math.cos(a1)*r1} y1={80+Math.sin(a1)*r1} 
                              x2={80+Math.cos(a2)*r2} y2={80+Math.sin(a2)*r2} 
                              stroke="#bf5b45" strokeWidth="0.5" strokeOpacity="0.4" />
                })}
              </svg>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-danger/30" 
                   style={{ left: 30, top: 30, width: 100, height: 100 }} />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-3 left-3 flex gap-4 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Legitimate (sparse edges)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger" /> Fraud Ring (dense cluster)</span>
          </div>
          <div className="absolute top-3 right-3 text-[10px] text-text-muted">Louvain Community Detection</div>
        </div>
      </div>

      {/* Temporal Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-3">Claim Submission Timeline</h3>
          <p className="text-xs text-text-muted mb-4">Legitimate claims spread over 5–15 min. Fraud rings submit in &lt;60 sec burst.</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-success font-semibold mb-1">Legitimate Pattern (34 claims)</p>
              <div className="h-8 bg-dark-surface rounded-lg overflow-hidden relative">
                {[5, 12, 18, 25, 30, 35, 40, 42, 48, 52, 55, 60, 65, 68, 72, 75, 78, 80, 82, 85, 87, 88, 90, 91, 92, 93, 94, 95, 96, 97, 97.5, 98, 98.5, 99].map((p, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-px bg-success/70" style={{ left: `${p}%` }} />
                ))}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] text-text-muted">
                  <span>0s</span><span>5min</span><span>10min</span><span>15min</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-danger font-semibold mb-1">Fraud Ring Pattern (498 claims)</p>
              <div className="h-8 bg-dark-surface rounded-lg overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-[2%] w-[6%] bg-danger/40 rounded" />
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] text-text-muted">
                  <span>0s</span><span>45s burst</span><span></span><span>15min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-3">Honest Worker Protection</h3>
          <p className="text-xs text-text-muted mb-4">How we prevent false positives during GPS degradation events.</p>
          <div className="space-y-2.5">
            {[
              { label: 'Zone Radius Expansion', desc: '+25% during active triggers (2.5km → 3.1km)', icon: MapPin },
              { label: 'Reputation Fast Lane', desc: 'Veteran/Champion tiers get +0.15 trust bonus', icon: Award },
              { label: 'Soft Hold (not hard block)', desc: 'Borderline claims auto-release in 15 min', icon: Clock },
              { label: 'Transparent Appeals', desc: 'One-tap review + GigBot explanation in Hindi/English', icon: CheckCircle2 },
              { label: 'Goodwill Gesture', desc: 'Successful appeals get +50 bonus GigPoints', icon: Award },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-dark-surface">
                <item.icon size={14} className="text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                  <p className="text-[10px] text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continuous Adaptation */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-3">Continuous Adaptation</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: 'Weekly Retraining', desc: 'Behavioral baselines recalculated every 7 days' },
            { title: 'Honeypot Zones', desc: 'Synthetic triggers in non-event zones catch remaining fraudsters' },
            { title: 'Adversarial Feedback', desc: 'Confirmed fraud cases improve detection accuracy' },
            { title: 'Full Explainability', desc: 'Admins see exactly which layers flagged each claim' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-dark-surface">
              <p className="text-xs font-bold text-text-primary mb-1">{item.title}</p>
              <p className="text-[10px] text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
