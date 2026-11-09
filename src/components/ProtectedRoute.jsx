import { Navigate } from "react-router-dom"
import { useSession } from "../hooks/useAuth"

export const ProtectedRoute = ({ children }) => {
  const session = useSession()

  if (session === "checking") {
    return <div className="h-screen grid place-items-center bg-app text-soft">Chargement…</div>
  }
  return session === "ok" ? children : <Navigate to="/" replace />
}