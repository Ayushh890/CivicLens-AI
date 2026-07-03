import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatsCard from '../components/StatsCard'
import PredictionAlert from '../components/PredictionAlert'
import ReportCard from '../components/ReportCard'

const FEATURES = [
  { icon: '🤖', title: 'AI Classification', desc: 'Instantly classifies and routes your complaint to the right department', color: 'from-violet-50 to-purple-50 border-violet-200' },
  { icon: '🗺️', title: 'Smart Map', desc: 'See all civic issues in your area with severity-coded markers', color: 'from-blue-50 to-cyan-50 border-blue-200' },
  { icon: '⚡', title: 'Prediction Engine', desc: 'Detects patterns to predict infrastructure failures before they happen', color: 'from-amber-50 to-orange-50 border-amber-200' },
  { icon: '📋', title: 'Auto Complaints', desc: 'Generates formal complaints in English & Hindi with one click', color: 'from-emerald-50 to-green-50 border-emerald-200' },
  { icon: '🏆', title: 'Trust Scores', desc: 'Earn reputation as a civic champion by filing verified reports', color: 'from-yellow-50 to-amber-50 border-yellow-200' },
  { icon: '📊', title: 'Dashboard', desc: 'Real-time analytics for municipal authorities to prioritize fixes', color: 'from-rose-50 to-pink-50 border-rose-200' },
]

const STEPS = [
  { num: '01', title: 'Report', desc: 'Describe your issue with text, voice, or photo', color: 'from-blue-500 to-cyan-500' },
  { num: '02', title: 'AI Analyzes', desc: 'Our AI classifies, scores severity, and routes it', color: 'from-violet-500 to-purple-500' },
  { num: '03', title: 'Routed', desc: 'Sent to the right department automatically', color: 'from-amber-500 to-orange-500' },
  { num: '04', title: 'Resolved', desc: 'Track progress from submission to resolution', color: 'from-emerald-500 to-green-500' },
]

export default function HomePage() {
  const { state } = useApp()

  const total = state.reports.length
  const pending = state.reports.filter(r => r.status === 'submitted').length
  const inProgress = state.reports.filter(r => ['verified', 'assigned', 'in_progress'].includes(r.status)).length
  const resolved = state.reports.filter(r => r.status === 'resolved').length
  const recent = [...state.reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="space-y-12">
      <section className="relative text-center py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-civic-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-civic-50 border border-civic-200 rounded-full text-sm font-medium text-civic-700 mb-6">
            <span className="w-2 h-2 bg-civic-500 rounded-full animate-pulse" />
            AI-Powered Smart City Platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            <span className="text-surface-900">CivicLens</span>{' '}
            <span className="gradient-text">AI</span>
          </h1>
          <p className="text-surface-500 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Report civic issues, track resolutions, and help build a smarter, safer city with AI-powered intelligence.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/report" className="gradient-btn px-8 py-3.5 text-base">
              Report an Issue
            </Link>
            <Link to="/map" className="gradient-btn-outline px-8 py-3.5 text-base">
              View Map
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <StatsCard icon="📋" label="Total Reports" value={total} />
        <StatsCard icon="🔴" label="Pending" value={pending} color="text-red-400" />
        <StatsCard icon="🔧" label="In Progress" value={inProgress} color="text-orange-400" />
        <StatsCard icon="✅" label="Resolved" value={resolved} color="text-green-400" />
      </section>

      {state.predictions.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold text-surface-800 mb-4 flex items-center gap-2">
            <span className="animate-float">⚠️</span> Prediction Alerts
          </h2>
          <div className="space-y-3">
            {state.predictions.map((p, i) => <PredictionAlert key={i} prediction={p} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-surface-800 mb-6 text-center">Powerful Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className={`p-6 rounded-2xl border bg-gradient-to-br ${f.color} card-hover animate-fade-in-up group`}
              style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="text-3xl group-hover:scale-125 inline-block transition-transform duration-300">{f.icon}</span>
              <h3 className="text-sm font-bold text-surface-800 mt-3 mb-1.5">{f.title}</h3>
              <p className="text-xs text-surface-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-surface-800">Recent Reports</h2>
          <Link to="/my-reports" className="text-sm text-civic-600 hover:text-civic-700 font-semibold transition-colors">
            View All &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((r, i) => (
            <div key={r.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <ReportCard report={r} />
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card p-10 text-center">
        <h3 className="text-2xl font-bold text-surface-800 mb-8">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white text-lg font-bold mb-3 shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300`}>
                {step.num}
              </div>
              <p className="text-sm font-bold text-surface-800 mb-1">{step.title}</p>
              <p className="text-xs text-surface-500">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <span className="hidden sm:block absolute translate-x-[120px] text-surface-300 text-xl">&#8594;</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
