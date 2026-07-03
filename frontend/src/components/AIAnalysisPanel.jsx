import SeverityBadge from './SeverityBadge'
import { ISSUE_TYPES, DEPARTMENTS, ISSUE_TO_DEPARTMENT } from '../utils/constants'

export default function AIAnalysisPanel({ analysis }) {
  if (!analysis) return null

  const type = ISSUE_TYPES[analysis.issueType] || { icon: '📋', label: analysis.issueType }
  const deptKey = ISSUE_TO_DEPARTMENT[analysis.issueType] || 'municipal'
  const dept = DEPARTMENTS[deptKey]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-civic-200 bg-gradient-to-br from-civic-50 via-white to-emerald-50 p-6 animate-scale-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-civic-200/20 rounded-full -translate-y-10 translate-x-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/20 rounded-full translate-y-8 -translate-x-8" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl animate-float">🤖</span>
          <h3 className="text-sm font-bold text-civic-700">AI Analysis</h3>
          <span className="px-2 py-0.5 bg-civic-100 text-civic-600 rounded-full text-[10px] font-medium">Powered by CivicLens</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-surface-100 shadow-sm">
            <p className="text-[10px] text-surface-400 uppercase font-semibold tracking-wide mb-1">Issue Type</p>
            <p className="text-sm font-bold text-surface-800">{type.icon} {type.label}</p>
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-surface-100 shadow-sm">
            <p className="text-[10px] text-surface-400 uppercase font-semibold tracking-wide mb-1">Severity</p>
            <SeverityBadge score={analysis.severity.score} />
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-surface-100 shadow-sm">
            <p className="text-[10px] text-surface-400 uppercase font-semibold tracking-wide mb-1">Route To</p>
            <p className="text-sm font-bold text-surface-800">{dept?.name}</p>
            <p className="text-[10px] text-surface-400 mt-0.5">Est: {dept?.responseTime}</p>
          </div>
        </div>

        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-surface-100">
          <p className="text-[10px] text-surface-400 uppercase font-semibold tracking-wide mb-1">AI Reasoning</p>
          <p className="text-xs text-surface-600 whitespace-pre-line leading-relaxed">{analysis.reasoning}</p>
        </div>
      </div>
    </div>
  )
}
