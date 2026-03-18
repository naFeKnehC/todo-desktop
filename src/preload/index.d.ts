import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  minimize: () => Promise<void>
  close: () => Promise<void>
  toggleTop: (val: boolean) => Promise<boolean>
  setOpacity: (val: number) => Promise<number>
  getSettings: () => Promise<{ alwaysOnTop: boolean; opacity: number }>
  getTasks: () => Promise<Task[]>
  setTasks: (tasks: Task[]) => Promise<void>
}

interface Task {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
