import { useApp } from '../context/AppContext'
import { ISSUE_TYPES, SEVERITY_LEVELS, STATUSES, WARDS } from '../utils/constants'

export default function FilterBar() {
  const { state, dispatch } = useApp()
  const set = (key, value) => dispatch({ type: 'SET_FILTERS', payload: { [key]: value } })

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={state.filters.type} onChange={v => set('type', v)} placeholder="All Types"
        options={Object.entries(ISSUE_TYPES).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))} />
      <Select value={state.filters.severity} onChange={v => set('severity', v)} placeholder="All Severity"
        options={Object.entries(SEVERITY_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))} />
      <Select value={state.filters.status} onChange={v => set('status', v)} placeholder="All Status"
        options={Object.entries(STATUSES).map(([k, v]) => ({ value: k, label: v.label }))} />
      <Select value={state.filters.ward} onChange={v => set('ward', v)} placeholder="All Wards"
        options={WARDS.map(w => ({ value: w, label: w }))} />
      {(state.filters.type || state.filters.severity || state.filters.status || state.filters.ward) && (
        <button onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-gray-800 rounded-lg">
          Clear
        </button>
      )}
    </div>
  )
}

function Select({ value, onChange, placeholder, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-civic-500">
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
