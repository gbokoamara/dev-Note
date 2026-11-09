
import { useForm } from "../hooks/useForms"
import { inputClass } from "../utils/labels"

export const JournalForm = ({ entry, projects, onSubmit, onClose }) => {
  const { values, handleChange, submit, saving, error } = useForm(
    {
      title: entry?.title ?? "",
      achievements: entry?.achievements ?? "",
      difficulties: entry?.difficulties ?? "",
      nextStep: entry?.nextStep ?? "",
      projectId: entry?.projectId ?? "",
    },
    onSubmit,
    onClose
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="title" value={values.title} onChange={handleChange} placeholder="Titre (ex. Jour 3) *" className={inputClass} autoFocus />
      <select name="projectId" value={values.projectId} onChange={handleChange} className={inputClass}>
        <option value="">Aucun projet</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>
      <textarea name="achievements" value={values.achievements} onChange={handleChange} placeholder="Travail réalisé *" rows={3} className={inputClass} />
      <textarea name="difficulties" value={values.difficulties} onChange={handleChange} placeholder="Difficultés rencontrées" rows={2} className={inputClass} />
      <textarea name="nextStep" value={values.nextStep} onChange={handleChange} placeholder="Prochaine étape" rows={2} className={inputClass} />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        disabled={saving || !values.title.trim() || !values.achievements.trim()}
        className="w-full rounded-lg bg-brand py-3 font-semibold disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : entry ? "Enregistrer" : "Ajouter l'entrée"}
      </button>
    </form>
  )
}