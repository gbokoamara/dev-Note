
import { useForm } from "../hooks/useForms"
import { inputClass, PROJECT_STATUS } from "../utils/labels"
import { toDateInput } from "../utils/payload"

export const ProjectForm = ({ project, onSubmit, onClose }) => {
  const { values, handleChange, submit, saving, error } = useForm(
    {
      title: project?.title ?? "",
      description: project?.description ?? "",
      objective: project?.objective ?? "",
      status: project?.status ?? "TODO",
      startDate: toDateInput(project?.startDate),
      deadline: toDateInput(project?.deadline),
    },
    onSubmit,
    onClose
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="title" value={values.title} onChange={handleChange} placeholder="Titre *" className={inputClass} autoFocus />
      <textarea name="description" value={values.description} onChange={handleChange} placeholder="Description" rows={2} className={inputClass} />
      <input name="objective" value={values.objective} onChange={handleChange} placeholder="Objectif" className={inputClass} />
      <select name="status" value={values.status} onChange={handleChange} className={inputClass}>
        {Object.entries(PROJECT_STATUS).map(([value, s]) => (
          <option key={value} value={value}>{s.label}</option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-soft">Début
          <input type="date" name="startDate" value={values.startDate} onChange={handleChange} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-sm text-soft">Échéance
          <input type="date" name="deadline" value={values.deadline} onChange={handleChange} className={`${inputClass} mt-1`} />
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={saving || !values.title.trim()} className="w-full rounded-lg bg-brand py-3 font-semibold disabled:opacity-50">
        {saving ? "Enregistrement…" : project ? "Enregistrer" : "Créer le projet"}
      </button>
    </form>
  )
}