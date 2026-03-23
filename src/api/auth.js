import api from "./axios"

export const loginRequest = (email, password) => {
  return api.post("/auth/login", {
    email,
    password
  })
}

export const registerRequest = (email, password) => {
  return api.post("/auth/register", {
    email,
    password
  })
}