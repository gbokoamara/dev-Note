
import { useEffect } from "react"
import { BASE } from "../config/api"

// Une requête sans jeton renvoie un 401 : sans importance, le but est de réveiller le serveur
export const useWakeApi = () => {
  useEffect(() => {
    fetch(`${BASE}/auth/me`).catch(() => {})
  }, [])
}