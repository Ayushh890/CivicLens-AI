import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReportIssuePage from './pages/ReportIssuePage'
import SmartMapPage from './pages/SmartMapPage'
import MyReportsPage from './pages/MyReportsPage'
import ReportDetailPage from './pages/ReportDetailPage'
import DashboardPage from './pages/DashboardPage'
import LeaderboardPage from './pages/LeaderboardPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/map" element={<SmartMapPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
          <Route path="/report/:id" element={<ReportDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>
    </div>
  )
}
