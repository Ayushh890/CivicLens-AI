import { getSeverityLevel, SEVERITY_LEVELS } from '../utils/constants'

export default function SeverityBadge({ score }) {
  const level = getSeverityLevel(score)
  const { label, color } = SEVERITY_LEVELS[level]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}20`, color }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label} ({score})
    </span>
  )
}
