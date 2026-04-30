import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { loginRequest, registerRequest } from "../../api/auth"
import "./Login.css"

export default function Login({ onAuth }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fromPath = location.state?.from?.pathname || "/"
  const sessionExpired = Boolean(location.state?.sessionExpired)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      try {
        const res = await registerRequest(email, password)
        const token = res?.data?.access_token || res?.data?.accessToken || res?.data?.token

        if (token) {
          if (onAuth) {
            onAuth(res.data)
          }
          navigate(fromPath, { replace: true })
          return
        }

        setSuccess("Account created. Please sign in.")
        setIsRegister(false)
        setConfirmPassword("")
        return
      } catch {
        setError("Could not create account")
        return
      }
    }

    try {
      const res = await loginRequest(email, password)
      const token = res?.data?.access_token || res?.data?.accessToken || res?.data?.token

      if (!token) {
        setError("Login response does not include a token")
        return
      }

      if (onAuth) {
        onAuth(res.data)
      }
      navigate(fromPath, { replace: true })
    } catch {
      setError("Invalid email or password")
    }
  }

  const toggleMode = () => {
    setIsRegister(prev => !prev)
    setError("")
    setSuccess("")
    setConfirmPassword("")
  }

  return (
    <div className="page login-page">
      <div className="login-card card">
        <div className="login-header">
          <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
          <p>
            {sessionExpired && !isRegister
              ? "Your session has expired. Sign in again to continue."
              : isRegister
              ? "Register to manage models, tasks, and inference runs."
              : "Sign in to manage models, tasks, and inference runs."}
          </p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {isRegister && (
            <label className="field">
              <span className="field-label">Repeat password</span>
              <input
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          )}

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="btn primary">
            {isRegister ? "Register" : "Login"}
          </button>

          <div className="login-switch">
            <span>
              {isRegister ? "Already have an account?" : "No account yet?"}
            </span>
            <button type="button" onClick={toggleMode}>
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
