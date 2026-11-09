import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { Login } from "./pages/loginPage"
import { Home } from "./pages/homePage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AppLayout } from "./components/AppLayout"
import { Ideas } from './pages/ideasPage'
import { Projects } from './pages/ProjectsPage'
import { ProjectDetail } from './pages/projectDetailPage'
import { Journal } from './pages/JournalPage'
import { Settings } from './pages/SettingsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App