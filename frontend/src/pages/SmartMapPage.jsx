import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MapView from '../components/MapView'
import FilterBar from '../components/FilterBar'
import SeverityBadge from '../components/SeverityBadge'
import { ISSUE_TYPES, STATUSES, getSeverityLevel } from '../utils/constants'

export default function SmartMapPage() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return state.reports.filter(r => {
      if (state.filters.type && r.issueType !== state.filters.type) return false
      if (state.filters.status && r.status !== state.filters.status) return false
      if (state.filters.ward && r.ward !== state.filters.ward) return false
      if (state.filters.severity && getSeverityLevel(r.severityScore) !== state.filters.severity) return false
      return true
    })
  }, [state.reports, state.filters])

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Smart Map</h1>
          <p className="text-sm text-surface-500">All civic issues plotted by severity</p>
        </div>
        <span className="px-4 py-2 bg-civic-50 text-civic-700 rounded-full text-sm font-semibold border border-civic-200">
          {filtered.length} reports
        </span>
      </div>

      <FilterBar />

      <div className="rounded-2xl overflow-hidden border border-surface-200 shadow-xl shadow-surface-200/50 animate-scale-in">
        <MapView reports={filtered} height="600px" onMarkerClick={setSelected} />
      </div>

      {selected && (
        <div className="glass-card p-5 animate-fade-in-up">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-surface-800 mb-1">
                {ISSUE_TYPES[selected.issueType]?.icon} {selected.title}
              </h3>
              <p className="text-xs text-surface-500 mb-2">{selected.description.slice(0, 120)}...</p>
              <div className="flex items-center gap-2">
                <SeverityBadge score={selected.severityScore} />
                <span className="text-xs text-surface-400 font-medium">{STATUSES[selected.status]?.label}</span>
              </div>
            </div>
            <button onClick={() => navigate(`/report/${selected.id}`)}
              className="gradient-btn px-4 py-2 text-xs">
              View Details
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-surface-500 glass-card p-4">
        <span className="font-semibold text-surface-700">Legend:</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" /> Low</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" /> Medium</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" /> High</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 shadow-sm" /> Critical</span>
      </div>
    </div>
  )
}
