import type { Task } from '../App'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
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

function TaskList({ tasks, onToggle, onDelete }: Props): JSX.Element {
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1

    const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
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
              {task.dueDate && <span className="task-due">{task.dueDate}</span>}
            </div>
          </div>
          <button className="task-delete" type="button" onClick={() => onDelete(task.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

export default TaskList
