import { useMemo, useState } from 'react'
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
  const [showCompleted, setShowCompleted] = useState(false)

  const sorted = useMemo(() => [...tasks].sort((a, b) => {
    const dueDateDiff = getDueDateOrder(a.dueDate) - getDueDateOrder(b.dueDate)
    if (dueDateDiff !== 0) return dueDateDiff

    const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    return getUpdatedAtOrder(b.updatedAt) - getUpdatedAtOrder(a.updatedAt)
  }), [tasks])

  const activeTasks = sorted.filter((task) => !task.completed)
  const completedTasks = sorted.filter((task) => task.completed)

  return (
    <div className="task-list">
      {sorted.length === 0 && <div className="task-empty">{'\u6682\u65e0\u4efb\u52a1'}</div>}
      {activeTasks.map((task) => (
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
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 11.75L3.35 9.25L9.75 2.85C10.15 2.45 10.8 2.45 11.2 2.85L13.15 4.8C13.55 5.2 13.55 5.85 13.15 6.25L6.75 12.65L4.25 13L3 11.75Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.75 3.85L12.15 7.25"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="task-delete"
              type="button"
              title={'归档'}
              onClick={() => onDelete(task.id)}
            >
              x
            </button>
          </div>
        </div>
      ))}
      {completedTasks.length > 0 && (
        <div className="task-completed-group">
          <button
            className="task-completed-toggle"
            type="button"
            onClick={() => setShowCompleted((value) => !value)}
          >
            <span>{`\u5df2\u5b8c\u6210 ${completedTasks.length}`}</span>
            <span className={`task-completed-arrow ${showCompleted ? 'open' : ''}`}>
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          {showCompleted &&
            completedTasks.map((task) => (
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
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 11.75L3.35 9.25L9.75 2.85C10.15 2.45 10.8 2.45 11.2 2.85L13.15 4.8C13.55 5.2 13.55 5.85 13.15 6.25L6.75 12.65L4.25 13L3 11.75Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.75 3.85L12.15 7.25"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="task-delete"
                    type="button"
                    title={'归档'}
                    onClick={() => onDelete(task.id)}
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default TaskList
