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
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                done
                  ? 'bg-gradient-to-br from-civic-400 to-emerald-400 border-civic-300 text-white shadow-md shadow-civic-200'
                  : 'bg-surface-100 border-surface-200 text-surface-400'
              } ${isCurrent ? 'ring-4 ring-civic-100 scale-110' : ''}`}>
                {done ? '✓' : i + 1}
              </div>
              <p className={`text-[10px] mt-1.5 text-center font-medium ${done ? 'text-civic-600' : 'text-surface-400'}`}>
                {STATUSES[status].label}
              </p>
              {historyEntry && (
                <p className="text-[9px] text-surface-400">{new Date(historyEntry.timestamp).toLocaleDateString()}</p>
              )}
            </div>
            {i < ORDER.length - 1 && (
              <div className={`h-0.5 flex-1 -mx-1 rounded-full transition-colors duration-500 ${i < currentIdx ? 'bg-gradient-to-r from-civic-400 to-emerald-400' : 'bg-surface-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
