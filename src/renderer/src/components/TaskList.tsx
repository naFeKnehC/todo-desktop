import type { Task } from '../App'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const priorityLabel: Record<Task['priority'], string> = {
  high: '\u9ad8',
  medium: '\u4e2d',
  low: '\u4f4e'
}

const priorityColor: Record<Task['priority'], string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6'
}

function getDueDateOrder(date: string): number {
  if (!date) return Number.POSITIVE_INFINITY

  const parsed = Date.parse(`${date}T00:00:00`)
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

function getUpdatedAtOrder(value: string): number {
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function TaskList({ tasks, onToggle, onEdit, onDelete }: Props): JSX.Element {
  const sorted = [...tasks].sort((a, b) => {
    const dueDateDiff = getDueDateOrder(a.dueDate) - getDueDateOrder(b.dueDate)
    if (dueDateDiff !== 0) return dueDateDiff

    const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    return getUpdatedAtOrder(b.updatedAt) - getUpdatedAtOrder(a.updatedAt)
  })

  return (
    <div className="task-list">
      {sorted.length === 0 && <div className="task-empty">{'\u6682\u65e0\u4efb\u52a1'}</div>}
      {sorted.map((task) => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <button className="task-check" type="button" onClick={() => onToggle(task.id)}>
            {task.completed ? '\u2713' : '\u25cb'}
          </button>
          <div className="task-content">
            <span className="task-title">{task.title}</span>
            <div className="task-meta">
              <span
                className="task-priority-tag"
                style={{ background: priorityColor[task.priority] }}
              >
                {priorityLabel[task.priority]}
              </span>
              <div className="task-time-group">
                {task.dueDate && (
                  <span className="task-due">{`\u622a\u6b62\u65f6\u95f4\uff1a${task.dueDate}`}</span>
                )}
              </div>
            </div>
          </div>
          <div className="task-actions">
            <button
              className="task-edit"
              type="button"
              title={'\u7f16\u8f91'}
              onClick={() => onEdit(task.id)}
            >
              {'\u7f16'}
            </button>
            <button className="task-delete" type="button" onClick={() => onDelete(task.id)}>
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList
