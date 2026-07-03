import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import ReportCard from '../components/ReportCard'
import FilterBar from '../components/FilterBar'
import { getSeverityLevel } from '../utils/constants'

export default function MyReportsPage() {
  const { state } = useApp()
  const [showAll, setShowAll] = useState(state.currentUser.role === 'admin')

  const reports = useMemo(() => {
    let list = showAll ? state.reports : state.reports.filter(r => r.citizenId === state.currentUser.id)
    if (state.filters.type) list = list.filter(r => r.issueType === state.filters.type)
    if (state.filters.status) list = list.filter(r => r.status === state.filters.status)
    if (state.filters.ward) list = list.filter(r => r.ward === state.filters.ward)
    if (state.filters.severity) list = list.filter(r => getSeverityLevel(r.severityScore) === state.filters.severity)
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [state.reports, state.filters, state.currentUser, showAll])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {showAll ? 'All Reports' : 'My Reports'}
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAll(!showAll)}
            className="text-xs text-civic-400 hover:text-civic-300">
            {showAll ? 'Show Mine' : 'Show All'}
          </button>
          <span className="text-sm text-gray-500">{reports.length} reports</span>
        </div>
      </div>

      <FilterBar />

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400">No reports found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  )
}
