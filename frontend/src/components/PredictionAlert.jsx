import { ISSUE_TYPES } from '../utils/constants'

export default function PredictionAlert({ prediction }) {
  const type = ISSUE_TYPES[prediction.issueType]
  return (
    <div className="relative overflow-hidden p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl card-hover animate-fade-in-up">
      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/30 rounded-full -translate-y-6 translate-x-6" />
      <div className="flex items-start gap-4 relative">
        <span className="text-2xl animate-float">⚠️</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-sm font-bold text-amber-800">{prediction.title}</h4>
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold border border-amber-200">
              {prediction.confidence}% confidence
            </span>
          </div>
          <p className="text-xs text-surface-600 mb-2.5">{prediction.description}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-surface-500 font-medium">{type?.icon} {prediction.reportCount} related reports</span>
            <span className="text-amber-600 font-semibold">{prediction.action}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
