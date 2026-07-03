import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { calculateTrustScore } from '../utils/trustScoreCalculator'
import TrustBadge from '../components/TrustBadge'

export default function LeaderboardPage() {
  const { state } = useApp()

  const leaderboard = useMemo(() => {
    const citizens = {}
    state.reports.forEach(r => {
      if (!citizens[r.citizenId]) {
        citizens[r.citizenId] = { id: r.citizenId, name: r.citizenName }
      }
    })

    return Object.values(citizens)
      .map(c => ({ ...c, ...calculateTrustScore(c.id, state.reports) }))
      .sort((a, b) => b.score - a.score)
  }, [state.reports])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Citizen Leaderboard</h1>
      <p className="text-sm text-gray-400">Civic champions ranked by trust score. File reports, get verified, help resolve issues to climb the ranks.</p>

      <div className="space-y-3">
        {leaderboard.map((c, i) => (
          <div key={c.id}
            className={`p-4 rounded-xl border transition-colors ${
              i === 0 ? 'bg-yellow-900/10 border-yellow-800/30' :
              i === 1 ? 'bg-gray-800/50 border-gray-700' :
              i === 2 ? 'bg-orange-900/10 border-orange-800/30' :
              'bg-gray-900 border-gray-800'
            }`}>
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-bold w-10 text-center ${
                i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-600'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  <TrustBadge score={c.score} level={c.level} />
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{c.totalReports} reports</span>
                  <span>{c.resolvedReports} resolved</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-civic-400">{c.score}</p>
                <p className="text-[10px] text-gray-600">trust score</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {Object.entries(c.breakdown).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                    <div className="h-full bg-civic-600 rounded-full"
                      style={{ width: `${(val / (key === 'consistency' || key === 'age' ? 10 : key === 'resolved' ? 20 : 30)) * 100}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-600 capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
