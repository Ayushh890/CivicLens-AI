import { createContext, useContext, useReducer, useEffect } from 'react'
import api, { setToken, clearToken } from '../utils/api'

const AppContext = createContext(null)

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  authLoading: true,
  filters: { type: '', severity: '', status: '', ward: '' },
  notification: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload, isAuthenticated: true, authLoading: false }
    case 'LOGOUT': {
      clearToken()
      return { ...initialState, authLoading: false }
    }
    case 'AUTH_LOADED':
      return { ...state, authLoading: false }
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
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('civiclens_token')
    if (!token) {
      dispatch({ type: 'AUTH_LOADED' })
      return
    }
    api.auth.me()
      .then(user => dispatch({ type: 'LOGIN', payload: user }))
      .catch(() => {
        clearToken()
        dispatch({ type: 'AUTH_LOADED' })
      })
  }, [])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
