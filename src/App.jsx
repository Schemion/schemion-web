import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router/router"
import Navbar from "./components/Navbar/Navbar"
import { refreshSession } from "./api/axios"
import {
  AUTH_EXPIRED_EVENT,
  clearSession,
  extractSessionTokens,
  getAccessToken,
  getTokenExpiryMs,
  isTokenExpired,
  setSession,
  TOKEN_REFRESH_LEEWAY_MS
} from "./api/session"
import "./App.css"

function App() {
  const [token, setToken] = useState(() => getAccessToken())
  const [sessionExpired, setSessionExpired] = useState(false)
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") return stored
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  })

  const handleAuthChange = (session) => {
    if (session) {
      const tokens = typeof session === "string"
        ? { accessToken: session, refreshToken: null }
        : extractSessionTokens(session)

      if (tokens.accessToken) {
        setSession(tokens)
        setToken(tokens.accessToken)
        setSessionExpired(false)
      }

      return
    }

    clearSession()
    setToken(null)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    const expireSession = () => {
      clearSession()
      setToken(null)
      setSessionExpired(true)
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, expireSession)

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, expireSession)
    }
  }, [])

  useEffect(() => {
    if (!token) return undefined

    const refreshOrExpire = async () => {
      try {
        const nextToken = await refreshSession()
        setToken(nextToken)
        setSessionExpired(false)
      } catch {
        clearSession()
        setToken(null)
        setSessionExpired(true)
      }
    }

    if (isTokenExpired(token)) {
      refreshOrExpire()
      return undefined
    }

    const expiryMs = getTokenExpiryMs(token)
    if (!expiryMs) return undefined

    const delay = Math.max(expiryMs - Date.now() - TOKEN_REFRESH_LEEWAY_MS, 0)
    const timerId = window.setTimeout(refreshOrExpire, delay)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [token])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar
          token={token}
          onLogout={() => handleAuthChange(null)}
          theme={theme}
          onToggleTheme={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
        />
        <Router
          token={token}
          onAuth={handleAuthChange}
          sessionExpired={sessionExpired}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
