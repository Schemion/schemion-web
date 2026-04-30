import { Link, NavLink, useNavigate } from "react-router-dom"
import "./Navbar.css"

const navLinkClassName = ({ isActive }) => (
  isActive ? "nav-link active" : "nav-link"
)

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
        <NavLink to="/inference" className={navLinkClassName}>
          Inference
        </NavLink>
        <NavLink to="/compare" className={navLinkClassName}>
          Compare
        </NavLink>
        <NavLink to="/training" className={navLinkClassName}>
          Training
        </NavLink>
        <NavLink to="/tasks" className={navLinkClassName}>
          Tasks
        </NavLink>
        <NavLink to="/faq" className={navLinkClassName}>
          FAQ
        </NavLink>
      </div>
      <div className="navbar-right">
        {onToggleTheme && (
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={theme === "dark"}
            title="Toggle theme"
          >
            <span className="theme-toggle-knob" />
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
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
