import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatsCard from '../components/StatsCard'
import PredictionAlert from '../components/PredictionAlert'
import ReportCard from '../components/ReportCard'

const FEATURES = [
  { icon: '🤖', title: 'AI Classification', desc: 'Instantly classifies and routes your complaint to the right department' },
  { icon: '🗺️', title: 'Smart Map', desc: 'See all civic issues in your area with severity-coded markers' },
  { icon: '⚡', title: 'Prediction Engine', desc: 'Detects patterns to predict infrastructure failures before they happen' },
  { icon: '📋', title: 'Auto Complaints', desc: 'Generates formal complaints in English & Hindi with one click' },
  { icon: '🏆', title: 'Trust Scores', desc: 'Earn reputation as a civic champion by filing verified reports' },
  { icon: '📊', title: 'Dashboard', desc: 'Real-time analytics for municipal authorities to prioritize fixes' },
]

export default function HomePage() {
  const { state } = useApp()

  const total = state.reports.length
  const pending = state.reports.filter(r => r.status === 'submitted').length
  const inProgress = state.reports.filter(r => ['verified', 'assigned', 'in_progress'].includes(r.status)).length
  const resolved = state.reports.filter(r => r.status === 'resolved').length
  const recent = [...state.reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="text-white">CivicLens</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-civic-400 to-cyan-400">AI</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
          AI-Powered Operating System for Smarter Cities. Report civic issues, track resolutions, and help build a better city.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/report"
            className="px-6 py-3 bg-civic-600 hover:bg-civic-500 text-white rounded-xl font-semibold transition-colors">
            Report an Issue
          </Link>
          <Link to="/map"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-colors">
            View Map
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon="📋" label="Total Reports" value={total} />
        <StatsCard icon="🔴" label="Pending" value={pending} color="text-red-400" />
        <StatsCard icon="🔧" label="In Progress" value={inProgress} color="text-orange-400" />
        <StatsCard icon="✅" label="Resolved" value={resolved} color="text-green-400" />
      </section>

      {state.predictions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Prediction Alerts</h2>
          <div className="space-y-3">
            {state.predictions.map((p, i) => <PredictionAlert key={i} prediction={p} />)}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <div key={i} className="p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-civic-800/50 transition-colors">
            <span className="text-3xl">{f.icon}</span>
            <h3 className="text-sm font-semibold text-white mt-3 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
          <Link to="/my-reports" className="text-xs text-civic-400 hover:text-civic-300">View All</Link>
        </div>
        <div className="space-y-3">
          {recent.map(r => <ReportCard key={r.id} report={r} />)}
        </div>
      </section>

      <section className="text-center py-8">
        <h3 className="text-xl font-semibold text-white mb-2">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-6">
          {['Report', 'AI Analyzes', 'Routed', 'Resolved'].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 bg-civic-600 rounded-full flex items-center justify-center text-white font-bold mb-2">
                {i + 1}
              </div>
              <p className="text-sm text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
