import { useCallback, useEffect, useState } from "react"
import { api } from "../config/api"
import { projectPayload, withoutEmpty } from "../utils/payload"

const ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 }
const sortTasks = (tasks) =>
  [...tasks].sort(
    (a, b) =>
      (a.status === "DONE") - (b.status === "DONE") ||
      ORDER[a.priority] - ORDER[b.priority]
  )

export const useProjectDetail  = (id) => {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")

  const fetchProject = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await api(`/projects/get/${id}`)
      setProject({ ...data, tasks: sortTasks(data.tasks ?? []) })
      setError("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchProject() }, [fetchProject])

  // Action directe : l'erreur va dans actionError
  const attempt = async (fn) => {
    setActionError("")
    try {
      await fn()
      return true
    } catch (err) {
      setActionError(err.message)
      return false
    }
  }

  // Après une action sur une tâche : met à jour la progression sans nouvelle requête.
  // Si la réponse n'a pas la forme attendue, on recharge le projet.
  const sync = async (res, apply, needsTask = true) => {
    const task = res?.task ?? res
    if (!res?.project || (needsTask && !task?.id)) return fetchProject(true)
    setProject((p) => ({ ...p, ...res.project, tasks: sortTasks(apply(p.tasks, task)) }))
    // un projet terminé repasse en cours si on ajoute / décoche une tâche
    if (project?.status === "DONE") fetchProject(true)
  }

  // --- Projet ---
  const updateProject = async (values) => {
    await api(`/projects/put/${id}`, { method: "PUT", body: projectPayload(values, true) })
    await fetchProject(true)
  }

  const changeStatus = (status) =>
    attempt(async () => {
      await api(`/projects/put/${id}`, { method: "PUT", body: { status } })
      await fetchProject(true)
    })

  const removeProject = () =>
    attempt(() => api(`/projects/delete/${id}`, { method: "DELETE" }))

  // --- Tâches ---
  const addTask = async (values) => {
    const res = await api("/tasks/add", {
      method: "POST",
      body: withoutEmpty({ ...values, projectId: id }),
    })
    await sync(res, (tasks, task) => [...tasks, task])
  }

  const updateTask = async (taskId, values) => {
    const res = await api(`/tasks/put/${taskId}`, { method: "PUT", body: values })
    await sync(res, (tasks, task) => tasks.map((t) => (t.id === taskId ? task : t)))
  }

  const toggleTask = (taskId) =>
    attempt(async () => {
      const res = await api(`/tasks/toggle/${taskId}`, { method: "PATCH" })
      await sync(res, (tasks, task) => tasks.map((t) => (t.id === taskId ? task : t)))
    })

  const removeTask = (taskId) =>
    attempt(async () => {
      const res = await api(`/tasks/delete/${taskId}`, { method: "DELETE" })
      await sync(res, (tasks) => tasks.filter((t) => t.id !== taskId), false)
    })

  return {
    project, loading, error, actionError,
    updateProject, changeStatus, removeProject,
    addTask, updateTask, toggleTask, removeTask,
  }
}