import api from "./axios"

export const createDataset = async (name, description, file) => {
  const formData = new FormData()

  formData.append("name", name)
  if (description !== undefined && description !== null) {
    formData.append("description", description)
  }
  formData.append("file", file)

  const res = await api.post("/datasets/create", formData)
  return res.data
}

export const getDatasets = async ({ skip = 0, limit = 100, nameContains } = {}) => {
  const params = {
    skip,
    limit,
  }

  if (nameContains) {
    params.name_contains = nameContains
  }

  const res = await api.get("/datasets/", { params })
  return res.data
}

export const getDataset = async (datasetId) => {
  const res = await api.get(`/datasets/${datasetId}`)
  return res.data
}

export const downloadDataset = async (datasetId) => {
  const res = await api.get(`/datasets/download/${datasetId}`)
  return res.data
}

export const deleteDataset = async (datasetId) => {
  const res = await api.delete(`/datasets/${datasetId}`)
  return res.data
}
