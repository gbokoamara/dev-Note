import { useCallback, useEffect, useState } from "react"
import { api } from "../config/api"

const withoutEmpty = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v != null))

const toIso = (d) => new Date(d).toISOString()

export const useIdeas = (status) => {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchIdeas = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const query = status ? `?status=${status}` : ""
      setIdeas(await api(`/ideas/getAll${query}`))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { fetchIdeas() }, [fetchIdeas])

  const run = async (request) => {
    const result = await request()
    await fetchIdeas()
    return result
  }

  const addIdea = (idea) =>
    run(() => api("/ideas/add", { method: "POST", body: withoutEmpty(idea) }))

  const updateIdea = (id, changes) =>
    run(() => api(`/ideas/put/${id}`, { method: "PUT", body: changes }))

  const deleteIdea = (id) =>
    run(() => api(`/ideas/delete/${id}`, { method: "DELETE" }))

  const convertIdea = (id, { objective, startDate, deadline }) =>
    run(() =>
      api(`/ideas/convert/${id}`, {
        method: "POST",
        body: withoutEmpty({
          objective,
          startDate: startDate && toIso(startDate),
          deadline: deadline && toIso(deadline),
        }),
      })
    )

  return { ideas, loading, error, addIdea, updateIdea, deleteIdea, convertIdea }
}