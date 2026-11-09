
import { useCallback, useEffect, useState } from "react"
import { api } from "../config/api"
import { journalPayload } from "../utils/payload"

export const useJournal = (projectId) => {
  const [entries, setEntries] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const query = projectId ? `?projectId=${projectId}` : ""
      setEntries(await api(`/journal/getAll${query}`))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  // Les projets servent au filtre et au choix du projet dans le formulaire
  useEffect(() => {
    api("/projects/getAll").then(setProjects).catch(() => setProjects([]))
  }, [])

  const run = async (request) => {
    const result = await request()
    await fetchEntries()
    return result
  }

  const addEntry = (values) =>
    run(() => api("/journal/add", { method: "POST", body: journalPayload(values) }))

  const updateEntry = (id, values) =>
    run(() => api(`/journal/put/${id}`, { method: "PUT", body: journalPayload(values, true) }))

  const deleteEntry = (id) =>
    run(() => api(`/journal/delete/${id}`, { method: "DELETE" }))

  return { entries, projects, loading, error, addEntry, updateEntry, deleteEntry }
}