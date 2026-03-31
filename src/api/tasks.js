import api from "./axios"

export const createInferenceTask = async (file, modelId) => {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("model_id", modelId)

  const res = await api.post("/tasks/create/inference", formData)
  return res.data
}

export const createTrainingTask = async (modelId, datasetId, imageSize, numEpochs, name) => {
  const formData = new FormData()

  formData.append("model_id", modelId)
  formData.append("dataset_id", datasetId)
  formData.append("image_size", imageSize)
  formData.append("num_epochs", numEpochs)
  formData.append("name", name)

  const res = await api.post("/tasks/create/training", formData)
  return res.data
}

export const getTask = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`)
  return res.data
}

export const getTasks = async() => {
  const res = await api.get('/tasks/');
  return res.data; 
}
