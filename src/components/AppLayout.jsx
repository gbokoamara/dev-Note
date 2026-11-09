
import { NavLink, Outlet } from "react-router-dom"
import { Home, Lightbulb, FolderOpen, BookOpen, Settings, LogOut } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { SearchBar } from "./SearchBar"

const links = [
  { to: "/home", label: "Tableau de bord", short: "Accueil", icon: Home },
  { to: "/ideas", label: "Idées", short: "Idées", icon: Lightbulb },
  { to: "/projects", label: "Projets", short: "Projets", icon: FolderOpen },
  { to: "/journal", label: "Journal", short: "Journal", icon: BookOpen },
  { to: "/settings", label: "Paramètres", short: "Réglages", icon: Settings },
]

export const AppLayout = () => {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-app">
      {/* Ordinateur */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-white/10 bg-app p-5">
        <div className="mb-8">
          <h1 className="text-xl font-bold">DevNote</h1>
          <p className="text-xs text-soft">Tes idées, tes projets, ton avenir</p>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-brand text-white" : "text-soft hover:bg-card"
                }`
              }
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-soft hover:text-white">
          <LogOut size={20} /> Se déconnecter
        </button>
      </aside>

      <div className="md:ml-64">
        {/* Barre du haut avec la recherche */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-app/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur md:px-8">
          <SearchBar />
        </header>

        <main className="p-4 pb-24 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 flex justify-around border-t border-white/10 bg-app pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {links.map(({ to, short, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] ${isActive ? "text-brand" : "text-soft"}`
            }
          >
            <Icon size={20} /> {short}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}