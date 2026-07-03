const USERS_KEY = 'civiclens_users'
const SESSION_KEY = 'civiclens_session'

const VALID_PINCODES = Array.from({ length: 96 }, (_, i) => String(110001 + i))

const ADMIN_ACCESS_CODE = 'CIVIC2026'

function hashPassword(password, salt = '') {
  const str = salt + password + 'civiclens_salt_2026'
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return btoa(String(Math.abs(hash)))
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function seedAdminIfNeeded() {
  const users = getUsers()
  if (users.some(u => u.email === 'admin@civiclens.gov.in')) return
  users.push({
    id: 'ADM-001',
    name: 'Municipal Admin',
    email: 'admin@civiclens.gov.in',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    pincode: '110001',
    createdAt: new Date().toISOString(),
  })
  saveUsers(users)
}

seedAdminIfNeeded()

export function register({ name, email, password, pincode, role, adminCode }) {
  if (!name || !email || !password || !pincode) {
    return { success: false, error: 'All fields are required' }
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }
  if (!VALID_PINCODES.includes(pincode)) {
    return { success: false, error: 'Invalid pincode. Only New Delhi pincodes (110001–110096) are accepted' }
  }

  const users = getUsers()
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists' }
  }

  if (role === 'admin') {
    if (!adminCode || adminCode !== ADMIN_ACCESS_CODE) {
      return { success: false, error: 'Invalid admin access code' }
    }
  }

  const user = {
    id: role === 'admin' ? `ADM-${String(users.filter(u => u.role === 'admin').length + 1).padStart(3, '0')}` : `CIT-${String(users.filter(u => u.role === 'citizen').length + 1).padStart(3, '0')}`,
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: role || 'citizen',
    pincode,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  saveUsers(users)

  const session = { id: user.id, name: user.name, email: user.email, role: user.role, pincode: user.pincode }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { success: true, user: session }
}

export function login(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return { success: false, error: 'No account found with this email' }
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password' }
  }

  const session = { id: user.id, name: user.name, email: user.email, role: user.role, pincode: user.pincode }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { success: true, user: session }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch { return null }
}

export function isValidPincode(pincode) {
  return VALID_PINCODES.includes(pincode)
}

export { VALID_PINCODES }
