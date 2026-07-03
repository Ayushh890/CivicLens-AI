export function calculateTrustScore(citizenId, reports) {
  const myReports = reports.filter(r => r.citizenId === citizenId)
  if (myReports.length === 0) return { score: 10, level: 'New', breakdown: {} }

  const filed = Math.min(30, myReports.length * 3)
  const verified = Math.min(30, myReports.filter(r => ['verified', 'assigned', 'in_progress', 'resolved'].includes(r.status)).length * 5)
  const resolved = Math.min(20, myReports.filter(r => r.status === 'resolved').length * 4)
  const consistency = Math.min(10, myReports.length >= 5 ? 10 : myReports.length * 2)
  const age = 10

  const score = Math.min(100, filed + verified + resolved + consistency + age)

  let level = 'New'
  if (score >= 80) level = 'Champion'
  else if (score >= 60) level = 'Verified'
  else if (score >= 40) level = 'Trusted'
  else if (score >= 20) level = 'Active'

  return {
    score,
    level,
    breakdown: { filed, verified, resolved, consistency, age },
    totalReports: myReports.length,
    resolvedReports: myReports.filter(r => r.status === 'resolved').length,
  }
}

export const TRUST_LEVELS = {
  New: { color: 'text-gray-400', bg: 'bg-gray-700', icon: '🌱' },
  Active: { color: 'text-blue-400', bg: 'bg-blue-900/30', icon: '⭐' },
  Trusted: { color: 'text-cyan-400', bg: 'bg-cyan-900/30', icon: '🛡️' },
  Verified: { color: 'text-purple-400', bg: 'bg-purple-900/30', icon: '✅' },
  Champion: { color: 'text-yellow-400', bg: 'bg-yellow-900/30', icon: '🏆' },
}
