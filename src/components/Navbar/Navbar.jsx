import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

export default function Navbar({ token, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate()

  const logout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Schemion
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/inference" className="nav-link">
          Inference
        </Link>
        <Link to="/compare" className="nav-link">
          Compare
        </Link>
        <Link to="/training" className="nav-link">
          Training
        </Link>
        <Link to="/tasks" className="nav-link">
          Tasks
        </Link>
      </div>
      <div className="navbar-right">
        {onToggleTheme && (
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        )}
        {token ? (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
