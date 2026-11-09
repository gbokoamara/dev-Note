
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Search, Lightbulb, FolderOpen } from "lucide-react"
import { useSearch } from "../hooks/useSearch"
import { useClickOutside } from "../hooks/useClickOutside"

export const SearchBar = () => {
  const { query, setQuery, results, loading, load, clear } = useSearch()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useClickOutside(ref, () => setOpen(false))

  const pick = () => {
    setOpen(false)
    clear()
  }

  const empty = results && results.ideas.length === 0 && results.projects.length === 0

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => { load(); setOpen(true) }}
        placeholder="Rechercher une idée, un projet…"
        className="w-full rounded-xl bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand"
      />

      {open && results && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-card p-2 shadow-xl">
          {loading && <p className="p-3 text-sm text-soft">Recherche…</p>}
          {!loading && empty && <p className="p-3 text-sm text-soft">Aucun résultat.</p>}

          {results.projects.length > 0 && <p className="px-3 pt-2 text-xs uppercase text-soft">Projets</p>}
          {results.projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} onClick={pick} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
              <FolderOpen size={16} className="text-brand" />
              <span className="truncate text-sm">{p.title}</span>
            </Link>
          ))}

          {results.ideas.length > 0 && <p className="px-3 pt-2 text-xs uppercase text-soft">Idées</p>}
          {results.ideas.map((i) => (
            <Link key={i.id} to="/ideas" onClick={pick} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
              <Lightbulb size={16} className="text-amber-400" />
              <span className="truncate text-sm">{i.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}