import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setToken } from '../utils/api'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { token, user } = await api.auth.login(form.email, form.password)
      setToken(token)
      dispatch({ type: 'LOGIN', payload: user })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-surface-50 via-white to-civic-50/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-civic-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 inline-block animate-bounce-in">🏙️</span>
          <h1 className="text-3xl font-black text-surface-900 mb-1">
            CivicLens <span className="gradient-text">AI</span>
          </h1>
          <p className="text-surface-500 text-sm">Sign in to report and track civic issues</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          <h2 className="text-xl font-bold text-surface-800 text-center">Welcome Back</h2>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium animate-scale-in">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-surface-600 font-semibold mb-1.5 block">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com" required
              className="w-full p-3.5 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
          </div>

          <div>
            <label className="text-sm text-surface-600 font-semibold mb-1.5 block">Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Enter your password" required
              className="w-full p-3.5 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full gradient-btn py-3.5 text-base disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-surface-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-civic-600 hover:text-civic-700 font-semibold transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <div className="border-t border-surface-200 pt-4">
            <p className="text-[10px] text-surface-400 text-center mb-2">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button"
                onClick={() => setForm({ email: 'admin@civiclens.gov.in', password: 'admin123' })}
                className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-700 font-medium hover:bg-purple-100 transition-colors">
                🛡️ Admin Login
              </button>
              <button type="button"
                onClick={() => setForm({ email: '', password: '' })}
                className="p-2.5 bg-civic-50 border border-civic-200 rounded-xl text-xs text-civic-700 font-medium hover:bg-civic-100 transition-colors">
                👤 Register New
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
