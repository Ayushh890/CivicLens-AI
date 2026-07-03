import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import StatsCard from '../components/StatsCard'
import PredictionAlert from '../components/PredictionAlert'
import MapView from '../components/MapView'
import { ISSUE_TYPES, DEPARTMENTS, ISSUE_TO_DEPARTMENT, WARDS } from '../utils/constants'

export default function DashboardPage() {
  const { state } = useApp()
  const { reports } = state

  const stats = useMemo(() => {
    const total = reports.length
    const submitted = reports.filter(r => r.status === 'submitted').length
    const inProgress = reports.filter(r => ['verified', 'assigned', 'in_progress'].includes(r.status)).length
    const resolved = reports.filter(r => r.status === 'resolved').length
    const avgSeverity = total ? Math.round(reports.reduce((s, r) => s + r.severityScore, 0) / total) : 0
    const critical = reports.filter(r => r.severityScore >= 76).length

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

    return { total, submitted, inProgress, resolved, avgSeverity, critical, typeRanking, byDept, wardRanking, resolutionRate }
  }, [reports])

  const maxTypeCount = stats.typeRanking.length ? stats.typeRanking[0][1] : 1
  const maxWardCount = stats.wardRanking.length ? stats.wardRanking[0][1] : 1

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Municipal Dashboard</h1>

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
          <h2 className="text-lg font-semibold text-white mb-3">Prediction Alerts</h2>
          <div className="space-y-3">
            {state.predictions.map((p, i) => <PredictionAlert key={i} prediction={p} />)}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-sm font-semibold text-white mb-4">Issues by Type</h3>
          <div className="space-y-2">
            {stats.typeRanking.map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-lg w-8">{ISSUE_TYPES[type]?.icon}</span>
                <span className="text-xs text-gray-400 w-28 truncate">{ISSUE_TYPES[type]?.label}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-civic-600 rounded-full transition-all"
                    style={{ width: `${(count / maxTypeCount) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-sm font-semibold text-white mb-4">Issues by Ward</h3>
          <div className="space-y-2">
            {stats.wardRanking.map(([ward, count]) => (
              <div key={ward} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-48 truncate">{ward}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-cyan-600 rounded-full transition-all"
                    style={{ width: `${(count / maxWardCount) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="text-sm font-semibold text-white mb-4">Department Workload</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Reports</th>
                <th className="py-2 pr-4">Contact</th>
                <th className="py-2">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.byDept).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                <tr key={key} className="border-b border-gray-800/50">
                  <td className="py-2 pr-4 text-gray-300">{DEPARTMENTS[key]?.name}</td>
                  <td className="py-2 pr-4 text-civic-400 font-medium">{count}</td>
                  <td className="py-2 pr-4 text-gray-500">{DEPARTMENTS[key]?.contact}</td>
                  <td className="py-2 text-gray-500">{DEPARTMENTS[key]?.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-800">
        <h3 className="text-sm font-semibold text-white p-4 bg-gray-900">Overview Map</h3>
        <MapView reports={reports} height="350px" />
      </div>
    </div>
  )
}
