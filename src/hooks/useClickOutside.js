
import { useEffect } from "react"

export const useClickOutside = (ref, onOutside) => {
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) onOutside()
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [ref, onOutside])
}