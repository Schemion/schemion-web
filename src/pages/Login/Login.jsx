import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  confirmRegisterRequest,
  loginRequest,
  registerRequest
} from "../../api/auth"
import "./Login.css"

const REGISTER_ROLE = "user"

const getBackendError = (err, fallback) => {
  const detail = err?.response?.data?.detail

  if (typeof detail === "string") {
    return detail
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map(item => item?.msg || item?.detail || String(item))
      .join(". ")
  }

  return fallback
}

export default function Login({ onAuth }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fromPath = location.state?.from?.pathname || "/"
  const sessionExpired = Boolean(location.state?.sessionExpired)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (awaitingConfirmation) {
      try {
        setLoading(true)
        const res = await confirmRegisterRequest(email, confirmationCode)
        const token = res?.data?.access_token || res?.data?.accessToken || res?.data?.token

        if (!token) {
          setError("Registration confirmation response does not include a token")
          return
        }

        if (onAuth) {
          onAuth(res.data)
        }

        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setConfirmationCode("")
        setAwaitingConfirmation(false)
        navigate(fromPath, { replace: true })
      } catch (err) {
        setError(getBackendError(err, "Could not confirm registration"))
      } finally {
        setLoading(false)
      }

      return
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      try {
        setLoading(true)
        await registerRequest(email, password, REGISTER_ROLE)
        setAwaitingConfirmation(true)
        setConfirmationCode("")
        setSuccess("Registration confirmation code sent")
        setConfirmPassword("")
        return
      } catch (err) {
        setError(getBackendError(err, "Could not create account"))
        return
      } finally {
        setLoading(false)
      }
    }

    try {
      setLoading(true)
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
    } catch (err) {
      setError(getBackendError(err, "Invalid email or password"))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    setSuccess("")

    try {
      setResending(true)
      await registerRequest(email, password, REGISTER_ROLE)
      setSuccess("Registration confirmation code sent")
    } catch (err) {
      setError(getBackendError(err, "Could not send registration confirmation email"))
    } finally {
      setResending(false)
    }
  }

  const handleConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
  }

  const toggleMode = () => {
    setIsRegister(prev => !prev)
    setAwaitingConfirmation(false)
    setError("")
    setSuccess("")
    setConfirmPassword("")
    setConfirmationCode("")
  }

  const backToRegistration = () => {
    setAwaitingConfirmation(false)
    setError("")
    setSuccess("")
    setConfirmationCode("")
  }

  const isExpiredCodeError = error === "Registration confirmation code expired"

  return (
    <div className="page login-page">
      <div className="login-card card">
        <div className="login-header">
          <h1>
            {awaitingConfirmation
              ? "Введите код из письма"
              : isRegister
              ? "Create account"
              : "Welcome back"}
          </h1>
          <p>
            {awaitingConfirmation
              ? `We sent a confirmation code to ${email}.`
              : sessionExpired && !isRegister
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
              disabled={awaitingConfirmation}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {awaitingConfirmation ? (
            <label className="field">
              <span className="field-label">Confirmation code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                value={confirmationCode}
                onChange={handleConfirmationCodeChange}
                maxLength={6}
                required
              />
            </label>
          ) : (
            <label className="field">
              <span className="field-label">Password</span>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          )}

          {isRegister && !awaitingConfirmation && (
            <label className="field">
              <span className="field-label">Repeat password</span>
              <input
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          )}

          {error && <p className="error">{error}</p>}
          {isExpiredCodeError && (
            <p className="login-hint">The code expired. Send a new code and try again.</p>
          )}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading
              ? "Loading..."
              : awaitingConfirmation
              ? "Confirm registration"
              : isRegister
              ? "Register"
              : "Login"}
          </button>

          {awaitingConfirmation ? (
            <div className="confirmation-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={handleResendCode}
                disabled={resending}
              >
                {resending ? "Sending..." : "Отправить код снова"}
              </button>
              <button type="button" onClick={backToRegistration}>
                Change registration data
              </button>
            </div>
          ) : (
            <div className="login-switch">
              <span>
                {isRegister ? "Already have an account?" : "No account yet?"}
              </span>
              <button type="button" onClick={toggleMode}>
                {isRegister ? "Login" : "Register"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
