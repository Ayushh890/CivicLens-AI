import { Link } from 'react-router-dom'
import { ISSUE_TYPES, STATUSES } from '../utils/constants'
import SeverityBadge from './SeverityBadge'

export default function ReportCard({ report }) {
  const type = ISSUE_TYPES[report.issueType] || { icon: '📋', label: report.issueType }
  const status = STATUSES[report.status] || { label: report.status }

  return (
    <Link to={`/report/${report.id}`}
      className="block p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-civic-600/50 transition-all hover:shadow-lg hover:shadow-civic-900/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{type.icon}</span>
            <h3 className="text-sm font-semibold text-white truncate">{report.title}</h3>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{report.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge score={report.severityScore} />
            <span className={`text-xs px-2 py-0.5 rounded ${
              report.status === 'resolved' ? 'bg-green-900/30 text-green-400'
              : report.status === 'in_progress' ? 'bg-orange-900/30 text-orange-400'
              : 'bg-gray-800 text-gray-400'
            }`}>{status.label}</span>
            <span className="text-xs text-gray-600">{type.label}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-gray-600">{report.id}</p>
          <p className="text-[10px] text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  )
}
