import { useState } from "react"
import "./DragDrop.css"

export default function DragDrop({ onFileSelect }) {

  const [dragActive, setDragActive] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files[0]

    if (file) {
      onFileSelect(file)
    }

  }

  const handleDrag = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleLeave = () => {
    setDragActive(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]

    if (file) {
      onFileSelect(file)
    }

  }

  return (
    <div
      className={`drop-zone ${dragActive ? "active" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragLeave={handleLeave}
    >
      <p>Drag & Drop image here</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
      />
    </div>
  )
}