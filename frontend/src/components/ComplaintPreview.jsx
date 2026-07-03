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
    <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300">Generated Complaint</h3>
        <div className="flex gap-2">
          <button onClick={() => setLang('en')}
            className={`px-2 py-1 text-xs rounded ${lang === 'en' ? 'bg-civic-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            English
          </button>
          <button onClick={() => setLang('hi')}
            className={`px-2 py-1 text-xs rounded ${lang === 'hi' ? 'bg-civic-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            Hindi
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 max-h-64 overflow-y-auto">
        <p className="text-xs text-gray-300 whitespace-pre-line font-mono leading-relaxed">{complaint.body}</p>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={copy}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            copied ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          }`}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={download}
          className="flex-1 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">
          Download
        </button>
      </div>
    </div>
  )
}
