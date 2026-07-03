import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { calculateTrustScore } from '../utils/trustScoreCalculator'
import TrustBadge from '../components/TrustBadge'

const RANK_STYLES = {
  0: { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-200', badge: 'text-yellow-500', medal: '🥇' },
  1: { bg: 'from-surface-50 to-surface-100', border: 'border-surface-200', badge: 'text-surface-400', medal: '🥈' },
  2: { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', badge: 'text-orange-500', medal: '🥉' },
}

const BAR_MAXES = { filed: 30, verified: 30, resolved: 20, consistency: 10, age: 10 }

export default function LeaderboardPage() {
  const { state } = useApp()

  const leaderboard = useMemo(() => {
    const citizens = {}
    state.reports.forEach(r => {
      if (!citizens[r.citizenId]) citizens[r.citizenId] = { id: r.citizenId, name: r.citizenName }
    })
    return Object.values(citizens)
      .map(c => ({ ...c, ...calculateTrustScore(c.id, state.reports) }))
      .sort((a, b) => b.score - a.score)
  }, [state.reports])

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-surface-800 mb-1">Citizen Leaderboard</h1>
        <p className="text-sm text-surface-500">Civic champions ranked by trust score</p>
      </div>

      <div className="space-y-3">
        {leaderboard.map((c, i) => {
          const rank = RANK_STYLES[i]
          return (
            <div key={c.id}
              className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up ${
                rank
                  ? `bg-gradient-to-r ${rank.bg} ${rank.border} shadow-md`
                  : 'glass-card'
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex items-center gap-4">
                <span className={`text-3xl font-black w-12 text-center ${rank?.badge || 'text-surface-300'}`}>
                  {rank?.medal || `#${i + 1}`}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-surface-800">{c.name}</h3>
                    <TrustBadge score={c.score} level={c.level} />
                  </div>
                  <div className="flex gap-4 text-xs text-surface-400 font-medium">
                    <span>{c.totalReports} reports filed</span>
                    <span>{c.resolvedReports} resolved</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black gradient-text">{c.score}</p>
                  <p className="text-[10px] text-surface-400 font-medium">trust score</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-3">
                {Object.entries(c.breakdown).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="w-full bg-surface-100 rounded-full h-2 mb-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-civic-400 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${(val / BAR_MAXES[key]) * 100}%` }} />
                    </div>
                    <p className="text-[9px] text-surface-400 capitalize font-medium">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
