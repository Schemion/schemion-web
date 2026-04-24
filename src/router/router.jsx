import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home/Home"
import Inference from "../pages/Inference/Inference"
import Compare from "../pages/Compare/Compare"
import Training from "../pages/Training/Training"
import Tasks from "../pages/Tasks/Tasks"
import Login from "../pages/Login/Login"
import Library from "../pages/Library/Library"
import Faq from "../pages/Faq/Faq"

export default function Router({ token, onAuth }) {
    return (
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onAuth={onAuth} />} />
        <Route path="/inference" element={token ? <Inference/> : <Login onAuth={onAuth} />} />
        <Route path="/compare" element={token ? <Compare/> : <Login onAuth={onAuth} />} />
        <Route path="/training" element={token ? <Training/> : <Login onAuth={onAuth} />} />
        <Route path="/library" element={token ? <Library/> : <Login onAuth={onAuth} />} />
        <Route path="/tasks" element={token ? <Tasks/> : <Login onAuth={onAuth} />} />
        <Route path="/faq" element={<Faq />} />
        </Routes>
    )
}
