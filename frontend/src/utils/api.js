const BASE = '/api'

function getToken() {
  return localStorage.getItem('civiclens_token')
}

export function setToken(token) {
  localStorage.setItem('civiclens_token', token)
}

export function clearToken() {
  localStorage.removeItem('civiclens_token')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)
  if (res.status === 401) {
    clearToken()
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  if (res.headers.get('content-type')?.includes('text/csv')) {
    return res.text()
  }
  return res.json()
}

const api = {
  auth: {
    login: (email, password) => request('POST', '/auth/login', { email, password }),
    register: (data) => request('POST', '/auth/register', data),
    me: () => request('GET', '/auth/me'),
  },
  reports: {
    list: (filters = {}) => {
      const params = new URLSearchParams()
      if (filters.type) params.set('type', filters.type)
      if (filters.status) params.set('status', filters.status)
      if (filters.ward) params.set('ward', filters.ward)
      if (filters.severity) params.set('severity', filters.severity)
      const qs = params.toString()
      return request('GET', `/reports${qs ? `?${qs}` : ''}`)
    },
    get: (id) => request('GET', `/reports/${id}`),
    create: (data) => request('POST', '/reports', data),
    updateStatus: (id, status) => request('PATCH', `/reports/${id}/status`, { status }),
    export: () => request('GET', '/reports/export'),
  },
  analyze: (data) => request('POST', '/analyze', data),
  stats: () => request('GET', '/stats'),
  leaderboard: () => request('GET', '/leaderboard'),
}

export default api
