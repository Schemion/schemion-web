import { useEffect, useState } from "react"
import { getTasks } from "../../api/tasks"
import "./Tasks.css"

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError("Failed to load tasks. Please retry.")
    } finally {
      setLoading(false)
    }
  }

  const statusClass = (value) => {
    if (value === "succeeded") return "success"
    if (value === "failed") return "error"
    if (value === "running" || value === "queued") return "running"
    return ""
  }

  const renderField = (label, value) => (
    <div className="task-field">
      <span className="task-label">{label}</span>
      <span className="task-value">{value || "-"}</span>
    </div>
  )

  return (
    <div className="page tasks-page">
      <div className="page-header">
        <h1>Tasks</h1>
        <p>All created tasks with their current status.</p>
      </div>

      <div className="tasks-toolbar">
        <button className="btn ghost" onClick={loadTasks} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh list"}
        </button>
      </div>

      {error && <div className="tasks-error">{error}</div>}

      {loading && tasks.length === 0 ? (
        <div className="card tasks-empty">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card tasks-empty">
          <h3>No tasks yet</h3>
          <p>Create an inference or training task to see it listed here.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task, index) => (
            <div className="card task-card" key={task.id || index}>
              <div className="task-header">
                <div>
                  <h3>Task {task.id || ""}</h3>
                  <span className={`status-pill ${statusClass(task.status)}`}>
                    {task.status || "unknown"}
                  </span>
                </div>
              </div>
              <div className="task-fields">
                {renderField("Type", task.type || task.task_type)}
                {renderField("Model", task.model_name || task.model_id)}
                {renderField("Created", task.created_at || task.created)}
                {renderField("Updated", task.updated_at || task.updated)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
