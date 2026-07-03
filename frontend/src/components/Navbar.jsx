import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/report', label: 'Report', icon: '📝' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/my-reports', label: 'Reports', icon: '📋' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/leaderboard', label: 'Leaders', icon: '🏆' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <nav className="glass-strong sticky top-0 z-[1000] animate-fade-in-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:animate-wiggle transition-transform">🏙️</span>
            <span className="text-xl font-extrabold gradient-text">
              CivicLens AI
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-surface-100/80 rounded-2xl p-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  pathname === l.to
                    ? 'bg-white text-civic-700 shadow-md shadow-civic-100'
                    : 'text-surface-500 hover:text-civic-600 hover:bg-white/60'
                }`}>
                <span className="mr-1.5">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => dispatch({ type: 'TOGGLE_ROLE' })}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                state.currentUser.role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}>
              {state.currentUser.role === 'admin' ? '🛡️ Admin' : '👤 Citizen'}
            </button>
            <button onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-surface-500 hover:text-civic-600 hover:bg-civic-50 rounded-xl transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden pb-4 space-y-1 animate-fade-in-down">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === l.to
                    ? 'bg-civic-50 text-civic-700 font-semibold'
                    : 'text-surface-500 hover:text-civic-600 hover:bg-surface-50'
                }`}>
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
