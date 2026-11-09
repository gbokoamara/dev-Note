
import { useForm } from "../hooks/useForms"
import { inputClass, PRIORITY } from "../utils/labels"

export const TaskForm = ({ task, onSubmit, onClose }) => {
  const { values, handleChange, submit, saving, error } = useForm(
    {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
    },
    onSubmit,
    onClose
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="title" value={values.title} onChange={handleChange} placeholder="Titre de la tâche *" className={inputClass} autoFocus />
      <textarea name="description" value={values.description} onChange={handleChange} placeholder="Description" rows={2} className={inputClass} />
      <select name="priority" value={values.priority} onChange={handleChange} className={inputClass}>
        {Object.entries(PRIORITY).map(([value, p]) => (
          <option key={value} value={value}>Priorité {p.label.toLowerCase()}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={saving || !values.title.trim()} className="w-full rounded-lg bg-brand py-3 font-semibold disabled:opacity-50">
        {saving ? "Enregistrement…" : task ? "Enregistrer" : "Ajouter la tâche"}
      </button>
    </form>
  )
}