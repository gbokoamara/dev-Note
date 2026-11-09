
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pencil, Trash2, Plus, Circle, CheckCircle2 } from "lucide-react"
import { useProjectDetail } from "../hooks/useProjectDetails"
import { Modal } from "../components/Modal"
import { ProjectForm } from "../components/ProjectForm"
import { TaskForm } from "../components/TaskForm"
import { ProgressBar } from "../components/ProgressBar"
import { PRIORITY, PROJECT_STATUS, formatDate, inputClass } from "../utils/labels"

export const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null) // { type: "project" | "addTask" | "editTask", task? }
  const {
    project, loading, error, actionError,
    updateProject, changeStatus, removeProject,
    addTask, updateTask, toggleTask, removeTask,
  } = useProjectDetail(id)

  const close = () => setModal(null)

  if (loading) return <p className="text-soft">Chargement…</p>
  if (error) return <p className="text-red-400">{error}</p>

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer le projet « ${project.title} » et ses tâches ?`)) return
    if (await removeProject()) navigate("/projects")
  }

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-soft hover:text-white">
        <ArrowLeft size={16} /> Projets
      </Link>

      <div className="rounded-2xl bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.description && <p className="text-soft">{project.description}</p>}
          </div>
          <div className="flex gap-1 text-soft">
            <button title="Modifier" onClick={() => setModal({ type: "project" })} className="rounded-lg p-2 hover:bg-white/10 hover:text-white"><Pencil size={18} /></button>
            <button title="Supprimer" onClick={handleDelete} className="rounded-lg p-2 hover:bg-white/10 hover:text-red-400"><Trash2 size={18} /></button>
          </div>
        </div>

        {project.objective && <p className="text-sm"><span className="text-soft">Objectif : </span>{project.objective}</p>}
        <p className="text-sm text-soft">
          {project.startDate && `Début ${formatDate(project.startDate)}`}
          {project.deadline && ` · Échéance ${formatDate(project.deadline)}`}
        </p>

        <select value={project.status} onChange={(e) => changeStatus(e.target.value)} className={`${inputClass} max-w-48`}>
          {Object.entries(PROJECT_STATUS).map(([value, s]) => (
            <option key={value} value={value}>{s.label}</option>
          ))}
        </select>

        <div>
          <ProgressBar value={project.progress} />
          <p className="mt-1 text-xs text-soft">{project.doneCount}/{project.tasksCount} tâches terminées</p>
        </div>
      </div>

      {actionError && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{actionError}</p>}

      <section className="rounded-2xl bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tâches</h2>
          <button onClick={() => setModal({ type: "addTask" })} className="flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {project.tasks.length === 0 && <p className="text-sm text-soft">Découpe ton projet en petites tâches.</p>}

        <ul className="divide-y divide-white/5">
          {project.tasks.map((task) => {
            const done = task.status === "DONE"
            const priority = PRIORITY[task.priority]
            return (
              <li key={task.id} className="flex items-center gap-3 py-3">
                <button onClick={() => toggleTask(task.id)} className={done ? "text-emerald-400" : "text-soft hover:text-brand"}>
                  {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={done ? "text-soft line-through" : ""}>{task.title}</p>
                  {task.description && <p className="truncate text-xs text-soft">{task.description}</p>}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${priority?.style}`}>{priority?.label}</span>
                <div className="flex text-soft">
                  <button title="Modifier" onClick={() => setModal({ type: "editTask", task })} className="rounded-lg p-1.5 hover:text-white"><Pencil size={16} /></button>
                  <button title="Supprimer" onClick={() => removeTask(task.id)} className="rounded-lg p-1.5 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {modal?.type === "project" && (
        <Modal title="Modifier le projet" onClose={close}>
          <ProjectForm project={project} onSubmit={updateProject} onClose={close} />
        </Modal>
      )}
      {modal?.type === "addTask" && (
        <Modal title="Nouvelle tâche" onClose={close}>
          <TaskForm onSubmit={addTask} onClose={close} />
        </Modal>
      )}
      {modal?.type === "editTask" && (
        <Modal title="Modifier la tâche" onClose={close}>
          <TaskForm task={modal.task} onSubmit={(v) => updateTask(modal.task.id, v)} onClose={close} />
        </Modal>
      )}
    </div>
  )
}