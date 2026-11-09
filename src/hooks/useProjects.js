
import { useCallback, useEffect, useState } from "react"
import { api } from "../config/api"
import { projectPayload } from "../utils/payload"

export const useProjects = (status) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const query = status ? `?status=${status}` : ""
      setProjects(await api(`/projects/getAll${query}`))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const addProject = async (values) => {
    await api("/projects/add", { method: "POST", body: projectPayload(values) })
    await fetchProjects()
  }

  return { projects, loading, error, addProject }
}