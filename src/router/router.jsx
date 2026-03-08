import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home/Home"
import Inference from "../pages/Inference/Inference"
import Training from "../pages/Training/Training"
import Tasks from "../pages/Tasks/Tasks"
import Login from "../pages/Login/Login"

export default function Router() {
    const token = localStorage.getItem("token")

    return (
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inference" element={token ? <Inference/> : <Login/>} />
        <Route path="/training" element={token ? <Training/> : <Login/>} />
        <Route path="/tasks" element={token ? <Tasks/> : <Login/>} />
        </Routes>
    )
}