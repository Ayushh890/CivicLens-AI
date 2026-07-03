import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const citizenLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/report', label: 'Report', icon: '📝' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/my-reports', label: 'My Reports', icon: '📋' },
  { to: '/leaderboard', label: 'Leaders', icon: '🏆' },
]

const adminLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/my-reports', label: 'All Reports', icon: '📋' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/leaderboard', label: 'Leaders', icon: '🏆' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const isAdmin = state.currentUser?.role === 'admin'
  const links = isAdmin ? adminLinks : citizenLinks
  const initials = state.currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  return (
    <nav className="glass-strong sticky top-0 z-[1000] animate-fade-in-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:animate-wiggle transition-transform">🏙️</span>
            <span className="text-xl font-extrabold gradient-text">CivicLens AI</span>
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
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full hover:bg-surface-100 transition-all duration-300">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                  isAdmin
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-br from-civic-500 to-emerald-500'
                }`}>
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-surface-800 leading-tight">{state.currentUser?.name}</p>
                  <p className="text-[10px] text-surface-400 leading-tight">{isAdmin ? '🛡️ Admin' : '👤 Citizen'}</p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-12 w-64 glass-strong rounded-2xl p-4 space-y-3 animate-fade-in-down shadow-2xl">
                  <div className="flex items-center gap-3 pb-3 border-b border-surface-200">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      isAdmin ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-civic-500 to-emerald-500'
                    }`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-800">{state.currentUser?.name}</p>
                      <p className="text-[10px] text-surface-500">{state.currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-surface-400">Role</span>
                      <span className={`font-semibold ${isAdmin ? 'text-purple-600' : 'text-civic-600'}`}>
                        {isAdmin ? '🛡️ Municipal Admin' : '👤 Citizen'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-surface-400">Pincode</span>
                      <span className="text-surface-700 font-mono font-semibold">{state.currentUser?.pincode}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-surface-400">ID</span>
                      <span className="text-surface-700 font-mono">{state.currentUser?.id}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

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
