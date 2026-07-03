export default function StatsCard({ icon, label, value, subtext, color = 'text-civic-400' }) {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
          {subtext && <p className="text-[10px] text-gray-600">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}
