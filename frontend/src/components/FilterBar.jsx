import { useApp } from '../context/AppContext'
import { ISSUE_TYPES, SEVERITY_LEVELS, STATUSES, WARDS } from '../utils/constants'

export default function FilterBar() {
  const { state, dispatch } = useApp()
  const set = (key, value) => dispatch({ type: 'SET_FILTERS', payload: { [key]: value } })
  const hasFilters = state.filters.type || state.filters.severity || state.filters.status || state.filters.ward

  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      <Select value={state.filters.type} onChange={v => set('type', v)} placeholder="All Types"
        options={Object.entries(ISSUE_TYPES).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))} />
      <Select value={state.filters.severity} onChange={v => set('severity', v)} placeholder="All Severity"
        options={Object.entries(SEVERITY_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))} />
      <Select value={state.filters.status} onChange={v => set('status', v)} placeholder="All Status"
        options={Object.entries(STATUSES).map(([k, v]) => ({ value: k, label: v.label }))} />
      <Select value={state.filters.ward} onChange={v => set('ward', v)} placeholder="All Wards"
        options={WARDS.map(w => ({ value: w, label: w }))} />
      {hasFilters && (
        <button onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          className="px-4 py-2 text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all duration-300 active:scale-95">
          Clear All
        </button>
      )}
    </div>
  )
}

function Select({ value, onChange, placeholder, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-4 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-civic-400 focus:ring-2 focus:ring-civic-100 transition-all duration-300 cursor-pointer hover:border-civic-300">
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
