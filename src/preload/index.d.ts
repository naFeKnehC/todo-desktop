import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  minimize: () => Promise<void>
  close: () => Promise<void>
  toggleTop: (val: boolean) => Promise<boolean>
  setOpacity: (val: number) => Promise<number>
  getSettings: () => Promise<{ alwaysOnTop: boolean; opacity: number }>
  getTasks: () => Promise<Task[]>
  setTasks: (tasks: Task[]) => Promise<void>
  getStoragePath: () => Promise<string>
  openStorageFolder: () => Promise<{
    path: string
    directory: string
    success: boolean
    error: string | null
  }>
}

interface Task {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
  updatedAt: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
