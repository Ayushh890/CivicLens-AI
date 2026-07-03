import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReportIssuePage from './pages/ReportIssuePage'
import SmartMapPage from './pages/SmartMapPage'
import MyReportsPage from './pages/MyReportsPage'
import ReportDetailPage from './pages/ReportDetailPage'
import DashboardPage from './pages/DashboardPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && state.currentUser?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { state } = useApp()
  if (state.isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { state } = useApp()

  if (!state.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-civic-50/30 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-civic-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl" />
      </div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><SmartMapPage /></ProtectedRoute>} />
          <Route path="/my-reports" element={<ProtectedRoute><MyReportsPage /></ProtectedRoute>} />
          <Route path="/report/:id" element={<ProtectedRoute><ReportDetailPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
