import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { deleteModel, downloadModel, getModels, getModelMetrics } from "../../api/models"
import { createDataset, deleteDataset, downloadDataset, getDatasets } from "../../api/datasets"
import "./Library.css"

const METRIC_COLUMNS = [
  { label: "Epoch", key: "epoch" },
  { label: "Time (s)", key: "time", digits: 1 },
  { label: "Precision", key: "metrics/precision(B)" },
  { label: "Recall", key: "metrics/recall(B)" },
  { label: "mAP50", key: "metrics/mAP50(B)" },
  { label: "mAP50-95", key: "metrics/mAP50-95(B)" },
  { label: "Train box", key: "train/box_loss" },
  { label: "Train cls", key: "train/cls_loss" },
  { label: "Val box", key: "val/box_loss" },
  { label: "Val cls", key: "val/cls_loss" }
]

const normalizeList = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.datasets)) return value.datasets
  if (Array.isArray(value?.models)) return value.models
  if (Array.isArray(value?.results)) return value.results
  return []
}

const formatDate = (value) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString()
}

const formatMetric = (value, digits = 4) => {
  if (value === null || value === undefined || value === "") return "-"
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return String(value)
  return numberValue.toFixed(digits)
}

const parseMetrics = (payload) => {
  if (!payload) return null
  if (payload?.epochs) return payload
  if (payload?.metrics?.epochs) return payload.metrics
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload)
    } catch (err) {
      return { raw: payload }
    }
  }
  return payload
}

