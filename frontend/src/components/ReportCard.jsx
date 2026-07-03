import { Link } from 'react-router-dom'
import { ISSUE_TYPES, STATUSES } from '../utils/constants'
import SeverityBadge from './SeverityBadge'

const STATUS_STYLES = {
  resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  in_progress: 'bg-amber-50 text-amber-600 border-amber-200',
  submitted: 'bg-blue-50 text-blue-600 border-blue-200',
  verified: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  assigned: 'bg-purple-50 text-purple-600 border-purple-200',
}

export default function ReportCard({ report }) {
  const type = ISSUE_TYPES[report.issueType] || { icon: '📋', label: report.issueType }
  const status = STATUSES[report.status] || { label: report.status }

  return (
    <Link to={`/report/${report.id}`}
      className="block glass-card p-5 card-hover group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">{type.icon}</span>
            <h3 className="text-sm font-bold text-surface-800 truncate group-hover:text-civic-700 transition-colors">{report.title}</h3>
          </div>
          <p className="text-xs text-surface-500 line-clamp-2 mb-3">{report.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge score={report.severityScore} />
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${STATUS_STYLES[report.status] || 'bg-surface-50 text-surface-500 border-surface-200'}`}>
              {status.label}
            </span>
            <span className="text-xs text-surface-400 font-medium">{type.label}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-surface-400 font-mono">{report.id}</p>
          <p className="text-[10px] text-surface-400">{new Date(report.createdAt).toLocaleDateString()}</p>
          <span className="inline-block mt-2 text-civic-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
