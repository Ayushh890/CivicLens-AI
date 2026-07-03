import SeverityBadge from './SeverityBadge'
import { ISSUE_TYPES, DEPARTMENTS, ISSUE_TO_DEPARTMENT } from '../utils/constants'

export default function AIAnalysisPanel({ analysis }) {
  if (!analysis) return null

  const type = ISSUE_TYPES[analysis.issueType] || { icon: '📋', label: analysis.issueType }
  const deptKey = ISSUE_TO_DEPARTMENT[analysis.issueType] || 'municipal'
  const dept = DEPARTMENTS[deptKey]

  return (
    <div className="p-5 bg-gradient-to-br from-civic-900/40 to-cyan-900/30 rounded-xl border border-civic-800/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <h3 className="text-sm font-semibold text-civic-300">AI Analysis</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Issue Type</p>
          <p className="text-sm font-medium text-white">{type.icon} {type.label}</p>
        </div>
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Severity</p>
          <SeverityBadge score={analysis.severity.score} />
        </div>
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Route To</p>
          <p className="text-sm font-medium text-white">{dept?.name}</p>
          <p className="text-[10px] text-gray-500">Est: {dept?.responseTime}</p>
        </div>
      </div>

      <div className="p-3 bg-gray-800/30 rounded-lg">
        <p className="text-[10px] text-gray-500 uppercase mb-1">AI Reasoning</p>
        <p className="text-xs text-gray-300 whitespace-pre-line">{analysis.reasoning}</p>
      </div>
    </div>
  )
}
