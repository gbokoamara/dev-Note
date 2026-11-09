
import { useForm } from "../hooks/useForms"
import { inputClass } from "../utils/labels"

export const IdeaForm = ({ idea, onSubmit, onClose }) => {
  const { values, handleChange, submit, saving, error } = useForm(
    {
      title: idea?.title ?? "",
      description: idea?.description ?? "",
      category: idea?.category ?? "",
      status: idea?.status === "TO_STUDY" ? "TO_STUDY" : "UNCLASSIFIED",
    },
    onSubmit,
    onClose
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="title" value={values.title} onChange={handleChange} placeholder="Titre *" className={inputClass} autoFocus />
      <textarea name="description" value={values.description} onChange={handleChange} placeholder="Description" rows={3} className={inputClass} />
      <input name="category" value={values.category} onChange={handleChange} placeholder="Catégorie (Mobile, Web…)" className={inputClass} />
      <select name="status" value={values.status} onChange={handleChange} className={inputClass}>
        <option value="UNCLASSIFIED">Non classée</option>
        <option value="TO_STUDY">À étudier</option>
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={saving || !values.title.trim()} className="w-full rounded-lg bg-brand py-3 font-semibold disabled:opacity-50">
        {saving ? "Enregistrement…" : idea ? "Enregistrer" : "Ajouter l'idée"}
      </button>
    </form>
  )
}