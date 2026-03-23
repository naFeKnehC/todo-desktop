import { useEffect, useRef, useState, type FormEvent } from 'react'
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

function formatDueDate(value: string): string {
  if (!value) {
    return '选择日期'
  }

  const [year, month, day] = value.split('-')
  if (!year || !month || !day) {
    return value
  }

  return `${year}-${month}-${day}`
}

function TaskForm({ editingTask, onAdd, onUpdate, onCancelEdit }: Props): JSX.Element {
  const [title, setTitle] = useState('')
  const [defaultDueDate, setDefaultDueDate] = useState(() => getTodayDate())
  const [dueDate, setDueDate] = useState(() => getTodayDate())
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const dateInputRef = useRef<HTMLInputElement | null>(null)

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

  const handleDatePickerOpen = (): void => {
    if (typeof dateInputRef.current?.showPicker === 'function') {
      dateInputRef.current.showPicker()
    }
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
        <div className="task-date-wrap">
          <div className="task-date-display" aria-hidden="true">
            <span className="task-date-text">{formatDueDate(dueDate)}</span>
            <span className="task-date-icon">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M4 2.5V4M12 2.5V4M2.75 6H13.25M3.75 4H12.25C12.8 4 13.25 4.45 13.25 5V12.25C13.25 12.8 12.8 13.25 12.25 13.25H3.75C3.2 13.25 2.75 12.8 2.75 12.25V5C2.75 4.45 3.2 4 3.75 4Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <input
            ref={dateInputRef}
            className="task-date"
            type="date"
            value={dueDate}
            onClick={handleDatePickerOpen}
            onFocus={handleDatePickerOpen}
            onChange={(e) => handleDueDateChange(e.target.value)}
          />
        </div>
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
