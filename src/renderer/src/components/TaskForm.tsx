import { useState, type FormEvent } from 'react'
import type { Task } from '../App'

interface Props {
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void
}

function TaskForm({ onAdd }: Props): JSX.Element {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({ title: title.trim(), dueDate, priority })
    setTitle('')
    setDueDate('')
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
          onChange={(e) => setDueDate(e.target.value)}
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
        <button className="task-add-btn" type="submit">
          {'\u6dfb\u52a0'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
