import { createContext, useContext, useReducer, useEffect } from 'react'
import { generateMockReports } from '../utils/mockData'
import { detectPatterns } from '../utils/predictionEngine'
import { getSession, logout as authLogout } from '../utils/authService'

const AppContext = createContext(null)

function loadState() {
  const session = getSession()

  try {
    const saved = localStorage.getItem('civiclens_state')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...initialState,
        ...parsed,
        currentUser: session,
        isAuthenticated: !!session,
        predictions: detectPatterns(parsed.reports || []),
      }
    }
  } catch {}

  const reports = generateMockReports()
  return {
    ...initialState,
    reports,
    currentUser: session,
    isAuthenticated: !!session,
    predictions: detectPatterns(reports),
  }
}

const initialState = {
  reports: [],
  currentUser: null,
  isAuthenticated: false,
  filters: { type: '', severity: '', status: '', ward: '' },
  predictions: [],
  notification: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload, isAuthenticated: true }
    case 'LOGOUT': {
      authLogout()
      return { ...state, currentUser: null, isAuthenticated: false }
    }
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
    const { predictions, notification, isAuthenticated, currentUser, ...toSave } = state
    localStorage.setItem('civiclens_state', JSON.stringify(toSave))
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
