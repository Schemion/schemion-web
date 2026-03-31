import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getModels } from "../../api/models"
import { getDatasets } from "../../api/datasets"
import { createTrainingTask } from "../../api/tasks"
import "./Training.css"

const normalizeList = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.datasets)) return value.datasets
  if (Array.isArray(value?.models)) return value.models
  if (Array.isArray(value?.results)) return value.results
  return []
}

export default function Training() {
  const [models, setModels] = useState([])
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [selectedModel, setSelectedModel] = useState("")
  const [selectedDataset, setSelectedDataset] = useState("")
  const [trainingName, setTrainingName] = useState("")
  const [imageSize, setImageSize] = useState("640")
  const [numEpochs, setNumEpochs] = useState("10")

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [lastTask, setLastTask] = useState(null)

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

  const startTraining = async () => {
    if (!selectedModel || !selectedDataset) return
    setSubmitting(true)
    setSubmitError("")
    setLastTask(null)
    try {
      const task = await createTrainingTask(
        selectedModel,
        selectedDataset,
        imageSize,
        numEpochs,
        trainingName
      )
      setLastTask(task)
    } catch (err) {
      console.error(err)
      setSubmitError("Failed to start training. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedModel("")
    setSelectedDataset("")
    setTrainingName("")
    setImageSize("640")
    setNumEpochs("10")
    setSubmitError("")
    setLastTask(null)
  }

  const selectedModelData = useMemo(
    () => models.find((model) => String(model.id) === String(selectedModel)),
    [models, selectedModel]
  )

  const selectedDatasetData = useMemo(
    () => datasets.find((dataset) => String(dataset.id) === String(selectedDataset)),
    [datasets, selectedDataset]
  )

  const imageSizeValue = Number(imageSize)
  const numEpochsValue = Number(numEpochs)
  const canStart = Boolean(
    selectedModel &&
      selectedDataset &&
      trainingName &&
      imageSizeValue > 0 &&
      numEpochsValue > 0 &&
      !submitting
  )

  const renderField = (label, value) => (
    <div className="training-field">
      <span className="training-label">{label}</span>
      <span className="training-value">{value || "-"}</span>
    </div>
  )

  return (
    <div className="page training-page">
      <div className="page-header">
        <h1>Training</h1>
        <p>
          Prepare a dataset, pick a base model, and launch a new training run.
          You can monitor the task in the Tasks page once it starts.
        </p>
      </div>

      <div className="training-toolbar">
        <button className="btn ghost" onClick={loadResources} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
        <Link className="btn primary" to="/library">
          Open models & datasets
        </Link>
      </div>

      {error && <div className="training-error">{error}</div>}

      <div className="training-grid">
        <div className="card training-controls">
          <div className="training-header-row">
            <h3>Start a training run</h3>
            <span className="helper-text">Choose both a model and a dataset.</span>
          </div>

          <div className="field">
            <span className="field-label">Run name</span>
            <input
              value={trainingName}
              onChange={(e) => setTrainingName(e.target.value)}
              placeholder="Baseline-yolo-v1"
            />
          </div>

          <div className="field">
            <span className="field-label">Image size</span>
            <input
              type="number"
              min="1"
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
            />
            <span className="helper-text">Resolution used during training.</span>
          </div>

          <div className="field">
            <span className="field-label">Epochs</span>
            <input
              type="number"
              min="1"
              value={numEpochs}
              onChange={(e) => setNumEpochs(e.target.value)}
            />
          </div>

          <div className="field">
            <span className="field-label">Base model</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map((model) => (
                <option key={model.id} value={String(model.id)}>
                  {model.name || model.id}
                </option>
              ))}
            </select>
            {selectedModelData?.name && (
              <span className="helper-text">Selected: {selectedModelData.name}</span>
            )}
          </div>

          <div className="field">
            <span className="field-label">Dataset</span>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
            >
              <option value="">Select dataset</option>
              {datasets.map((dataset) => (
                <option key={dataset.id} value={String(dataset.id)}>
                  {dataset.name || dataset.id}
                </option>
              ))}
            </select>
            {selectedDatasetData?.name && (
              <span className="helper-text">
                Selected: {selectedDatasetData.name}
              </span>
            )}
          </div>

          {submitError && <div className="training-error">{submitError}</div>}

          {lastTask && !submitError && (
            <div className="training-success">
              Training started successfully. You can start a new one when you are
              ready.
            </div>
          )}

          <div className="training-actions">
            <button
              className="btn primary"
              onClick={startTraining}
              disabled={!canStart}
            >
              {submitting ? "Starting..." : "Start training"}
            </button>
            <button className="btn ghost" onClick={resetForm} disabled={submitting}>
              Reset
            </button>
          </div>

          <div className="training-limit">
            Training limit: no more than 2 requests per hour.
          </div>
        </div>

        <div className="card training-status">
          <h3>Run overview</h3>
          <div className="training-summary">
            {renderField("Model", selectedModelData?.name || selectedModelData?.id)}
            {renderField("Dataset", selectedDatasetData?.name || selectedDatasetData?.id)}
            {renderField("Dataset ID", selectedDatasetData?.id)}
            {renderField("Model ID", selectedModelData?.id)}
            {renderField("Run name", trainingName)}
            {renderField("Image size", imageSize)}
            {renderField("Epochs", numEpochs)}
          </div>

          {selectedDatasetData?.description && (
            <div className="training-description">
              <span className="training-label">Dataset details</span>
              <p>{selectedDatasetData.description}</p>
            </div>
          )}

          {lastTask && (
            <div className="training-task">
              <div>
                <span className="training-label">Last task</span>
                <span className="training-value">{lastTask.id || "-"}</span>
              </div>
              <span className="status-pill success">Started</span>
            </div>
          )}

          <Link className="btn ghost" to="/tasks">
            Open tasks
          </Link>
        </div>
      </div>
    </div>
  )
}
