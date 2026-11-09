
import { useState } from "react"

export const useForm = (initial, onSubmit, onSuccess) => {
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      await onSubmit(values)
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return { values, handleChange, submit, saving, error }
}