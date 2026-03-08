import { useState } from "react";
import { login, register } from "../../api/auth";
import "./AuthModal.css";


// как будто модалка мне кажется кринж и ее можно делитнуть (deprecadet)
export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        await login(form);
      } else {
        await register(form);
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="modal-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>

        <div
          className="modal-switch"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "No account? Register"
            : "Already have account? Login"}
        </div>

        <button
          className="modal-secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}