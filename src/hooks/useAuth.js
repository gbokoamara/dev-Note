import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../config/api"

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const login = async (password) => {
    setLoading(true)
    setError("")
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: { password },
        auth: false,
      })
      localStorage.setItem("token", data.token)
      navigate("/home", { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/", { replace: true })
  }

  return { login, logout, loading, error }
}

// Vérifie le jeton au chargement : "checking" | "ok" | "denied"
export const useSession = () => {
  const [state, setState] = useState(
    localStorage.getItem("token") ? "checking" : "denied"
  )

  useEffect(() => {
    if (state !== "checking") return
    api("/auth/me")
      .then(() => setState("ok"))
      .catch(() => setState("denied"))
  }, [state])

  return state
}