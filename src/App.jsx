import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router/router"
import Navbar from "./components/Navbar/Navbar"
import "./App.css"

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  const handleAuthChange = (nextToken) => {
    if (nextToken) {
      localStorage.setItem("token", nextToken)
      setToken(nextToken)
      return
    }
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar token={token} onLogout={() => handleAuthChange(null)} />
        <Router token={token} onAuth={handleAuthChange} />
      </div>
    </BrowserRouter>
  )
}

export default App
