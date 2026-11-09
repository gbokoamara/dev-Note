import { useEffect, useState } from "react"
import { api, BASE } from "../config/api"

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const useSettings = () => {
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState("")

  useEffect(() => {
    api("/settings/get")
      .then((data) => setApp(data.app))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const exportData = async () => {
    setExporting(true)
    setExportError("")
    try {
      const res = await fetch(`${BASE}/settings/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (res.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/"
        return
      }
      const json = await res.json().catch(() => null)
      if (!res.ok || !json) throw new Error(json?.message || "Export impossible")

      // Chargé seulement à ce moment-là : exceljs est volumineux
      const { buildExcel } = await import("../utils/exportExcel")
      const blob = await buildExcel(json.data ?? json)
      saveBlob(blob, `devnote-export-${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch (err) {
      setExportError(err.message)
    } finally {
      setExporting(false)
    }
  }

  return { app, loading, error, exporting, exportError, exportData }
}