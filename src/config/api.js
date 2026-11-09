const API_URL = import.meta.env.VITE_API_URL
export const BASE = `${API_URL}/api/v1`

export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify({ data: body }) : undefined,
  })

  if (res.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/"
    throw new Error("Session expirée")
  }

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Erreur serveur")
  return json.data
}