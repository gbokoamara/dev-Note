
// import { useForm } from "../hooks/useForms"
import { useForm } from "../hooks/useForms"
import { inputClass } from "../utils/labels"

export const ConvertForm = ({ onSubmit, onClose }) => {
  const { values, handleChange, submit, saving, error } = useForm(
    { objective: "", startDate: "", deadline: "" },
    onSubmit,
    onClose
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="objective" value={values.objective} onChange={handleChange} placeholder="Objectif du projet" className={inputClass} autoFocus />
      <label className="block text-sm text-soft">Date de début
        <input type="date" name="startDate" value={values.startDate} onChange={handleChange} className={`${inputClass} mt-1`} />
      </label>
      <label className="block text-sm text-soft">Échéance (facultative)
        <input type="date" name="deadline" value={values.deadline} onChange={handleChange} className={`${inputClass} mt-1`} />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={saving} className="w-full rounded-lg bg-brand py-3 font-semibold disabled:opacity-50">
        {saving ? "Transformation…" : "Transformer en projet"}
      </button>
    </form>
  )
}