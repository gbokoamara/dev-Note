
import { useCallback, useEffect, useState } from "react"
import { api } from "../config/api"
import { withoutEmpty } from "../utils/payload"

export const useDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDashboard = useCallback(async () => {
    try {
      setData(await api("/dashboard/get"))
      setError("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const addIdea = async (idea) => {
    await api("/ideas/add", { method: "POST", body: withoutEmpty(idea) })
    await fetchDashboard()
  }

  return {
    stats: data?.stats,
    recentProjects: data?.recentProjects ?? [],
    recentActivities: data?.recentActivities ?? [],
    loading,
    error,
    addIdea,
  }
}