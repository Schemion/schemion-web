import { useEffect, useRef, useState } from "react"

import DragDrop from "../../components/DragDrop/DragDrop"
import DetectionCanvas from "../../components/DetectionCanvas/DetectionCanvas"

import { getModels } from "../../api/models"
import { createInferenceTask, getTask } from "../../api/tasks"

import "./Inference.css"

export default function Inference() {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState("")

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [loading, setLoading] = useState(false)

  const [resultUrl, setResultUrl] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const intervalRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    getModels()
      .then((data) => {
        if (isMounted) {
          setModels(data)
        }
      })
      .catch((e) => {
        console.error(e)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
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

  const handleFile = (selectedFile) => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    setPredictions(null)
    setResultUrl(null)
  }

  const clearAll = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setFile(null)
    setPreview(null)
    setPredictions(null)
    setResultUrl(null)
    setSelectedModel("")
    setLoading(false)
  }

  const startInference = async () => {
    if (!file || !selectedModel) return
    setLoading(true)
    try {
      const task = await createInferenceTask(file, selectedModel)
      pollTask(task.id)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const loadResult = async (url) => {
    const res = await fetch(url)
    const data = await res.json()
    setPredictions(data.predictions)
  }

  const pollTask = (taskId) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(async () => {
      try {
        const task = await getTask(taskId)

        if (task.status === "succeeded") {
          await loadResult(task.output_url)
          setResultUrl(task.output_url)
          setLoading(false)
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        if (task.status === "failed") {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 8000)
  }

  const selectedModelName = models.find(
    model => String(model.id) === String(selectedModel)
  )?.name

  const downloadAnnotatedImage = () => {
    const compositeCanvas = canvasRef.current?.getCompositeCanvas?.()
    if (!compositeCanvas) return

    const baseName = file?.name
      ? file.name.replace(/\.[^.]+$/, "")
      : "inference-result"
    const filename = `${baseName}-detections.png`

    compositeCanvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, "image/png")
  }

  return (
    <div className="page inference-page">
      <div className="page-header">
        <h1>Inference</h1>
        <p>
          Choose a model, upload an image, and run inference with a clean preview
          of detections.
        </p>
      </div>

      <div className="inference-grid">
        <div className="card inference-controls">
          <div className="field">
            <span className="field-label">Model</span>
            <select
              className="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map(model => (
                <option key={model.id} value={String(model.id)}>
                  {model.name}
                </option>
              ))}
            </select>
            {selectedModelName && (
              <span className="helper-text">Selected: {selectedModelName}</span>
            )}
          </div>

          <div className="field">
            <span className="field-label">Image</span>
            <DragDrop onFileSelect={handleFile} />
            {file && (
              <span className="helper-text">File: {file.name}</span>
            )}
          </div>

          <div className="inference-actions">
            <button
              className="btn primary"
              onClick={startInference}
              disabled={!file || !selectedModel || loading}
            >
              {loading ? "Processing..." : "Run inference"}
            </button>
            <button
              className="btn ghost"
              onClick={clearAll}
              disabled={loading}
            >
              Reset
            </button>
          </div>

          {resultUrl && (
            <div className="result-card">
              <span className="field-label">Result JSON</span>
              <a href={resultUrl} target="_blank" rel="noreferrer">
                Open raw result
              </a>
            </div>
          )}
        </div>

        <div className="card inference-preview">
          <div className="preview-header">
            <h3>Preview</h3>
            <div className="preview-actions">
              {loading && <span className="status-pill running">Running</span>}
              <button
                className="btn ghost"
                onClick={downloadAnnotatedImage}
                disabled={!predictions}
              >
                Download annotated
              </button>
            </div>
          </div>
          <div className="preview-area">
            {preview ? (
              predictions ? (
                <DetectionCanvas
                  ref={canvasRef}
                  imageSrc={preview}
                  predictions={predictions}
                />
              ) : (
                <img src={preview} alt="preview" />
              )
            ) : (
              <div className="preview-empty">
                Upload an image to see the preview here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
