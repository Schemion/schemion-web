import { useState } from "react";
import AuthModal from "./components/AuthModal";
import "./App.css";

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="app-container">
      <h1 className="app-title">Schemion</h1>
      <p>Тут точно будет реализация.</p>

      <button
        className="app-button"
        onClick={() => setIsAuthOpen(true)}
      >
        Авторизация
      </button>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}