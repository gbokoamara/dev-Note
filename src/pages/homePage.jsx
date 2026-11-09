
import { Lightbulb, FolderOpen, CheckCircle2, Plus } from "lucide-react"
import { useDashboard } from "../hooks/useDashboard"
import { ACTIVITY_LABEL, PROJECT_STATUS, formatDate } from "../utils/labels"
import { Modal } from "../components/Modal"
import { IdeaForm } from "../components/IdeaForm"
import { useState } from "react"

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-card p-5">
    <div className={`grid h-12 w-12 place-items-center rounded-full ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm text-soft">{label}</p>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </div>
  </div>
)

export const Home = () => {
  const [adding, setAdding] = useState(false)
  const { stats, recentProjects, recentActivities, loading, error, addIdea } = useDashboard()
//   const { stats, recentProjects, recentActivities, loading, error } = useDashboard()

  if (loading) return <p className="text-soft">Chargement…</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <div className="space-y-6">
      {/* 3. Remplace le bloc du titre par un titre + bouton */}
      <div className="flex items-start justify-between gap-3">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
            <p className="text-soft">Voici un aperçu de ton activité.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold">
            <Plus size={18} /> <span className="hidden sm:inline">Nouvelle idée</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Lightbulb} label="Idées enregistrées" value={stats?.ideas} color="bg-brand/20 text-brand" />
        <StatCard icon={FolderOpen} label="Projets en cours" value={stats?.projects.inProgress} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={CheckCircle2} label="Projets terminés" value={stats?.projects.done} color="bg-emerald-500/20 text-emerald-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Mes projets</h2>
          {recentProjects.length === 0 && <p className="text-soft text-sm">Aucun projet pour l'instant.</p>}
          <ul className="divide-y divide-white/5">
            {recentProjects.map((p) => {
              const status = PROJECT_STATUS[p.status]
              return (
                <li key={p.id} className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{p.title}</p>
                    <span className={`rounded-full px-3 py-1 text-xs ${status?.style}`}>{status?.label}</span>
                  </div>
                  {p.description && <p className="truncate text-sm text-soft">{p.description}</p>}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-brand" style={{ width: `${p.progress ?? 0}%` }} />
                    </div>
                    <span className="w-10 text-right text-xs text-soft">{p.progress ?? 0}%</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-2xl bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Activités récentes</h2>
          {recentActivities.length === 0 && <p className="text-soft text-sm">Rien pour l'instant.</p>}
          <ul className="space-y-4">
            {recentActivities.map((a) => (
                <li key={`${a.type}-${a.itemId}`}>
                    <p className="text-sm">
                    <span className="text-soft">{ACTIVITY_LABEL[a.type]} : </span>
                    {a.title}
                    </p>
                    <p className="text-xs text-soft">
                    {a.project && `${a.project.title} · `}{formatDate(a.date)}
                    </p>
                </li>
            ))}
          </ul>
        </section>
      </div>
      {/* 4. Juste avant la dernière </div> fermante du composant */}
      {adding && (
        <Modal title="Nouvelle idée" onClose={() => setAdding(false)}>
            <IdeaForm onSubmit={addIdea} onClose={() => setAdding(false)} />
        </Modal>
      )}
    </div>
  )
}