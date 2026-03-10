import api from "./axios"

export const createInferenceTask = async (file, modelId) => {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("model_id", modelId)

  const res = await api.post("/tasks/create/inference", formData)
  return res.data
}

export const getTask = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`)
  return res.data
}