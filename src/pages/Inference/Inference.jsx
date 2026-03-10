import { useEffect, useState } from "react"

import DragDrop from "../../components/DragDrop/DragDrop"
import DetectionCanvas from "../../components/DetectionCanvas/DetectionCanvas"

import { getModels } from "../../api/models"
import { createInferenceTask, getTask } from "../../api/tasks"

import "./Inference.css"

export default function Inference() {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [loading, setLoading] = useState(false)

  const [resultUrl, setResultUrl] = useState(null)
  const [predictions, setPredictions] = useState(null)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const data = await getModels()
      setModels(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFile = (file) => {
    setFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
    setPredictions(null)
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
    const interval = setInterval(async () => {
      try {
        const task = await getTask(taskId)

        if (task.status === "succeeded") {
          await loadResult(task.output_url)
          setResultUrl(task.output_url)
          setLoading(false)
          clearInterval(interval)
        }

        if (task.status === "failed") {
          clearInterval(interval)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        clearInterval(interval)
      }
    }, 10000)
  }

  return (
    <div className="inference-page">
      <h1>Inference</h1>
      <select
        className="model-select"
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="">Select model</option>
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <DragDrop onFileSelect={handleFile} />
      {preview && (
        <div className="preview">
          {predictions ? (
            <DetectionCanvas
              imageSrc={preview}
              predictions={predictions}
            />
          ) : (
            <img src={preview} alt="preview" />
          )}
        </div>
      )}
      <button
        onClick={startInference}
        disabled={!file || !selectedModel || loading}
      >
        {loading ? "Processing..." : "Run inference"}
      </button>

      {resultUrl && (
        <div className="result">
          <h3>Result JSON</h3>
          <a href={resultUrl} target="_blank">
            Open raw result
          </a>
        </div>
      )}
    </div>
  )
}