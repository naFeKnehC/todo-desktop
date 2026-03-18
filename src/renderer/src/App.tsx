import { useState, useEffect, useCallback } from 'react'
import TitleBar from './components/TitleBar'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Settings from './components/Settings'

export interface Task {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type TaskDraft = Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>

function normalizeTask(task: Partial<Task>): Task {
  const createdAt = typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString()
  return {
    id: typeof task.id === 'string' ? task.id : Date.now().toString(36),
    title: typeof task.title === 'string' ? task.title : '',
    dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
    priority:
      task.priority === 'high' || task.priority === 'medium' || task.priority === 'low'
        ? task.priority
        : 'medium',
    completed: Boolean(task.completed),
    createdAt,
    updatedAt: typeof task.updatedAt === 'string' ? task.updatedAt : createdAt
  }
}

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  useEffect(() => {
    window.api.getTasks().then((loadedTasks) => {
      const normalizedTasks = loadedTasks.map((task) => normalizeTask(task))
      setTasks(normalizedTasks)

      const hasLegacyTask = loadedTasks.some((task) => typeof task.updatedAt !== 'string')
      if (hasLegacyTask) {
        window.api.setTasks(normalizedTasks)
      }
    })
  }, [])

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks)
    window.api.setTasks(newTasks)
  }, [])

  const addTask = useCallback(
    (task: TaskDraft) => {
      const timestamp = new Date().toISOString()
      const newTask: Task = {
        ...task,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        completed: false,
        createdAt: timestamp,
        updatedAt: timestamp
      }
      saveTasks([newTask, ...tasks])
    },
    [tasks, saveTasks]
  )

  const updateTask = useCallback(
    (id: string, task: TaskDraft) => {
      const timestamp = new Date().toISOString()
      saveTasks(tasks.map((t) => (t.id === id ? { ...t, ...task, updatedAt: timestamp } : t)))
      setEditingTaskId(null)
    },
    [tasks, saveTasks]
  )

  const toggleTask = useCallback(
    (id: string) => {
      const timestamp = new Date().toISOString()
      saveTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed, updatedAt: timestamp } : t
        )
      )
    },
    [tasks, saveTasks]
  )

  const deleteTask = useCallback(
    (id: string) => {
      saveTasks(tasks.filter((t) => t.id !== id))
      if (editingTaskId === id) {
        setEditingTaskId(null)
      }
    },
    [editingTaskId, tasks, saveTasks]
  )

  const editingTask = editingTaskId ? tasks.find((task) => task.id === editingTaskId) ?? null : null

  return (
    <div className="app">
      <TitleBar onToggleSettings={() => setShowSettings(!showSettings)} />
      {showSettings && <Settings />}
      <TaskForm
        editingTask={editingTask}
        onAdd={addTask}
        onUpdate={updateTask}
        onCancelEdit={() => setEditingTaskId(null)}
      />
      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onEdit={setEditingTaskId}
        onDelete={deleteTask}
      />
    </div>
  )
}

export default App
