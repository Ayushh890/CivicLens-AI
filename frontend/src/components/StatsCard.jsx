const COLOR_MAP = {
  'text-civic-400': { bg: 'from-civic-400 to-emerald-400', light: 'bg-civic-50', text: 'text-civic-600' },
  'text-red-400': { bg: 'from-red-400 to-rose-400', light: 'bg-red-50', text: 'text-red-600' },
  'text-orange-400': { bg: 'from-orange-400 to-amber-400', light: 'bg-orange-50', text: 'text-orange-600' },
  'text-green-400': { bg: 'from-green-400 to-emerald-400', light: 'bg-green-50', text: 'text-green-600' },
  'text-yellow-400': { bg: 'from-yellow-400 to-amber-400', light: 'bg-yellow-50', text: 'text-yellow-600' },
}

export default function StatsCard({ icon, label, value, subtext, color = 'text-civic-400' }) {
  const c = COLOR_MAP[color] || COLOR_MAP['text-civic-400']
  return (
    <div className="glass-card p-5 card-hover group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${c.light} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
          <p className="text-xs text-surface-500 font-medium">{label}</p>
          {subtext && <p className="text-[10px] text-surface-400">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}
