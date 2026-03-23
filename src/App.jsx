import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router/router"
import Navbar from "./components/Navbar/Navbar"
import "./App.css"

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") return stored
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  })

  const handleAuthChange = (nextToken) => {
    if (nextToken) {
      localStorage.setItem("token", nextToken)
      setToken(nextToken)
      return
    }
    localStorage.removeItem("token")
    setToken(null)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar
          token={token}
          onLogout={() => handleAuthChange(null)}
          theme={theme}
          onToggleTheme={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
        />
        <Router token={token} onAuth={handleAuthChange} />
      </div>
    </BrowserRouter>
  )
}

export default App
