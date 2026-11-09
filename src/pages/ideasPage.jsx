
import { useState } from "react"
import { Plus, Pencil, Trash2, FolderPlus, Lightbulb } from "lucide-react"
import { useIdeas } from "../hooks/useIdeas"
import { Modal } from "../components/Modal"
import { IdeaForm } from "../components/IdeaForm"
import { ConvertForm } from "../components/ConvertForm"
import { IDEA_STATUS, formatDate } from "../utils/labels"

const TABS = [
  { value: "", label: "Toutes" },
  { value: "UNCLASSIFIED", label: "Non classées" },
  { value: "TO_STUDY", label: "À étudier" },
  { value: "CONVERTED", label: "Transformées" },
]

export const Ideas = () => {
  const [filter, setFilter] = useState("")
  const [modal, setModal] = useState(null) // { type: "add" | "edit" | "convert", idea? }
  const { ideas, loading, error, addIdea, updateIdea, deleteIdea, convertIdea } = useIdeas(filter)

  const close = () => setModal(null)

  const remove = async (idea) => {
    if (!window.confirm(`Supprimer « ${idea.title} » ?`)) return
    try {
      await deleteIdea(idea.id)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Idées</h1>
        <button onClick={() => setModal({ type: "add" })} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold">
          <Plus size={18} /> <span className="hidden sm:inline">Nouvelle idée</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${filter === t.value ? "bg-brand" : "bg-card text-soft"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-soft">Chargement…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && ideas.length === 0 && <p className="text-soft">Aucune idée ici pour l'instant.</p>}

      <ul className="space-y-3">
        {ideas.map((idea) => {
          const status = IDEA_STATUS[idea.status]
          const converted = idea.status === "CONVERTED"
          return (
            <li key={idea.id} className="flex items-start gap-4 rounded-2xl bg-card p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-400">
                <Lightbulb size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{idea.title}</p>
                {idea.description && <p className="truncate text-sm text-soft">{idea.description}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-3 py-1 ${status?.style}`}>{status?.label}</span>
                  {idea.category && <span className="text-soft">{idea.category}</span>}
                  <span className="text-soft">{formatDate(idea.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-1 text-soft">
                {!converted && (
                  <>
                    <button title="Transformer en projet" onClick={() => setModal({ type: "convert", idea })} className="rounded-lg p-2 hover:bg-white/10 hover:text-brand"><FolderPlus size={18} /></button>
                    <button title="Modifier" onClick={() => setModal({ type: "edit", idea })} className="rounded-lg p-2 hover:bg-white/10 hover:text-white"><Pencil size={18} /></button>
                  </>
                )}
                <button title="Supprimer" onClick={() => remove(idea)} className="rounded-lg p-2 hover:bg-white/10 hover:text-red-400"><Trash2 size={18} /></button>
              </div>
            </li>
          )
        })}
      </ul>

      {modal?.type === "add" && (
        <Modal title="Nouvelle idée" onClose={close}>
          <IdeaForm onSubmit={addIdea} onClose={close} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Modifier l'idée" onClose={close}>
          <IdeaForm idea={modal.idea} onSubmit={(v) => updateIdea(modal.idea.id, v)} onClose={close} />
        </Modal>
      )}
      {modal?.type === "convert" && (
        <Modal title={`Transformer « ${modal.idea.title} »`} onClose={close}>
          <ConvertForm onSubmit={(v) => convertIdea(modal.idea.id, v)} onClose={close} />
        </Modal>
      )}
    </div>
  )
}