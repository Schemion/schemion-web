import api from "./axios"

export const getModels = async () => {
  const res = await api.get("/models")
  return res.data
}