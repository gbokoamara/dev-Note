
import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, FolderOpen } from "lucide-react"
import { useProjects } from "../hooks/useProjects"
import { Modal } from "../components/Modal"
import { ProjectForm } from "../components/ProjectForm"
import { ProgressBar } from "../components/ProgressBar"
import { PROJECT_STATUS, formatDate } from "../utils/labels"

const TABS = [
  { value: "", label: "Tous" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "TODO", label: "À faire" },
  { value: "PAUSED", label: "En pause" },
  { value: "DONE", label: "Terminés" },
]

export const Projects = () => {
  const [filter, setFilter] = useState("")
  const [adding, setAdding] = useState(false)
  const { projects, loading, error, addProject } = useProjects(filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Projets</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold">
          <Plus size={18} /> <span className="hidden sm:inline">Nouveau projet</span>
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
      {!loading && !error && projects.length === 0 && <p className="text-soft">Aucun projet ici pour l'instant.</p>}

      <ul className="space-y-3">
        {projects.map((p) => {
          const status = PROJECT_STATUS[p.status]
          return (
            <li key={p.id}>
              <Link to={`/projects/${p.id}`} className="block rounded-2xl bg-card p-4 transition hover:ring-1 hover:ring-brand">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/20 text-brand">
                    <FolderOpen size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{p.title}</p>
                      <span className={`rounded-full px-3 py-1 text-xs ${status?.style}`}>{status?.label}</span>
                    </div>
                    {p.description && <p className="truncate text-sm text-soft">{p.description}</p>}
                    <div className="mt-3"><ProgressBar value={p.progress} /></div>
                    <p className="mt-1 text-xs text-soft">
                      {p.doneCount}/{p.tasksCount} tâches
                      {p.deadline && ` · échéance ${formatDate(p.deadline)}`}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {adding && (
        <Modal title="Nouveau projet" onClose={() => setAdding(false)}>
          <ProjectForm onSubmit={addProject} onClose={() => setAdding(false)} />
        </Modal>
      )}
    </div>
  )
}