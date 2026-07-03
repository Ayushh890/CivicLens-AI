import { ISSUE_TYPES } from '../utils/constants'

export default function PredictionAlert({ prediction }) {
  const type = ISSUE_TYPES[prediction.issueType]
  return (
    <div className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-yellow-300">{prediction.title}</h4>
            <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded-full">
              {prediction.confidence}% confidence
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{prediction.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{type?.icon} {prediction.reportCount} related reports</span>
            <span className="text-yellow-500">{prediction.action}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
