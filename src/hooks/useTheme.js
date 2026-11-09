
import { useEffect, useState } from "react"

const KEY = "theme"
const COLORS = { dark: "#121212", light: "#f4f4f5" }
const lightQuery = () => window.matchMedia("(prefers-color-scheme: light)")

const apply = (choice) => {
  const resolved = choice === "system" ? (lightQuery().matches ? "light" : "dark") : choice
  document.documentElement.dataset.theme = resolved
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[resolved])
}

export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem(KEY) || "dark")

  useEffect(() => {
    apply(theme)
    if (theme !== "system") return
    const query = lightQuery()
    const onChange = () => apply("system")
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [theme])

  const changeTheme = (choice) => {
    localStorage.setItem(KEY, choice)
    setTheme(choice)
  }

  return { theme, changeTheme }
}