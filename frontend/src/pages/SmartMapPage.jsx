import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MapView from '../components/MapView'
import HeatmapLayer from '../components/HeatmapLayer'
import FilterBar from '../components/FilterBar'
import SeverityBadge from '../components/SeverityBadge'
import { ISSUE_TYPES, STATUSES, getSeverityLevel } from '../utils/constants'

export default function SmartMapPage() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [showHeatmap, setShowHeatmap] = useState(true)

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Smart Map</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" checked={showHeatmap} onChange={e => setShowHeatmap(e.target.checked)}
              className="rounded border-gray-700" />
            Heatmap
          </label>
          <span className="text-sm text-gray-500">{filtered.length} reports</span>
        </div>
      </div>

      <FilterBar />

      <div className="relative rounded-xl overflow-hidden border border-gray-800">
        <MapView reports={filtered} height="600px" onMarkerClick={setSelected} />
      </div>

      {selected && (
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {ISSUE_TYPES[selected.issueType]?.icon} {selected.title}
              </h3>
              <p className="text-xs text-gray-400 mb-2">{selected.description.slice(0, 120)}...</p>
              <div className="flex items-center gap-2">
                <SeverityBadge score={selected.severityScore} />
                <span className="text-xs text-gray-500">{STATUSES[selected.status]?.label}</span>
              </div>
            </div>
            <button onClick={() => navigate(`/report/${selected.id}`)}
              className="px-3 py-1.5 text-xs bg-civic-600 hover:bg-civic-500 text-white rounded-lg">
              View
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" /> Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" /> High</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Critical</span>
      </div>
    </div>
  )
}
