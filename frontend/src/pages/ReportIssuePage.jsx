import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { analyzeIssue } from '../utils/aiAnalyzer'
import { routeToDepartment } from '../utils/departmentRouter'
import { findDuplicates } from '../utils/duplicateDetector'
import useGeolocation from '../hooks/useGeolocation'
import PhotoUpload from '../components/PhotoUpload'
import VoiceInput from '../components/VoiceInput'
import AIAnalysisPanel from '../components/AIAnalysisPanel'
import ReportCard from '../components/ReportCard'
import { WARDS } from '../utils/constants'

const STEPS = ['Describe', 'Location', 'AI Analysis', 'Submit']

export default function ReportIssuePage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { position } = useGeolocation()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ description: '', title: '', photo: null, latitude: null, longitude: null, address: '', ward: '' })
  const [analysis, setAnalysis] = useState(null)
  const [duplicates, setDuplicates] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (position) {
      setForm(f => ({ ...f, latitude: position.lat, longitude: position.lng }))
    }
  }, [position])

  const nextStep = () => {
    if (step === 0 && !form.description.trim()) return
    if (step === 0) {
      const result = analyzeIssue(form.description)
      setAnalysis(result)
      if (result?.suggestedTitle && !form.title) {
        setForm(f => ({ ...f, title: result.suggestedTitle }))
      }
    }
    if (step === 1) {
      const dupes = findDuplicates(
        { latitude: form.latitude, longitude: form.longitude, issueType: analysis?.issueType },
        state.reports
      )
      setDuplicates(dupes)
    }
    setStep(s => Math.min(s + 1, 3))
  }

  const submit = () => {
    if (submitting) return
    setSubmitting(true)

    const dept = routeToDepartment(analysis?.issueType)
    const report = {
      id: `RPT-${String(state.reports.length + 1).padStart(4, '0')}`,
      title: form.title || analysis?.suggestedTitle || 'Issue Report',
      description: form.description,
      issueType: analysis?.issueType || 'road_damage',
      severityScore: analysis?.severity?.score || 30,
      severityLevel: analysis?.severity?.level || 'medium',
      reasoning: analysis?.reasoning || '',
      department: dept?.key || 'municipal',
      status: 'submitted',
      latitude: form.latitude || 28.6139,
      longitude: form.longitude || 77.2090,
      address: form.address || 'New Delhi',
      ward: form.ward || 'Ward 1 - Connaught Place',
      citizenId: state.currentUser.id,
      citizenName: state.currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      estimatedResponse: dept?.estimatedResponse || '3-5 days',
      statusHistory: [{ status: 'submitted', timestamp: new Date().toISOString(), note: 'Report submitted' }],
      photoData: form.photo,
    }

    dispatch({ type: 'ADD_REPORT', payload: report })
    navigate(`/report/${report.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Report an Issue</h1>

      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                i <= step ? 'bg-civic-600 border-civic-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}>{i + 1}</div>
              <p className={`text-[10px] mt-1 ${i <= step ? 'text-civic-400' : 'text-gray-600'}`}>{s}</p>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? 'bg-civic-600' : 'bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Describe the issue</label>
            <textarea value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="E.g. There's a large pothole on the main road near the school..."
              className="w-full h-32 p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm resize-none focus:outline-none focus:border-civic-500" />
            <VoiceInput onTranscript={t => setForm(f => ({ ...f, description: f.description + ' ' + t }))} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Title (optional)</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Brief title for your report"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-civic-500" />
          </div>
          <PhotoUpload onPhoto={photo => setForm(f => ({ ...f, photo }))} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Location</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500">Latitude</label>
                <input type="number" step="any" value={form.latitude || ''}
                  onChange={e => setForm(f => ({ ...f, latitude: parseFloat(e.target.value) }))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Longitude</label>
                <input type="number" step="any" value={form.longitude || ''}
                  onChange={e => setForm(f => ({ ...f, longitude: parseFloat(e.target.value) }))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Address</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Street, landmark..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-civic-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ward</label>
            <select value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-civic-500">
              <option value="">Select ward</option>
              {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <AIAnalysisPanel analysis={analysis} />
          {duplicates.length > 0 && (
            <div className="p-4 bg-orange-900/20 border border-orange-800/30 rounded-xl">
              <h3 className="text-sm font-semibold text-orange-300 mb-2">
                Possible Duplicates ({duplicates.length})
              </h3>
              <p className="text-xs text-gray-400 mb-3">Similar reports found nearby. You can still submit yours.</p>
              <div className="space-y-2">
                {duplicates.map(d => (
                  <div key={d.id} className="text-xs bg-gray-800/50 p-2 rounded-lg">
                    <span className="text-white">{d.title}</span>
                    <span className="text-gray-500 ml-2">{d.distance}m away | {d.similarity}% match</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">Review & Submit</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400"><span className="text-gray-500">Title:</span> {form.title || analysis?.suggestedTitle}</p>
              <p className="text-gray-400"><span className="text-gray-500">Description:</span> {form.description.slice(0, 100)}...</p>
              <p className="text-gray-400"><span className="text-gray-500">Location:</span> {form.address || `${form.latitude}, ${form.longitude}`}</p>
              <p className="text-gray-400"><span className="text-gray-500">Ward:</span> {form.ward || 'Not selected'}</p>
              {form.photo && <img src={form.photo} alt="Issue" className="w-full h-32 object-cover rounded-lg mt-2" />}
            </div>
          </div>
          <AIAnalysisPanel analysis={analysis} />
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium">
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={nextStep}
            className="flex-1 px-6 py-3 bg-civic-600 hover:bg-civic-500 text-white rounded-xl font-semibold">
            Next
          </button>
        ) : (
          <button onClick={submit} disabled={submitting}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-semibold">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        )}
      </div>
    </div>
  )
}
