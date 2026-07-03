import { useState } from 'react'
import { generateComplaint } from '../utils/complaintGenerator'

export default function ComplaintPreview({ report }) {
  const [lang, setLang] = useState('en')
  const [copied, setCopied] = useState(false)

  if (!report) return null
  const complaint = generateComplaint(report, lang)

  const copy = () => {
    navigator.clipboard.writeText(complaint.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([complaint.body], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `complaint-${report.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-surface-700 flex items-center gap-2">
          <span>📄</span> Generated Complaint
        </h3>
        <div className="flex gap-1 bg-surface-100 rounded-xl p-1">
          <button onClick={() => setLang('en')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${lang === 'en' ? 'bg-white text-civic-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
            English
          </button>
          <button onClick={() => setLang('hi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${lang === 'hi' ? 'bg-white text-civic-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
            Hindi
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 max-h-64 overflow-y-auto">
        <p className="text-xs text-surface-600 whitespace-pre-line font-mono leading-relaxed">{complaint.body}</p>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={copy}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 active:scale-95 ${
            copied
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
              : 'bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-200'
          }`}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <button onClick={download}
          className="flex-1 py-2.5 text-sm font-semibold bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-xl border border-surface-200 transition-all duration-300 active:scale-95">
          Download
        </button>
      </div>
    </div>
  )
}
