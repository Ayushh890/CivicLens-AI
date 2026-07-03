import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import ReportCard from '../components/ReportCard'
import FilterBar from '../components/FilterBar'
import api from '../utils/api'

export default function MyReportsPage() {
  const { state } = useApp()
  const isAdmin = state.currentUser?.role === 'admin'
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const filters = {}
    if (state.filters.type) filters.type = state.filters.type
    if (state.filters.status) filters.status = state.filters.status
    if (state.filters.ward) filters.ward = state.filters.ward
    if (state.filters.severity) filters.severity = state.filters.severity

    api.reports.list(filters)
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }, [state.filters])

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">{isAdmin ? 'All Reports' : 'My Reports'}</h1>
          <p className="text-sm text-surface-500">
            {isAdmin ? 'Manage and review all civic reports' : 'Track your submitted civic reports'}
          </p>
        </div>
        <span className="px-3 py-2 bg-surface-100 text-surface-600 rounded-xl text-sm font-medium">{reports.length} reports</span>
      </div>

      <FilterBar />

      {loading ? (
        <div className="text-center py-16 glass-card">
          <span className="w-8 h-8 border-3 border-civic-200 border-t-civic-500 rounded-full animate-spin inline-block" />
          <p className="text-surface-500 mt-3 font-medium">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 glass-card animate-fade-in-up">
          <span className="text-5xl mb-4 inline-block">📋</span>
          <p className="text-surface-500 font-medium">No reports found</p>
          <p className="text-sm text-surface-400 mt-1">
            {isAdmin ? 'Try adjusting your filters' : 'You haven\'t submitted any reports yet'}
          </p>
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
