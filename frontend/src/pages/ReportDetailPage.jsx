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
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-400">Report not found</p>
        <Link to="/my-reports" className="text-civic-400 hover:text-civic-300 text-sm mt-2 inline-block">Back to reports</Link>
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
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/my-reports" className="text-sm text-civic-400 hover:text-civic-300">Back to reports</Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">
            {type.icon} {report.title}
          </h1>
          <p className="text-xs text-gray-500">{report.id} | Filed by {report.citizenName}</p>
        </div>
        <SeverityBadge score={report.severityScore} />
      </div>

      <StatusTimeline currentStatus={report.status} statusHistory={report.statusHistory} />

      {state.currentUser.role === 'admin' && report.status !== 'resolved' && (
        <button onClick={advanceStatus}
          className="w-full py-3 bg-civic-600 hover:bg-civic-500 text-white rounded-xl font-semibold">
          Advance to: {STATUSES[NEXT_STATUS[report.status]]?.label}
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-xs text-gray-500 uppercase mb-2">Description</h3>
          <p className="text-sm text-gray-300">{report.description}</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-xs text-gray-500 uppercase mb-2">Details</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-400"><span className="text-gray-600">Type:</span> {type.label}</p>
            <p className="text-gray-400"><span className="text-gray-600">Department:</span> {dept?.name}</p>
            <p className="text-gray-400"><span className="text-gray-600">Contact:</span> {dept?.contact}</p>
            <p className="text-gray-400"><span className="text-gray-600">Est. Response:</span> {report.estimatedResponse}</p>
            <p className="text-gray-400"><span className="text-gray-600">Location:</span> {report.address}</p>
            <p className="text-gray-400"><span className="text-gray-600">Ward:</span> {report.ward}</p>
            <p className="text-gray-400"><span className="text-gray-600">Filed:</span> {new Date(report.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {report.photoData && (
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-xs text-gray-500 uppercase mb-2">Photo Evidence</h3>
          <img src={report.photoData} alt="Issue" className="w-full max-h-64 object-contain rounded-lg" />
        </div>
      )}

      {report.reasoning && (
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-xs text-gray-500 uppercase mb-2">AI Analysis</h3>
          <p className="text-sm text-gray-300 whitespace-pre-line">{report.reasoning}</p>
        </div>
      )}

      <ComplaintPreview report={report} />
    </div>
  )
}
