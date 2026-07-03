import { getSeverityLevel, SEVERITY_LEVELS } from '../utils/constants'

const STYLES = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

const DOT_STYLES = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500 animate-pulse',
}

export default function SeverityBadge({ score }) {
  const level = getSeverityLevel(score)
  const { label } = SEVERITY_LEVELS[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STYLES[level]} transition-all duration-300`}>
      <span className={`w-2 h-2 rounded-full ${DOT_STYLES[level]}`} />
      {label} ({score})
    </span>
  )
}
