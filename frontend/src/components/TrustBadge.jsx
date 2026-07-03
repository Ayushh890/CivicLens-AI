import { TRUST_LEVELS } from '../utils/trustScoreCalculator'

const BADGE_STYLES = {
  New: 'bg-surface-100 text-surface-600 border-surface-200',
  Active: 'bg-blue-50 text-blue-700 border-blue-200',
  Trusted: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Verified: 'bg-purple-50 text-purple-700 border-purple-200',
  Champion: 'bg-amber-50 text-amber-700 border-amber-200',
}

export default function TrustBadge({ score, level }) {
  const tl = TRUST_LEVELS[level] || TRUST_LEVELS.New
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${BADGE_STYLES[level] || BADGE_STYLES.New}`}>
      {tl.icon} {level} ({score})
    </span>
  )
}
