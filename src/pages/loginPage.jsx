
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

export const Login = () => {
  const [password, setPassword] = useState("")
  const { login, loading, error } = useAuth()

  const submit = (e) => {
    e.preventDefault()
    login(password)
  }

  return (
    <div className="min-h-screen grid place-items-center bg-app px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-card p-8 space-y-5">
        <div>
          <h1 className="text-2xl font-bold">DevNote</h1>
          <p className="text-soft text-sm">Tes idées, tes projets, ton avenir</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full rounded-lg bg-app px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          autoFocus
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          disabled={loading || !password}
          className="w-full rounded-lg bg-brand py-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  )
}