export default function Library() {
  const [models, setModels] = useState([])
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")
  const [datasetFile, setDatasetFile] = useState(null)
  const [datasetUploading, setDatasetUploading] = useState(false)
  const [datasetError, setDatasetError] = useState("")
  const [datasetSuccess, setDatasetSuccess] = useState("")

  const [selectedModel, setSelectedModel] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [metricsError, setMetricsError] = useState("")

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    setLoading(true)
    setError("")
    try {
      const [modelsData, datasetsData] = await Promise.all([
        getModels(),
        getDatasets()
      ])
      setModels(normalizeList(modelsData))
      setDatasets(normalizeList(datasetsData))
    } catch (err) {
      console.error(err)
      setError("Failed to load models or datasets. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDatasetFile = (event) => {
    const file = event.target.files?.[0]
    setDatasetFile(file || null)
  }

  const uploadDataset = async () => {
    if (!datasetName || !datasetFile) return
    setDatasetUploading(true)
    setDatasetError("")
    setDatasetSuccess("")
    try {
      await createDataset(datasetName, datasetDescription, datasetFile)
      setDatasetSuccess("Dataset uploaded successfully.")
      setDatasetName("")
      setDatasetDescription("")
      setDatasetFile(null)
      await loadResources()
    } catch (err) {
      console.error(err)
      setDatasetError("Failed to upload dataset. Please try again.")
    } finally {
      setDatasetUploading(false)
    }
  }

  const handleModelSelect = async (model) => {
    if (!model) return
    setSelectedModel(model)
    setMetrics(null)
    setMetricsError("")
    setMetricsLoading(true)

    try {
      const data = await getModelMetrics(model.id)
      setMetrics(parseMetrics(data))
    } catch (err) {
      console.error(err)
      setMetricsError("Failed to load metrics for this model.")
    } finally {
      setMetricsLoading(false)
    }
  }

  const openDownloadUrl = (url) => {
    if (!url) {
      setError("Download link is not available.")
      return
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleModelDownload = async (event, model) => {
    event.stopPropagation()
    try {
      const url = await downloadModel(model.id)
      openDownloadUrl(url)
    } catch (err) {
      console.error(err)
      setError("Failed to download model.")
    }
  }

  const handleModelDelete = async (event, model) => {
    event.stopPropagation()
    const confirmed = window.confirm(`Delete model "${model.name || model.id}"?`)
    if (!confirmed) return
    try {
      await deleteModel(model.id)
      if (String(selectedModel?.id) === String(model.id)) {
        setSelectedModel(null)
        setMetrics(null)
      }
      await loadResources()
    } catch (err) {
      console.error(err)
      setError("Failed to delete model.")
    }
  }

  const handleDatasetDownload = async (event, dataset) => {
    event.stopPropagation()
    try {
      const data = await downloadDataset(dataset.id)
      const url = data?.download_url || data?.url || data
      openDownloadUrl(url)
    } catch (err) {
      console.error(err)
      setError("Failed to download dataset.")
    }
  }

  const handleDatasetDelete = async (event, dataset) => {
    event.stopPropagation()
    const confirmed = window.confirm(`Delete dataset "${dataset.name || dataset.id}"?`)
    if (!confirmed) return
    try {
      await deleteDataset(dataset.id)
      await loadResources()
    } catch (err) {
      console.error(err)
      setError("Failed to delete dataset.")
    }
  }

  const latestEpoch = useMemo(() => {
    if (!Array.isArray(metrics?.epochs) || metrics.epochs.length === 0) return null
    return metrics.epochs[metrics.epochs.length - 1]
  }, [metrics])

  const modelName = selectedModel?.name || "Selected model"
  const runId = metrics?.run_id || metrics?.runId
  const startedAt = metrics?.started_at || metrics?.startedAt
  const epochsCount = Array.isArray(metrics?.epochs) ? metrics.epochs.length : 0

  return (
    <div className="page library-page">
      <div className="page-header">
        <h1>Models & datasets</h1>
        <p>
          Browse everything you have created, then open model metrics whenever
          you need deeper training insights.
        </p>
      </div>

      <div className="library-toolbar">
        <button className="btn ghost" onClick={loadResources} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
        <Link className="btn primary" to="/training">
          Start training
        </Link>
      </div>

      {error && <div className="library-error">{error}</div>}

      <div className="library-layout">
        <div className="library-stack">
          <div className="card library-section">
            <div className="library-section-header">
              <div>
                <h3>Models</h3>
                <span className="helper-text">
                  Click a model to open its training metrics.
                </span>
              </div>
              <span className="library-count">{models.length}</span>
            </div>

            {loading && models.length === 0 ? (
              <div className="library-empty">Loading models...</div>
            ) : models.length === 0 ? (
              <div className="library-empty">No models yet.</div>
            ) : (
              <div className="asset-list">
                {models.map((model) => {
                  const active = String(selectedModel?.id) === String(model.id)
                  return (
                    <div
                      key={model.id}
                      className={`asset-card ${active ? "active" : ""}`}
                      onClick={() => handleModelSelect(model)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          handleModelSelect(model)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="asset-info">
                        <div className="asset-title">{model.name || "Untitled model"}</div>
                        <div className="asset-meta">
                          ID: {model.id || "-"}
                        </div>
                        {model.created_at && (
                          <div className="asset-meta">
                            Created: {formatDate(model.created_at)}
                          </div>
                        )}
                        <span className="asset-action">View metrics</span>
                      </div>
                      <div className="asset-actions">
                        <button
                          className="btn ghost"
                          type="button"
                          onClick={(event) => handleModelDownload(event, model)}
                        >
                          Download
                        </button>
                        <button
                          className="btn danger"
                          type="button"
                          onClick={(event) => handleModelDelete(event, model)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="card library-section">
            <div className="library-section-header">
              <div>
                <h3>Datasets</h3>
                <span className="helper-text">All datasets connected to your workspace.</span>
              </div>
              <span className="library-count">{datasets.length}</span>
            </div>

            <div className="dataset-upload">
              <div>
                <div className="dataset-upload-title">Upload dataset</div>
                <div className="helper-text">Provide a name and archive file.</div>
              </div>

              <div className="field">
                <span className="field-label">Dataset name</span>
                <input
                  value={datasetName}
                  onChange={(event) => setDatasetName(event.target.value)}
                  placeholder="Road signs v2"
                />
              </div>

              <div className="field">
                <span className="field-label">Description (optional)</span>
                <textarea
                  value={datasetDescription}
                  onChange={(event) => setDatasetDescription(event.target.value)}
                  placeholder="Short summary of classes, source, or format."
                  rows={3}
                />
              </div>

              <div className="field">
                <span className="field-label">Dataset file</span>
                <input
                  key={datasetFile?.name || "empty"}
                  type="file"
                  onChange={handleDatasetFile}
                />
                {datasetFile && (
                  <span className="helper-text">File: {datasetFile.name}</span>
                )}
              </div>

              {datasetError && <div className="dataset-error">{datasetError}</div>}
              {datasetSuccess && <div className="dataset-success">{datasetSuccess}</div>}

              <div className="dataset-actions">
                <button
                  className="btn primary"
                  type="button"
                  onClick={uploadDataset}
                  disabled={!datasetName || !datasetFile || datasetUploading}
                >
                  {datasetUploading ? "Uploading..." : "Upload dataset"}
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setDatasetName("")
                    setDatasetDescription("")
                    setDatasetFile(null)
                    setDatasetError("")
                    setDatasetSuccess("")
                  }}
                  disabled={datasetUploading}
                >
                  Reset
                </button>
              </div>
            </div>

            {loading && datasets.length === 0 ? (
              <div className="library-empty">Loading datasets...</div>
            ) : datasets.length === 0 ? (
              <div className="library-empty">No datasets yet.</div>
            ) : (
              <div className="asset-list">
                {datasets.map((dataset) => (
                  <div key={dataset.id || dataset.name} className="asset-card static">
                    <div className="asset-info">
                      <div className="asset-title">{dataset.name || "Untitled dataset"}</div>
                      {dataset.description && (
                        <div className="asset-desc">{dataset.description}</div>
                      )}
                      <div className="asset-meta">ID: {dataset.id || "-"}</div>
                      {dataset.created_at && (
                        <div className="asset-meta">
                          Created: {formatDate(dataset.created_at)}
                        </div>
                      )}
                    </div>
                    <div className="asset-actions">
                      <button
                        className="btn ghost"
                        type="button"
                        onClick={(event) => handleDatasetDownload(event, dataset)}
                      >
                        Download
                      </button>
                      <button
                        className="btn danger"
                        type="button"
                        onClick={(event) => handleDatasetDelete(event, dataset)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card library-metrics">
          <div className="metrics-header">
            <div>
              <h3>Training metrics</h3>
              <span className="helper-text">
                {selectedModel
                  ? `Showing metrics for ${modelName}.`
                  : "Select a model to open metrics."}
              </span>
            </div>
          </div>

          {metricsLoading && (
            <div className="metrics-empty">Loading metrics...</div>
          )}

          {metricsError && <div className="metrics-error">{metricsError}</div>}

          {!metricsLoading && !metricsError && !metrics && (
            <div className="metrics-empty">
              Choose a model from the list to see its metrics file.
            </div>
          )}

          {!metricsLoading && !metricsError && metrics && (
            <div className="metrics-body">
              <div className="metrics-summary">
                <div className="metrics-card">
                  <span className="metrics-label">Run ID</span>
                  <span className="metrics-value">{runId || "-"}</span>
                </div>
                <div className="metrics-card">
                  <span className="metrics-label">Started at</span>
                  <span className="metrics-value">{formatDate(startedAt)}</span>
                </div>
                <div className="metrics-card">
                  <span className="metrics-label">Epochs</span>
                  <span className="metrics-value">{epochsCount || "-"}</span>
                </div>
                {latestEpoch && (
                  <>
                    <div className="metrics-card">
                      <span className="metrics-label">Latest mAP50</span>
                      <span className="metrics-value">
                        {formatMetric(latestEpoch["metrics/mAP50(B)"])}
                      </span>
                    </div>
                    <div className="metrics-card">
                      <span className="metrics-label">Latest Precision</span>
                      <span className="metrics-value">
                        {formatMetric(latestEpoch["metrics/precision(B)"])}
                      </span>
                    </div>
                    <div className="metrics-card">
                      <span className="metrics-label">Latest Recall</span>
                      <span className="metrics-value">
                        {formatMetric(latestEpoch["metrics/recall(B)"])}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {Array.isArray(metrics.epochs) && metrics.epochs.length > 0 ? (
                <div className="metrics-table-wrapper">
                  <table className="metrics-table">
                    <thead>
                      <tr>
                        {METRIC_COLUMNS.map((col) => (
                          <th key={col.key}>{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.epochs.map((epoch, index) => (
                        <tr key={epoch.epoch ?? index}>
                          {METRIC_COLUMNS.map((col) => (
                            <td key={col.key}>
                              {col.key === "epoch"
                                ? epoch[col.key] ?? "-"
                                : formatMetric(epoch[col.key], col.digits)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : metrics.raw ? (
                <div className="metrics-empty">
                  Metrics file format is not supported. Raw payload:
                  <pre className="metrics-raw">{metrics.raw}</pre>
                </div>
              ) : (
                <div className="metrics-empty">No epoch metrics available yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
