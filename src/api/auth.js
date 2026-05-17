import api from "./axios"

export const loginRequest = (email, password) => {
  return api.post("/auth/login", {
    email,
    password
  })
}

export const registerRequest = (email, password, role = "user") => {
  return api.post("/auth/register", {
    email,
    password,
    role
  })
}

export const confirmRegisterRequest = (email, code) => {
  return api.post("/auth/register/confirm", {
    email,
    code
  })
}
