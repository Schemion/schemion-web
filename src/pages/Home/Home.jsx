import { Link } from "react-router-dom"
import "./Home.css"

export default function Home() {
  return (
    <div className="page home-page">
      <section className="home-hero card">
        <span className="home-eyebrow">Schemion Platform</span>
        <h1>Train, compare, and deploy object detection models faster.</h1>
        <p>
          Centralize datasets, iterate on training, and run inference with
          confidence. Keep everything organized in one workflow.
        </p>
        <div className="home-actions">
          <Link to="/inference" className="btn primary">
            Run inference
          </Link>
          <Link to="/compare" className="btn ghost">
            Compare models
          </Link>
        </div>
      </section>

      <section className="home-grid">
        <div className="card feature-card">
          <h3>Inference Workspace</h3>
          <p>Upload images, inspect predictions, and validate results.</p>
          <Link to="/inference" className="feature-link">
            Open inference
          </Link>
        </div>
        <div className="card feature-card">
          <h3>Model Comparison</h3>
          <p>Pick two models and review outputs side-by-side on one image.</p>
          <Link to="/compare" className="feature-link">
            Open compare
          </Link>
        </div>
        <div className="card feature-card">
          <h3>Training Runs</h3>
          <p>Keep track of training experiments and prepare new tasks.</p>
          <Link to="/training" className="feature-link">
            Open training
          </Link>
        </div>
      </section>
    </div>
  )
}
