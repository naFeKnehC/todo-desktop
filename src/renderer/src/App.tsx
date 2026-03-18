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
}

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    window.api.getTasks().then((t) => setTasks(t as Task[]))
  }, [])

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks)
    window.api.setTasks(newTasks)
  }, [])

  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        completed: false,
        createdAt: new Date().toISOString()
      }
      saveTasks([newTask, ...tasks])
    },
    [tasks, saveTasks]
  )

  const toggleTask = useCallback(
    (id: string) => {
      saveTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    },
    [tasks, saveTasks]
  )

  const deleteTask = useCallback(
    (id: string) => {
      saveTasks(tasks.filter((t) => t.id !== id))
    },
    [tasks, saveTasks]
  )

  return (
    <div className="app">
      <TitleBar onToggleSettings={() => setShowSettings(!showSettings)} />
      {showSettings && <Settings />}
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  )
}

export default App
