import { useEffect, useRef } from "react"

export default function DetectionCanvas({ imageSrc, predictions }) {

  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (!imageRef.current) return
    if (!predictions) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const img = imageRef.current

    canvas.width = img.width
    canvas.height = img.height

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    predictions.forEach(pred => {

      const [x1, y1, x2, y2] = pred.bbox

      const width = x2 - x1
      const height = y2 - y1

      ctx.strokeStyle = "red"
      ctx.lineWidth = 2

      ctx.strokeRect(x1, y1, width, height)

      ctx.fillStyle = "red"
      ctx.font = "14px Arial"

      const label = `${pred.class} ${pred.confidence.toFixed(2)}`

      ctx.fillText(label, x1, y1 - 5)

    })

  }, [predictions])

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="result"
        onLoad={() => {}}
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
}