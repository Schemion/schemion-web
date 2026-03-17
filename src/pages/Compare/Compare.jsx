import { useEffect, useRef, useState } from "react"

import DragDrop from "../../components/DragDrop/DragDrop"
import DetectionCanvas from "../../components/DetectionCanvas/DetectionCanvas"

import { getModels } from "../../api/models"
import { createInferenceTask, getTask } from "../../api/tasks"

import "./Compare.css"

export default function Compare() {
  const [models, setModels] = useState([])
  const [modelA, setModelA] = useState("")
  const [modelB, setModelB] = useState("")

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [results, setResults] = useState({ a: null, b: null })
  const [resultUrls, setResultUrls] = useState({ a: null, b: null })
  const [status, setStatus] = useState({ a: "idle", b: "idle" })

  const intervalRef = useRef(null)
  const loadedRef = useRef({ a: false, b: false })

  useEffect(() => {
    loadModels()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const loadModels = async () => {
    try {
      const data = await getModels()
      setModels(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFile = (selectedFile) => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    setResults({ a: null, b: null })
    setResultUrls({ a: null, b: null })
    setStatus({ a: "idle", b: "idle" })
    loadedRef.current = { a: false, b: false }
  }

  const resetAll = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setFile(null)
    setPreview(null)
    setResults({ a: null, b: null })
    setResultUrls({ a: null, b: null })
    setStatus({ a: "idle", b: "idle" })
    setModelA("")
    setModelB("")
    setError("")
    setLoading(false)
    loadedRef.current = { a: false, b: false }
  }

  const startCompare = async () => {
    if (!file || !modelA || !modelB) return
    if (modelA === modelB) {
      setError("Choose two different models to compare.")
      return
    }

    setError("")
    setLoading(true)
    setResults({ a: null, b: null })
    setResultUrls({ a: null, b: null })
    setStatus({ a: "queued", b: "queued" })
    loadedRef.current = { a: false, b: false }

    try {
      const [taskA, taskB] = await Promise.all([
        createInferenceTask(file, modelA),
        createInferenceTask(file, modelB)
      ])
      pollTasks(taskA.id, taskB.id)
    } catch (e) {
      console.error(e)
      setError("Could not start comparison. Please try again.")
      setLoading(false)
    }
  }

  const loadResult = async (url) => {
    const res = await fetch(url)
    const data = await res.json()
    return data.predictions
  }

  const handleTaskUpdate = async (task, key) => {
    if (task.status === "succeeded") {
      setStatus(prev => ({ ...prev, [key]: "succeeded" }))

      if (!loadedRef.current[key]) {
        const predictions = await loadResult(task.output_url)
        loadedRef.current[key] = true
        setResults(prev => ({ ...prev, [key]: predictions }))
        setResultUrls(prev => ({ ...prev, [key]: task.output_url }))
      }
      return
    }

    if (task.status === "failed") {
      setStatus(prev => ({ ...prev, [key]: "failed" }))
      return
    }

    setStatus(prev => ({ ...prev, [key]: "running" }))
  }

  const pollTasks = (taskAId, taskBId) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(async () => {
      try {
        const [taskA, taskB] = await Promise.all([
          getTask(taskAId),
          getTask(taskBId)
        ])

        await handleTaskUpdate(taskA, "a")
        await handleTaskUpdate(taskB, "b")

        const doneA = taskA.status === "succeeded" || taskA.status === "failed"
        const doneB = taskB.status === "succeeded" || taskB.status === "failed"

        if (taskA.status === "failed" || taskB.status === "failed") {
          setError("One of the tasks failed. Try again.")
          setLoading(false)
          clearInterval(intervalRef.current)
          intervalRef.current = null
        } else if (doneA && doneB) {
          setLoading(false)
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } catch (err) {
        console.error(err)
        setError("Failed to fetch task status. Please retry.")
        setLoading(false)
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 8000)
  }

  const modelAName = models.find(
    model => String(model.id) === String(modelA)
  )?.name
  const modelBName = models.find(
    model => String(model.id) === String(modelB)
  )?.name
  const readyToShow = results.a && results.b

  const statusClass = (value) => {
    if (value === "succeeded") return "success"
    if (value === "failed") return "error"
    if (value === "running" || value === "queued") return "running"
    return ""
  }

  const statusLabel = (value) => {
    if (value === "succeeded") return "Ready"
    if (value === "failed") return "Failed"
    if (value === "queued") return "Queued"
    if (value === "running") return "Running"
    return "Idle"
  }

  return (
    <div className="page compare-page">
      <div className="page-header">
        <h1>Model Comparison</h1>
        <p>
          Upload one image, select two models, and review predictions once both
          tasks finish.
        </p>
      </div>

      <div className="compare-grid">
        <div className="card compare-controls">
          <div className="field">
            <span className="field-label">Model A</span>
            <select
              value={modelA}
              onChange={(e) => setModelA(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map(model => (
                <option key={model.id} value={String(model.id)}>
                  {model.name}
                </option>
              ))}
            </select>
            {modelAName && (
              <span className="helper-text">Selected: {modelAName}</span>
            )}
          </div>

          <div className="field">
            <span className="field-label">Model B</span>
            <select
              value={modelB}
              onChange={(e) => setModelB(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map(model => (
                <option key={model.id} value={String(model.id)}>
                  {model.name}
                </option>
              ))}
            </select>
            {modelBName && (
              <span className="helper-text">Selected: {modelBName}</span>
            )}
          </div>

          <div className="field">
            <span className="field-label">Image</span>
            <DragDrop onFileSelect={handleFile} />
            {file && (
              <span className="helper-text">File: {file.name}</span>
            )}
          </div>

          {error && <div className="compare-error">{error}</div>}

          <div className="compare-actions">
            <button
              className="btn primary"
              onClick={startCompare}
              disabled={!file || !modelA || !modelB || loading}
            >
              {loading ? "Comparing..." : "Run comparison"}
            </button>
            <button
              className="btn ghost"
              onClick={resetAll}
            >
              Reset
            </button>
          </div>

          <div className="compare-statuses">
            <div className="status-row">
              <span>Model A</span>
              <span className={`status-pill ${statusClass(status.a)}`}>
                {statusLabel(status.a)}
              </span>
            </div>
            <div className="status-row">
              <span>Model B</span>
              <span className={`status-pill ${statusClass(status.b)}`}>
                {statusLabel(status.b)}
              </span>
            </div>
          </div>
        </div>

        <div className="card compare-results">
          <div className="compare-results-header">
            <h3>Results</h3>
            {loading && <span className="status-pill running">Running</span>}
          </div>
          <div className="compare-results-grid">
            <div className="compare-result">
              <h4>{modelAName || "Model A"}</h4>
              <div className="compare-preview">
                {preview ? (
                  readyToShow ? (
                    <DetectionCanvas imageSrc={preview} predictions={results.a} />
                  ) : (
                    <span className="compare-waiting">Waiting for both tasks...</span>
                  )
                ) : (
                  <span className="compare-waiting">Upload an image first.</span>
                )}
              </div>
              {resultUrls.a && (
                <a href={resultUrls.a} target="_blank" rel="noreferrer">
                  Open raw result
                </a>
              )}
            </div>

            <div className="compare-result">
              <h4>{modelBName || "Model B"}</h4>
              <div className="compare-preview">
                {preview ? (
                  readyToShow ? (
                    <DetectionCanvas imageSrc={preview} predictions={results.b} />
                  ) : (
                    <span className="compare-waiting">Waiting for both tasks...</span>
                  )
                ) : (
                  <span className="compare-waiting">Upload an image first.</span>
                )}
              </div>
              {resultUrls.b && (
                <a href={resultUrls.b} target="_blank" rel="noreferrer">
                  Open raw result
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
