
import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useJournal } from "../hooks/useJournal"
import { Modal } from "../components/Modal"
import { JournalForm } from "../components/JournalForm"
import { formatDate, inputClass } from "../utils/labels"

const Section = ({ label, text }) =>
  text ? (
    <div>
      <p className="text-xs uppercase tracking-wide text-soft">{label}</p>
      <p className="whitespace-pre-line text-sm">{text}</p>
    </div>
  ) : null

export const Journal = () => {
  const [projectId, setProjectId] = useState("")
  const [modal, setModal] = useState(null) // { type: "add" } | { type: "edit", entry }
  const { entries, projects, loading, error, addEntry, updateEntry, deleteEntry } = useJournal(projectId)

  const close = () => setModal(null)

  const remove = async (entry) => {
    if (!window.confirm(`Supprimer l'entrée « ${entry.title} » ?`)) return
    try {
      await deleteEntry(entry.id)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Journal</h1>
        <button onClick={() => setModal({ type: "add" })} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold">
          <Plus size={18} /> <span className="hidden sm:inline">Nouvelle entrée</span>
        </button>
      </div>

      <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={`${inputClass} max-w-64`}>
        <option value="">Tous les projets</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>

      {loading && <p className="text-soft">Chargement…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && entries.length === 0 && (
        <p className="text-soft">Aucune entrée pour l'instant. Note ce que tu as fait aujourd'hui.</p>
      )}

      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="space-y-3 rounded-2xl bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{entry.title}</p>
                <p className="text-xs text-soft">
                  {formatDate(entry.createdAt)}
                  {entry.project && ` · ${entry.project.title}`}
                </p>
              </div>
              <div className="flex text-soft">
                <button title="Modifier" onClick={() => setModal({ type: "edit", entry })} className="rounded-lg p-2 hover:bg-white/10 hover:text-white"><Pencil size={18} /></button>
                <button title="Supprimer" onClick={() => remove(entry)} className="rounded-lg p-2 hover:bg-white/10 hover:text-red-400"><Trash2 size={18} /></button>
              </div>
            </div>
            <Section label="Travail réalisé" text={entry.achievements} />
            <Section label="Difficultés" text={entry.difficulties} />
            <Section label="Prochaine étape" text={entry.nextStep} />
          </li>
        ))}
      </ul>

      {modal?.type === "add" && (
        <Modal title="Nouvelle entrée" onClose={close}>
          <JournalForm projects={projects} onSubmit={addEntry} onClose={close} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Modifier l'entrée" onClose={close}>
          <JournalForm entry={modal.entry} projects={projects} onSubmit={(v) => updateEntry(modal.entry.id, v)} onClose={close} />
        </Modal>
      )}
    </div>
  )
}