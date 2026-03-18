import { useEffect, useState, type FormEvent } from 'react'
import type { Task, TaskDraft } from '../App'

interface Props {
  editingTask: Task | null
  onAdd: (task: TaskDraft) => void
  onUpdate: (id: string, task: TaskDraft) => void
  onCancelEdit: () => void
}

function getTodayDate(): string {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

function TaskForm({ editingTask, onAdd, onUpdate, onCancelEdit }: Props): JSX.Element {
  const [title, setTitle] = useState('')
  const [defaultDueDate, setDefaultDueDate] = useState(() => getTodayDate())
  const [dueDate, setDueDate] = useState(() => getTodayDate())
  const [priority, setPriority] = useState<Task['priority']>('medium')

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDueDate(editingTask.dueDate)
      setPriority(editingTask.priority)
      return
    }

    setTitle('')
    setDueDate(defaultDueDate)
    setPriority('medium')
  }, [editingTask])

  const handleDueDateChange = (value: string): void => {
    setDueDate(value)
    if (!editingTask) {
      setDefaultDueDate(value)
    }
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    if (!title.trim()) return

    const taskDraft: TaskDraft = { title: title.trim(), dueDate, priority }

    if (editingTask) {
      onUpdate(editingTask.id, taskDraft)
      return
    }

    onAdd(taskDraft)
    setTitle('')
    setPriority('medium')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-input"
        type="text"
        placeholder={'\u6dfb\u52a0\u65b0\u4efb\u52a1...'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="task-form-row">
        <input
          className="task-date"
          type="date"
          value={dueDate}
          onChange={(e) => handleDueDateChange(e.target.value)}
        />
        <select
          className="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
        >
          <option value="high">{'\u9ad8'}</option>
          <option value="medium">{'\u4e2d'}</option>
          <option value="low">{'\u4f4e'}</option>
        </select>
        <div className="task-form-actions">
          {editingTask && (
            <button className="task-cancel-btn" type="button" onClick={onCancelEdit}>
              {'\u53d6\u6d88'}
            </button>
          )}
          <button className="task-add-btn" type="submit">
            {editingTask ? '\u4fdd\u5b58' : '\u6dfb\u52a0'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default TaskForm
