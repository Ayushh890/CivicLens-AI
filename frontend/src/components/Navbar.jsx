import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report Issue' },
  { to: '/map', label: 'Map' },
  { to: '/my-reports', label: 'My Reports' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-[1000]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏙️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-civic-400 to-cyan-400 bg-clip-text text-transparent">
              CivicLens AI
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.to ? 'bg-civic-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => dispatch({ type: 'TOGGLE_ROLE' })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                state.currentUser.role === 'admin'
                  ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}>
              {state.currentUser.role === 'admin' ? '🛡️ Admin' : '👤 Citizen'}
            </button>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden pb-4 space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === l.to ? 'bg-civic-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>{l.label}</Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
