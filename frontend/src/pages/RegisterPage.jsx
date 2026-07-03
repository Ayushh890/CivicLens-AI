import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setToken } from '../utils/api'
import { useApp } from '../context/AppContext'

const VALID_PINCODES = Array.from({ length: 96 }, (_, i) => String(110001 + i))

export default function RegisterPage() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    pincode: '', role: 'citizen', adminCode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pincodeValid, setPincodeValid] = useState(null)

  const handlePincodeChange = (value) => {
    setForm(f => ({ ...f, pincode: value }))
    if (value.length === 6) {
      setPincodeValid(VALID_PINCODES.includes(value))
    } else {
      setPincodeValid(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { token, user } = await api.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        pincode: form.pincode,
        role: form.role,
        adminCode: form.adminCode || undefined,
      })
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
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-civic-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 inline-block animate-bounce-in">🏙️</span>
          <h1 className="text-3xl font-black text-surface-900 mb-1">
            Join CivicLens <span className="gradient-text">AI</span>
          </h1>
          <p className="text-surface-500 text-sm">Create your account to start reporting</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-surface-800 text-center mb-1">Create Account</h2>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium animate-scale-in">
              {error}
            </div>
          )}

          <div className="flex gap-2 bg-surface-100 rounded-xl p-1">
            <button type="button"
              onClick={() => setForm(f => ({ ...f, role: 'citizen', adminCode: '' }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                form.role === 'citizen'
                  ? 'bg-white text-civic-700 shadow-md'
                  : 'text-surface-500 hover:text-surface-700'
              }`}>
              👤 Citizen
            </button>
            <button type="button"
              onClick={() => setForm(f => ({ ...f, role: 'admin' }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                form.role === 'admin'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-surface-500 hover:text-surface-700'
              }`}>
              🛡️ Municipal Admin
            </button>
          </div>

          <div>
            <label className="text-sm text-surface-600 font-semibold mb-1.5 block">Full Name</label>
            <input type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Enter your full name" required
              className="w-full p-3.5 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
          </div>

          <div>
            <label className="text-sm text-surface-600 font-semibold mb-1.5 block">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com" required
              className="w-full p-3.5 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-surface-600 font-semibold mb-1.5 block">Password</label>
              <input type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 chars" required minLength={6}
                className="w-full p-3.5 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
            </div>
            <div>
              <label className="text-sm text-surface-600 font-semibold mb-1.5 block">Confirm</label>
              <input type="password" value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Re-enter" required
                className={`w-full p-3.5 bg-white border rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-4 transition-all ${
                  form.confirmPassword && form.confirmPassword !== form.password
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-surface-200 focus:border-civic-400 focus:ring-civic-100'
                }`} />
            </div>
          </div>

          <div>
            <label className="text-sm text-surface-600 font-semibold mb-1.5 block">
              Locality Pincode
              {pincodeValid === true && <span className="text-emerald-500 ml-2 animate-scale-in">✓ Valid</span>}
              {pincodeValid === false && <span className="text-red-500 ml-2 animate-scale-in">✗ Invalid</span>}
            </label>
            <input type="text" value={form.pincode}
              onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 110001" required maxLength={6}
              className={`w-full p-3.5 bg-white border rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-4 transition-all font-mono tracking-wider ${
                pincodeValid === false
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : pincodeValid === true
                  ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
                  : 'border-surface-200 focus:border-civic-400 focus:ring-civic-100'
              }`} />
            <p className="text-[10px] text-surface-400 mt-1">New Delhi pincodes only (110001–110096)</p>
          </div>

          {form.role === 'admin' && (
            <div className="animate-fade-in-up">
              <label className="text-sm text-purple-600 font-semibold mb-1.5 block">Admin Access Code</label>
              <input type="password" value={form.adminCode}
                onChange={e => setForm(f => ({ ...f, adminCode: e.target.value }))}
                placeholder="Enter municipal access code" required
                className="w-full p-3.5 bg-purple-50/50 border border-purple-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all" />
              <p className="text-[10px] text-purple-400 mt-1">Contact your municipal office for the access code</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full py-3.5 text-base font-bold rounded-xl shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-60 ${
              form.role === 'admin'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-200 hover:from-purple-600 hover:to-indigo-600'
                : 'gradient-btn'
            }`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : form.role === 'admin' ? '🛡️ Register as Admin' : '👤 Register as Citizen'}
          </button>

          <p className="text-sm text-surface-500 text-center pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-civic-600 hover:text-civic-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
