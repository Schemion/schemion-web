import api from "./axios"

export const getModels = async () => {
  const res = await api.get("/models")
  return res.data
}

export const getModelMetrics = async (modelId) => {
  const res = await api.get(`/models/metrics/${modelId}`)
  const payload = res.data

  if (payload?.metrics_url) {
    const metricsRes = await fetch(payload.metrics_url)
    return metricsRes.json()
  }

  return payload
}

export const deleteModel = async (modelId) => {
  await api.delete(`/models/${modelId}`)
}

export const downloadModel = async (modelId) => {
  const res = await api.get(`/models/download/${modelId}`)
  return res.data.download_url
}
