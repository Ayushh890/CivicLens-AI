import { createContext, useContext, useReducer, useEffect } from 'react'
import { generateMockReports } from '../utils/mockData'
import { detectPatterns } from '../utils/predictionEngine'

const AppContext = createContext(null)

const DEFAULT_USER = { id: 'CIT-001', name: 'Rahul Sharma', role: 'citizen' }

function loadState() {
  try {
    const saved = localStorage.getItem('civiclens_state')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...initialState, ...parsed, predictions: detectPatterns(parsed.reports || []) }
    }
  } catch {}
  const reports = generateMockReports()
  return { ...initialState, reports, predictions: detectPatterns(reports) }
}

const initialState = {
  reports: [],
  currentUser: DEFAULT_USER,
  filters: { type: '', severity: '', status: '', ward: '' },
  predictions: [],
  notification: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports], predictions: detectPatterns([action.payload, ...state.reports]) }
    case 'UPDATE_REPORT': {
      const reports = state.reports.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r)
      return { ...state, reports }
    }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'CLEAR_FILTERS':
      return { ...state, filters: { type: '', severity: '', status: '', ward: '' } }
    case 'TOGGLE_ROLE':
      return { ...state, currentUser: { ...state.currentUser, role: state.currentUser.role === 'citizen' ? 'admin' : 'citizen' } }
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload }
    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState)

  useEffect(() => {
    const { predictions, notification, ...toSave } = state
    localStorage.setItem('civiclens_state', JSON.stringify(toSave))
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
