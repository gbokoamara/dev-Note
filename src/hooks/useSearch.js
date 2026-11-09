
import { useCallback, useMemo, useState } from "react"
import { api } from "../config/api"

const clean = (s = "") =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export const useSearch = () => {
  const [query, setQuery] = useState("")
  const [data, setData] = useState({ ideas: [], projects: [] })
  const [loading, setLoading] = useState(false)

  // Rechargé à chaque focus du champ : les résultats restent à jour
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [ideas, projects] = await Promise.all([
        api("/ideas/getAll"),
        api("/projects/getAll"),
      ])
      setData({ ideas, projects })
    } catch {
      // recherche silencieuse : on garde les anciennes données
    } finally {
      setLoading(false)
    }
  }, [])

  const results = useMemo(() => {
    const q = clean(query.trim())
    if (!q) return null
    const match = (item) =>
      clean(
        `${item.title} ${item.description ?? ""} ${item.category ?? ""} ${item.objective ?? ""}`
      ).includes(q)
    return {
      ideas: data.ideas.filter(match).slice(0, 5),
      projects: data.projects.filter(match).slice(0, 5),
    }
  }, [query, data])

  const clear = useCallback(() => setQuery(""), [])

  return { query, setQuery, results, loading, load, clear }
}