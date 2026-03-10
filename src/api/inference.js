import api from "./axios"

export const createInferenceTask = async (file) => {
  const formData = new FormData()
  formData.append("image", file)

  const res = await api.post("/tasks/create/inference", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return res.data
}

export const getTaskStatus = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`)
  return res.data
}