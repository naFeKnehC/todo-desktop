import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  minimize: () => Promise<void>
  performCloseAction: (action: 'quit' | 'tray') => Promise<void>
  toggleTop: (val: boolean) => Promise<boolean>
  setOpacity: (val: number) => Promise<number>
  getSettings: () => Promise<{
    alwaysOnTop: boolean
    opacity: number
    closeAction: 'ask' | 'quit' | 'tray'
  }>
  setCloseAction: (value: 'ask' | 'quit' | 'tray') => Promise<'ask' | 'quit' | 'tray'>
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
  archived: boolean
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
