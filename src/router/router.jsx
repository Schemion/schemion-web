import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import Home from "../pages/Home/Home"
import Inference from "../pages/Inference/Inference"
import Compare from "../pages/Compare/Compare"
import Training from "../pages/Training/Training"
import Tasks from "../pages/Tasks/Tasks"
import Login from "../pages/Login/Login"
import Library from "../pages/Library/Library"
import Faq from "../pages/Faq/Faq"

function ProtectedRoute({ token, sessionExpired, children }) {
  const location = useLocation()

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          sessionExpired
        }}
      />
    )
  }

  return children
}

export default function Router({ token, onAuth, sessionExpired }) {
  const protectedPage = (page) => (
    <ProtectedRoute token={token} sessionExpired={sessionExpired}>
      {page}
    </ProtectedRoute>
  )

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onAuth={onAuth} />} />
      <Route path="/inference" element={protectedPage(<Inference />)} />
      <Route path="/compare" element={protectedPage(<Compare />)} />
      <Route path="/training" element={protectedPage(<Training />)} />
      <Route path="/library" element={protectedPage(<Library />)} />
      <Route path="/tasks" element={protectedPage(<Tasks />)} />
      <Route path="/faq" element={<Faq />} />
    </Routes>
  )
}
