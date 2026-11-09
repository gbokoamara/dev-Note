
const isEmpty = (v) => v === "" || v == null

export const withoutEmpty = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => !isEmpty(v)))

export const toIso = (d) => new Date(d).toISOString()
export const toDateInput = (iso) => (iso ? iso.slice(0, 10) : "")

export const projectPayload = (v, isUpdate = false) => {
  const body = withoutEmpty({
    title: v.title,
    description: v.description,
    objective: v.objective,
    status: v.status,
    startDate: v.startDate && toIso(v.startDate),
    deadline: v.deadline && toIso(v.deadline),
  })
  if (isUpdate) {
    body.description = v.description // permet de vider le champ
    body.objective = v.objective
    if (!v.deadline) body.deadline = null // supprime l'échéance
  }
  return body
}

export const journalPayload = (v, isUpdate = false) =>
  isUpdate
    ? {
        title: v.title,
        achievements: v.achievements,
        difficulties: v.difficulties,
        nextStep: v.nextStep,
        projectId: v.projectId || null, // null détache l'entrée du projet
      }
    : withoutEmpty({
        title: v.title,
        achievements: v.achievements,
        difficulties: v.difficulties,
        nextStep: v.nextStep,
        projectId: v.projectId,
})