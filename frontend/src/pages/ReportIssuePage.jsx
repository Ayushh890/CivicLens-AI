import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { analyzeIssue } from '../utils/aiAnalyzer'
import { findDuplicates } from '../utils/duplicateDetector'
import useGeolocation from '../hooks/useGeolocation'
import PhotoUpload from '../components/PhotoUpload'
import VoiceInput from '../components/VoiceInput'
import AIAnalysisPanel from '../components/AIAnalysisPanel'
import { WARDS } from '../utils/constants'
import api from '../utils/api'

const STEPS = ['Describe', 'Location', 'AI Analysis', 'Submit']

export default function ReportIssuePage() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { position } = useGeolocation()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ description: '', title: '', photo: null, latitude: null, longitude: null, address: '', ward: '' })
  const [analysis, setAnalysis] = useState(null)
  const [duplicates, setDuplicates] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [existingReports, setExistingReports] = useState([])

  useEffect(() => {
    if (position) setForm(f => ({ ...f, latitude: position.lat, longitude: position.lng }))
  }, [position])

  useEffect(() => {
    api.reports.list().then(setExistingReports).catch(() => {})
  }, [])

  const nextStep = () => {
    if (step === 0 && !form.description.trim()) return
    if (step === 0) {
      const result = analyzeIssue(form.description)
      setAnalysis(result)
      if (result?.suggestedTitle && !form.title) setForm(f => ({ ...f, title: result.suggestedTitle }))
    }
    if (step === 1) {
      const dupes = findDuplicates(
        { latitude: form.latitude, longitude: form.longitude, issueType: analysis?.issueType },
        existingReports
      )
      setDuplicates(dupes)
    }
    setStep(s => Math.min(s + 1, 3))
  }

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const report = await api.reports.create({
        title: form.title || analysis?.suggestedTitle || 'Issue Report',
        description: form.description,
        latitude: form.latitude || 28.6139,
        longitude: form.longitude || 77.2090,
        address: form.address || 'New Delhi',
        ward: form.ward || 'Ward 1 - Connaught Place',
        photoData: form.photo || null,
      })
      navigate(`/report/${report.id}`)
    } catch (err) {
      setSubmitting(false)
      alert(err.message || 'Failed to submit report')
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <h1 className="text-2xl font-bold text-surface-800 mb-2">Report an Issue</h1>
      <p className="text-sm text-surface-500 mb-6">Help make your city better by reporting civic issues</p>

      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                i <= step
                  ? 'bg-gradient-to-br from-civic-400 to-emerald-400 border-civic-300 text-white shadow-md shadow-civic-200'
                  : 'bg-surface-100 border-surface-200 text-surface-400'
              } ${i === step ? 'ring-4 ring-civic-100 scale-110' : ''}`}>{i + 1}</div>
              <p className={`text-[10px] mt-1.5 font-medium ${i <= step ? 'text-civic-600' : 'text-surface-400'}`}>{s}</p>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-gradient-to-r from-civic-400 to-emerald-400' : 'bg-surface-200'}`} />}
          </div>
        ))}
      </div>

      <div className="animate-fade-in" key={step}>
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-surface-600 font-semibold mb-2 block">Describe the issue</label>
              <textarea value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="E.g. There's a large pothole on the main road near the school..."
                className="w-full h-32 p-4 bg-white border border-surface-200 rounded-2xl text-surface-800 text-sm resize-none focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
              <div className="mt-2">
                <VoiceInput onTranscript={t => setForm(f => ({ ...f, description: f.description + ' ' + t }))} />
              </div>
            </div>
            <div>
              <label className="text-sm text-surface-600 font-semibold mb-2 block">Title (optional)</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Brief title for your report"
                className="w-full p-4 bg-white border border-surface-200 rounded-2xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
            </div>
            <PhotoUpload onPhoto={photo => setForm(f => ({ ...f, photo }))} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="glass-card p-5">
              <p className="text-sm text-surface-600 font-semibold mb-3">Location</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-surface-400 font-medium uppercase">Latitude</label>
                  <input type="number" step="any" value={form.latitude || ''}
                    onChange={e => setForm(f => ({ ...f, latitude: parseFloat(e.target.value) }))}
                    className="w-full p-3 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100" />
                </div>
                <div>
                  <label className="text-[10px] text-surface-400 font-medium uppercase">Longitude</label>
                  <input type="number" step="any" value={form.longitude || ''}
                    onChange={e => setForm(f => ({ ...f, longitude: parseFloat(e.target.value) }))}
                    className="w-full p-3 bg-white border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-surface-600 font-semibold mb-2 block">Address</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Street, landmark..."
                className="w-full p-4 bg-white border border-surface-200 rounded-2xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all" />
            </div>
            <div>
              <label className="text-sm text-surface-600 font-semibold mb-2 block">Ward</label>
              <select value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
                className="w-full p-4 bg-white border border-surface-200 rounded-2xl text-surface-800 text-sm focus:outline-none focus:border-civic-400 focus:ring-4 focus:ring-civic-100 transition-all cursor-pointer">
                <option value="">Select ward</option>
                {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <AIAnalysisPanel analysis={analysis} />
            {duplicates.length > 0 && (
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl animate-scale-in">
                <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <span>🔍</span> Possible Duplicates ({duplicates.length})
                </h3>
                <p className="text-xs text-surface-500 mb-3">Similar reports found nearby. You can still submit yours.</p>
                <div className="space-y-2">
                  {duplicates.map(d => (
                    <div key={d.id} className="text-xs bg-white/80 p-3 rounded-xl border border-amber-100">
                      <span className="text-surface-800 font-medium">{d.title}</span>
                      <span className="text-surface-400 ml-2">{d.distance}m away | {d.similarity}% match</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-surface-800 mb-4 flex items-center gap-2">
                <span>📋</span> Review & Submit
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-surface-100">
                  <span className="text-surface-500">Title</span>
                  <span className="text-surface-800 font-medium">{form.title || analysis?.suggestedTitle}</span>
                </div>
                <div className="py-2 border-b border-surface-100">
                  <span className="text-surface-500 block mb-1">Description</span>
                  <span className="text-surface-700 text-xs">{form.description.slice(0, 150)}...</span>
                </div>
                <div className="flex justify-between py-2 border-b border-surface-100">
                  <span className="text-surface-500">Location</span>
                  <span className="text-surface-800 font-medium">{form.address || `${form.latitude}, ${form.longitude}`}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-surface-500">Ward</span>
                  <span className="text-surface-800 font-medium">{form.ward || 'Not selected'}</span>
                </div>
                {form.photo && <img src={form.photo} alt="Issue" className="w-full h-32 object-cover rounded-xl mt-2" />}
              </div>
            </div>
            <AIAnalysisPanel analysis={analysis} />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-6 py-3 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-xl font-semibold transition-all duration-300 active:scale-95">
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={nextStep} className="flex-1 gradient-btn px-6 py-3.5 text-base">
            Next Step
          </button>
        ) : (
          <button onClick={submit} disabled={submitting}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-200 transition-all duration-300 active:scale-95">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        )}
      </div>
    </div>
  )
}
