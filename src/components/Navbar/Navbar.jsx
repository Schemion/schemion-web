import { Link } from "react-router-dom"
import "./Navbar.css"

export default function Navbar() {
  const token = localStorage.getItem("token")

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
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
        <Link to="/training" className="nav-link">
          Training
        </Link>
        <Link to="/tasks" className="nav-link">
          Tasks
        </Link>
      </div>
      <div className="navbar-right">
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