import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../../api/auth"
import "./Login.css"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await loginRequest(email, password)
      localStorage.setItem("token", res.data.access_token)
      navigate("/")
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  )
}