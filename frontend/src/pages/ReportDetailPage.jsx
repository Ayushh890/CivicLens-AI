import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ISSUE_TYPES, DEPARTMENTS, ISSUE_TO_DEPARTMENT, STATUSES } from '../utils/constants'
import SeverityBadge from '../components/SeverityBadge'
import StatusTimeline from '../components/StatusTimeline'
import ComplaintPreview from '../components/ComplaintPreview'

const NEXT_STATUS = { submitted: 'verified', verified: 'assigned', assigned: 'in_progress', in_progress: 'resolved' }

export default function ReportDetailPage() {
  const { id } = useParams()
  const { state, dispatch } = useApp()
  const report = state.reports.find(r => r.id === id)

  if (!report) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <span className="text-5xl mb-4 inline-block">🔍</span>
        <p className="text-surface-500 font-medium text-lg">Report not found</p>
        <Link to="/my-reports" className="text-civic-600 hover:text-civic-700 text-sm mt-3 inline-block font-semibold">
          &larr; Back to reports
        </Link>
      </div>
    )
  }

  const type = ISSUE_TYPES[report.issueType] || { icon: '📋', label: report.issueType }
  const deptKey = ISSUE_TO_DEPARTMENT[report.issueType] || 'municipal'
  const dept = DEPARTMENTS[deptKey]

  const advanceStatus = () => {
    const next = NEXT_STATUS[report.status]
    if (!next) return
    const newHistory = [...(report.statusHistory || []), {
      status: next,
      timestamp: new Date().toISOString(),
      note: `Status updated to ${STATUSES[next].label}`
    }]
    dispatch({
      type: 'UPDATE_REPORT',
      payload: { id: report.id, status: next, statusHistory: newHistory, updatedAt: new Date().toISOString() }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <Link to="/my-reports" className="inline-flex items-center gap-1 text-sm text-civic-600 hover:text-civic-700 font-semibold transition-colors">
        &larr; Back to reports
      </Link>

      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-surface-800 mb-1 flex items-center gap-2">
              <span className="text-2xl">{type.icon}</span> {report.title}
            </h1>
            <p className="text-xs text-surface-400 font-mono">{report.id} | Filed by {report.citizenName}</p>
          </div>
          <SeverityBadge score={report.severityScore} />
        </div>

        <StatusTimeline currentStatus={report.status} statusHistory={report.statusHistory} />
      </div>

      {state.currentUser.role === 'admin' && report.status !== 'resolved' && (
        <button onClick={advanceStatus}
          className="w-full gradient-btn py-3.5 text-base animate-scale-in">
          Advance to: {STATUSES[NEXT_STATUS[report.status]]?.label}
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-[10px] text-surface-400 uppercase font-semibold tracking-wider mb-3">Description</h3>
          <p className="text-sm text-surface-700 leading-relaxed">{report.description}</p>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-[10px] text-surface-400 uppercase font-semibold tracking-wider mb-3">Details</h3>
          <div className="space-y-2.5 text-sm">
            <Row label="Type" value={type.label} />
            <Row label="Department" value={dept?.name} />
            <Row label="Contact" value={dept?.contact} />
            <Row label="Est. Response" value={report.estimatedResponse} />
            <Row label="Location" value={report.address} />
            <Row label="Ward" value={report.ward} />
            <Row label="Filed" value={new Date(report.createdAt).toLocaleString()} />
          </div>
        </div>
      </div>

      {report.photoData && (
        <div className="glass-card p-5">
          <h3 className="text-[10px] text-surface-400 uppercase font-semibold tracking-wider mb-3">Photo Evidence</h3>
          <img src={report.photoData} alt="Issue" className="w-full max-h-64 object-contain rounded-xl" />
        </div>
      )}

      {report.reasoning && (
        <div className="glass-card p-5">
          <h3 className="text-[10px] text-surface-400 uppercase font-semibold tracking-wider mb-3 flex items-center gap-2">
            <span>🤖</span> AI Analysis
          </h3>
          <p className="text-sm text-surface-600 whitespace-pre-line leading-relaxed">{report.reasoning}</p>
        </div>
      )}

      <ComplaintPreview report={report} />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-surface-100 last:border-0">
      <span className="text-surface-400 text-xs">{label}</span>
      <span className="text-surface-700 font-medium text-xs">{value}</span>
    </div>
  )
}
