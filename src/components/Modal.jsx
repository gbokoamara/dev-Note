
import { X } from "lucide-react"

export const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
    <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="text-soft hover:text-white"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
)