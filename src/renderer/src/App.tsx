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
  archived: boolean
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

export type TaskDraft = Omit<
  Task,
  'id' | 'completed' | 'archived' | 'createdAt' | 'updatedAt' | 'archivedAt'
>
type CloseAction = 'ask' | 'quit' | 'tray'

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
    archived: Boolean(task.archived),
    createdAt,
    updatedAt: typeof task.updatedAt === 'string' ? task.updatedAt : createdAt,
    archivedAt: typeof task.archivedAt === 'string' ? task.archivedAt : null
  }
}

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [closeAction, setCloseAction] = useState<CloseAction>('ask')
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [pendingCloseAction, setPendingCloseAction] = useState<'quit' | 'tray'>('tray')
  const [rememberCloseAction, setRememberCloseAction] = useState(false)

  useEffect(() => {
    Promise.all([window.api.getTasks(), window.api.getSettings()]).then(([loadedTasks, settings]) => {
      const normalizedTasks = loadedTasks.map((task) => normalizeTask(task))
      setTasks(normalizedTasks)
      setAlwaysOnTop(settings.alwaysOnTop)
      setCloseAction(settings.closeAction)

      const hasLegacyTask = loadedTasks.some(
        (task) => typeof task.updatedAt !== 'string' || typeof task.archived !== 'boolean'
      )
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
        archived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        archivedAt: null
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

  const archiveTask = useCallback(
    (id: string) => {
      const timestamp = new Date().toISOString()
      saveTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, archived: true, archivedAt: timestamp, updatedAt: timestamp } : t
        )
      )
      if (editingTaskId === id) {
        setEditingTaskId(null)
      }
    },
    [editingTaskId, tasks, saveTasks]
  )

  const visibleTasks = tasks.filter((task) => !task.archived)
  const editingTask = editingTaskId ? visibleTasks.find((task) => task.id === editingTaskId) ?? null : null

  const handleAlwaysOnTopChange = useCallback(async (value: boolean) => {
    const appliedValue = await window.api.toggleTop(value)
    setAlwaysOnTop(appliedValue)
  }, [])

  const handleCloseActionChange = useCallback(async (value: CloseAction) => {
    await window.api.setCloseAction(value)
    setCloseAction(value)
  }, [])

  const executeCloseAction = useCallback(
    async (action: 'quit' | 'tray', remember: boolean) => {
      if (remember) {
        await handleCloseActionChange(action)
      }

      setShowCloseDialog(false)
      setRememberCloseAction(false)
      await window.api.performCloseAction(action)
    },
    [handleCloseActionChange]
  )

  const handleRequestClose = useCallback(() => {
    if (closeAction === 'quit' || closeAction === 'tray') {
      void executeCloseAction(closeAction, false)
      return
    }

    setPendingCloseAction('tray')
    setRememberCloseAction(false)
    setShowCloseDialog(true)
  }, [closeAction, executeCloseAction])

  return (
    <div className="app">
      <TitleBar
        alwaysOnTop={alwaysOnTop}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onToggleAlwaysOnTop={() => void handleAlwaysOnTopChange(!alwaysOnTop)}
        onRequestClose={handleRequestClose}
      />
      {showSettings && (
        <Settings
          alwaysOnTop={alwaysOnTop}
          closeAction={closeAction}
          onAlwaysOnTopChange={handleAlwaysOnTopChange}
          onCloseActionChange={handleCloseActionChange}
        />
      )}
      <TaskForm
        editingTask={editingTask}
        onAdd={addTask}
        onUpdate={updateTask}
        onCancelEdit={() => setEditingTaskId(null)}
      />
      <TaskList
        tasks={visibleTasks}
        onToggle={toggleTask}
        onEdit={setEditingTaskId}
        onDelete={archiveTask}
      />
      {showCloseDialog && (
        <div className="close-dialog-mask">
          <div className="close-dialog">
            <div className="close-dialog-title">{'\u5173\u95ed Todo Desktop'}</div>
            <div className="close-dialog-desc">
              {
                '\u8bf7\u9009\u62e9\u70b9\u51fb\u53f3\u4e0a\u89d2\u5173\u95ed\u6309\u94ae\u65f6\u7684\u884c\u4e3a'
              }
            </div>
            <div className="close-dialog-options">
              <button
                className={`close-option ${pendingCloseAction === 'quit' ? 'active' : ''}`}
                type="button"
                onClick={() => setPendingCloseAction('quit')}
              >
                {'\u76f4\u63a5\u5173\u95ed'}
              </button>
              <button
                className={`close-option ${pendingCloseAction === 'tray' ? 'active' : ''}`}
                type="button"
                onClick={() => setPendingCloseAction('tray')}
              >
                {'\u6700\u5c0f\u5316\u5230\u7cfb\u7edf\u6258\u76d8'}
              </button>
            </div>
            <label className="close-dialog-check">
              <input
                type="checkbox"
                checked={rememberCloseAction}
                onChange={(e) => setRememberCloseAction(e.target.checked)}
              />
              <span>{'\u8bb0\u4f4f\u672c\u6b21\u9009\u62e9\uff0c\u4ee5\u540e\u4e0d\u518d\u63d0\u793a'}</span>
            </label>
            <div className="close-dialog-actions">
              <button
                className="task-cancel-btn"
                type="button"
                onClick={() => {
                  setShowCloseDialog(false)
                  setRememberCloseAction(false)
                }}
              >
                {'\u53d6\u6d88'}
              </button>
              <button
                className="task-add-btn"
                type="button"
                onClick={() => void executeCloseAction(pendingCloseAction, rememberCloseAction)}
              >
                {'\u786e\u8ba4'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
