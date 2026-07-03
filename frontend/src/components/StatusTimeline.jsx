import { STATUSES } from '../utils/constants'

const ORDER = ['submitted', 'verified', 'assigned', 'in_progress', 'resolved']

export default function StatusTimeline({ currentStatus, statusHistory = [] }) {
  const currentIdx = ORDER.indexOf(currentStatus)

  return (
    <div className="flex items-center gap-0">
      {ORDER.map((status, i) => {
        const done = i <= currentIdx
        const isCurrent = i === currentIdx
        const historyEntry = statusHistory.find(h => h.status === status)

        return (
          <div key={status} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                done ? 'bg-civic-600 border-civic-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'
              } ${isCurrent ? 'ring-2 ring-civic-400/50 scale-110' : ''}`}>
                {done ? '✓' : i + 1}
              </div>
              <p className={`text-[10px] mt-1 text-center ${done ? 'text-civic-400' : 'text-gray-600'}`}>
                {STATUSES[status].label}
              </p>
              {historyEntry && (
                <p className="text-[9px] text-gray-600">{new Date(historyEntry.timestamp).toLocaleDateString()}</p>
              )}
            </div>
            {i < ORDER.length - 1 && (
              <div className={`h-0.5 flex-1 -mx-1 ${i < currentIdx ? 'bg-civic-600' : 'bg-gray-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
