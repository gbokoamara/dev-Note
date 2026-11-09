
export const ProgressBar = ({ value = 0 }) => (
  <div className="flex items-center gap-3">
    <div className="h-2 flex-1 rounded-full bg-white/10">
      <div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${value}%` }} />
    </div>
    <span className="w-10 text-right text-xs text-soft">{value}%</span>
  </div>
)