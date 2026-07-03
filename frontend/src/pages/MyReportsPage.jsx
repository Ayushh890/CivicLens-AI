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
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">{showAll ? 'All Reports' : 'My Reports'}</h1>
          <p className="text-sm text-surface-500">Track and manage civic issue reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-sm font-semibold text-civic-600 hover:text-civic-700 bg-civic-50 hover:bg-civic-100 rounded-xl border border-civic-200 transition-all duration-300 active:scale-95">
            {showAll ? 'Show Mine' : 'Show All'}
          </button>
          <span className="px-3 py-2 bg-surface-100 text-surface-600 rounded-xl text-sm font-medium">{reports.length} reports</span>
        </div>
      </div>

      <FilterBar />

      {reports.length === 0 ? (
        <div className="text-center py-16 glass-card animate-fade-in-up">
          <span className="text-5xl mb-4 inline-block">📋</span>
          <p className="text-surface-500 font-medium">No reports found</p>
          <p className="text-sm text-surface-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={r.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ReportCard report={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
