
import { Palette, Sun, Moon, Monitor, Download, Info, LogOut } from "lucide-react"
import { useSettings } from "../hooks/useSettings"
import { useTheme } from "../hooks/useTheme"
import { useAuth } from "../hooks/useAuth"

const THEMES = [
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "light", label: "Clair", icon: Sun },
  { value: "system", label: "Système", icon: Monitor },
]

const Row = ({ icon: Icon, title, hint, children }) => (
  <div className="flex items-center gap-4 p-4">
    <Icon size={20} className="text-soft" />
    <div className="flex-1">
      <p>{title}</p>
      {hint && <p className="text-xs text-soft">{hint}</p>}
    </div>
    {children}
  </div>
)

export const Settings = () => {
  const { app, loading, error, exporting, exportError, exportData } = useSettings()
  const { theme, changeTheme } = useTheme()
  const { logout } = useAuth()

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Paramètres</h1>

      <div className="divide-y divide-line rounded-2xl bg-card">
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-4">
            <Palette size={20} className="text-soft" />
            <p>Apparence</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => changeTheme(value)}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm ${
                  theme === value ? "bg-brand" : "bg-tint text-soft hover:text-ink"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        <Row icon={Download} title="Sauvegarde" hint="Exporter toutes tes données en Excel (.xlsx)">
          <button
            onClick={exportData}
            disabled={exporting}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {exporting ? "Export…" : "Exporter"}
          </button>
        </Row>

        <Row
          icon={Info}
          title="À propos"
          hint={loading ? "Chargement…" : error ? error : `${app?.name} v${app?.version}`}
        />
      </div>

      {exportError && <p className="text-sm text-red-400">{exportError}</p>}

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/60 py-3 text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={18} /> Se déconnecter
      </button>
    </div>
  )
}