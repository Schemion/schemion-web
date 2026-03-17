import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../../api/auth"
import "./Login.css"

export default function Login({ onAuth }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await loginRequest(email, password)
      if (onAuth) {
        onAuth(res.data.access_token)
      } else {
        localStorage.setItem("token", res.data.access_token)
      }
      navigate("/")
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="page login-page">
      <div className="login-card card">
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage models, tasks, and inference runs.</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
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
              placeholder="passw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
