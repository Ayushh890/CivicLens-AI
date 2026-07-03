import { TRUST_LEVELS } from '../utils/trustScoreCalculator'

export default function TrustBadge({ score, level }) {
  const tl = TRUST_LEVELS[level] || TRUST_LEVELS.New
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tl.bg} ${tl.color}`}>
      {tl.icon} {level} ({score})
    </span>
  )
}
