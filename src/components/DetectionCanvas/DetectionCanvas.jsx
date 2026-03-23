import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

const CLASS_PALETTE = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
  "#1f77b4",
  "#ff7f0e"
]

const getClassName = (pred) => {
  if (!pred) return "unknown"
  if (pred.class !== undefined && pred.class !== null) return String(pred.class)
  if (pred.label !== undefined && pred.label !== null) return String(pred.label)
  if (pred.name !== undefined && pred.name !== null) return String(pred.name)
  return "unknown"
}

const getConfidence = (pred) => {
  if (!pred) return null
  if (typeof pred.confidence === "number") return pred.confidence
  if (typeof pred.score === "number") return pred.score
  return null
}

const hashString = (value) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const getClassColor = (pred) => {
  const className = getClassName(pred).toLowerCase()
  const index = hashString(className) % CLASS_PALETTE.length
  return CLASS_PALETTE[index]
}

const DetectionCanvas = forwardRef(function DetectionCanvas(
  { imageSrc, predictions, getColor },
  ref
) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getCompositeCanvas: () => {
      const canvas = canvasRef.current
      const img = imageRef.current
      if (!canvas || !img) return null

      const exportCanvas = document.createElement("canvas")
      exportCanvas.width = canvas.width
      exportCanvas.height = canvas.height

      const ctx = exportCanvas.getContext("2d")
      if (!ctx) return null

      ctx.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height)
      ctx.drawImage(canvas, 0, 0)

      return exportCanvas
    },
    getOverlayCanvas: () => canvasRef.current,
    getImageElement: () => imageRef.current
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext("2d")

    const draw = () => {
      const width = img.clientWidth || img.width
      const height = img.clientHeight || img.height

      if (!width || !height) return

      canvas.width = width
      canvas.height = height

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!Array.isArray(predictions) || predictions.length === 0) return

      predictions.forEach(pred => {
        if (!pred?.bbox || pred.bbox.length < 4) return

        const [x1, y1, x2, y2] = pred.bbox
        const boxWidth = x2 - x1
        const boxHeight = y2 - y1

        const color = getColor ? getColor(pred) : getClassColor(pred)

        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(x1, y1, boxWidth, boxHeight)

        ctx.fillStyle = color
        ctx.font = "14px Arial"

        const className = getClassName(pred)
        const confidence = getConfidence(pred)
        const label = confidence === null
          ? className
          : `${className} ${confidence.toFixed(2)}`

        const labelY = y1 - 6 < 12 ? y1 + 14 : y1 - 6
        ctx.fillText(label, x1, labelY)
      })
    }

    if (img.complete) {
      draw()
    } else {
      img.onload = draw
    }

    return () => {
      if (img) {
        img.onload = null
      }
    }
  }, [predictions, imageSrc, getColor])

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="result"
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0
        }}
      />
    </div>
  )
})

export default DetectionCanvas
