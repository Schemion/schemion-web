import axios from "axios";

// пока просто заглушечка
const api = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
});

export const login = async (data) => {
  console.log("LOGIN REQUEST", data);


  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: { token: "fake-jwt-token" } }), 1000)
  );
};

export const register = async (data) => {
  console.log("REGISTER REQUEST", data);

  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: { message: "ok" } }), 1000)
  );
};