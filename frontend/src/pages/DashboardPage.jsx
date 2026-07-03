import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import StatsCard from '../components/StatsCard'
import PredictionAlert from '../components/PredictionAlert'
import MapView from '../components/MapView'
import { ISSUE_TYPES, DEPARTMENTS, ISSUE_TO_DEPARTMENT } from '../utils/constants'

export default function DashboardPage() {
  const { state } = useApp()
  const { reports } = state

  const stats = useMemo(() => {
    const total = reports.length
    const submitted = reports.filter(r => r.status === 'submitted').length
    const inProgress = reports.filter(r => ['verified', 'assigned', 'in_progress'].includes(r.status)).length
    const resolved = reports.filter(r => r.status === 'resolved').length
    const avgSeverity = total ? Math.round(reports.reduce((s, r) => s + r.severityScore, 0) / total) : 0

    const byType = {}
    reports.forEach(r => { byType[r.issueType] = (byType[r.issueType] || 0) + 1 })
    const typeRanking = Object.entries(byType).sort((a, b) => b[1] - a[1])

    const byDept = {}
    reports.forEach(r => {
      const d = ISSUE_TO_DEPARTMENT[r.issueType] || 'municipal'
      byDept[d] = (byDept[d] || 0) + 1
    })

    const byWard = {}
    reports.forEach(r => { if (r.ward) byWard[r.ward] = (byWard[r.ward] || 0) + 1 })
    const wardRanking = Object.entries(byWard).sort((a, b) => b[1] - a[1])

    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0

    return { total, submitted, inProgress, resolved, avgSeverity, typeRanking, byDept, wardRanking, resolutionRate }
  }, [reports])

  const maxTypeCount = stats.typeRanking.length ? stats.typeRanking[0][1] : 1
  const maxWardCount = stats.wardRanking.length ? stats.wardRanking[0][1] : 1

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-800">Municipal Dashboard</h1>
        <p className="text-sm text-surface-500">Real-time analytics and insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard icon="📋" label="Total" value={stats.total} />
        <StatsCard icon="🔴" label="Pending" value={stats.submitted} color="text-red-400" />
        <StatsCard icon="🔧" label="In Progress" value={stats.inProgress} color="text-orange-400" />
        <StatsCard icon="✅" label="Resolved" value={stats.resolved} color="text-green-400" />
        <StatsCard icon="🎯" label="Avg Severity" value={stats.avgSeverity} color="text-yellow-400" />
        <StatsCard icon="📈" label="Resolution" value={`${stats.resolutionRate}%`} color="text-civic-400" />
      </div>

      {state.predictions.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-surface-800 mb-3 flex items-center gap-2">
            <span className="animate-float">⚠️</span> Prediction Alerts
          </h2>
          <div className="space-y-3">
            {state.predictions.map((p, i) => <PredictionAlert key={i} prediction={p} />)}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-surface-800 mb-5">Issues by Type</h3>
          <div className="space-y-3">
            {stats.typeRanking.map(([type, count], i) => (
              <div key={type} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="text-lg w-8">{ISSUE_TYPES[type]?.icon}</span>
                <span className="text-xs text-surface-500 w-28 truncate font-medium">{ISSUE_TYPES[type]?.label}</span>
                <div className="flex-1 bg-surface-100 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-civic-400 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxTypeCount) * 100}%` }} />
                </div>
                <span className="text-xs text-surface-600 font-bold w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-surface-800 mb-5">Issues by Ward</h3>
          <div className="space-y-3">
            {stats.wardRanking.map(([ward, count], i) => (
              <div key={ward} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="text-xs text-surface-500 w-48 truncate font-medium">{ward}</span>
                <div className="flex-1 bg-surface-100 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxWardCount) * 100}%` }} />
                </div>
                <span className="text-xs text-surface-600 font-bold w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-surface-800 mb-4">Department Workload</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-surface-400 border-b border-surface-200">
                <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wider">Department</th>
                <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wider">Reports</th>
                <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wider">Contact</th>
                <th className="py-3 font-semibold text-xs uppercase tracking-wider">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.byDept).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                <tr key={key} className="border-b border-surface-100 hover:bg-civic-50/30 transition-colors">
                  <td className="py-3 pr-4 text-surface-700 font-medium">{DEPARTMENTS[key]?.name}</td>
                  <td className="py-3 pr-4">
                    <span className="px-3 py-1 bg-civic-50 text-civic-700 rounded-full text-xs font-bold border border-civic-200">{count}</span>
                  </td>
                  <td className="py-3 pr-4 text-surface-400 font-mono text-xs">{DEPARTMENTS[key]?.contact}</td>
                  <td className="py-3 text-surface-400">{DEPARTMENTS[key]?.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <h3 className="text-sm font-bold text-surface-800 p-5 pb-0">Overview Map</h3>
        <div className="p-4">
          <div className="rounded-2xl overflow-hidden border border-surface-200">
            <MapView reports={reports} height="350px" />
          </div>
        </div>
      </div>
    </div>
  )
}
