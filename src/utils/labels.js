
export const ACTIVITY_LABEL = {
  idea_created: "Idée ajoutée",
  project_created: "Projet créé",
  task_completed: "Tâche terminée",
  journal_added: "Entrée de journal",
}

export const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : ""

export const inputClass ="w-full rounded-lg bg-app px-4 py-3 outline-none focus:ring-2 focus:ring-brand"



export const PROJECT_STATUS = {
  TODO: { label: "À faire", style: "bg-zinc-500/20 text-zinc-300 light:text-zinc-700" },
  IN_PROGRESS: { label: "En cours", style: "bg-brand/25 text-violet-200 light:text-violet-700" },
  PAUSED: { label: "En pause", style: "bg-amber-500/20 text-amber-300 light:text-amber-700" },
  DONE: { label: "Terminé", style: "bg-emerald-500/20 text-emerald-300 light:text-emerald-700" },
}

export const IDEA_STATUS = {
  UNCLASSIFIED: { label: "Non classée", style: "bg-zinc-500/20 text-zinc-300 light:text-zinc-700" },
  TO_STUDY: { label: "À étudier", style: "bg-amber-500/20 text-amber-300 light:text-amber-700" },
  CONVERTED: { label: "Transformée en projet", style: "bg-emerald-500/20 text-emerald-300 light:text-emerald-700" },
}

export const PRIORITY = {
  LOW: { label: "Basse", style: "bg-zinc-500/20 text-zinc-300 light:text-zinc-700" },
  MEDIUM: { label: "Moyenne", style: "bg-amber-500/20 text-amber-300 light:text-amber-700" },
  HIGH: { label: "Haute", style: "bg-red-500/20 text-red-300 light:text-red-700" },
}