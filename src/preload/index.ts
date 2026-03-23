import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type TaskRecord = {
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

type WindowSettings = {
  alwaysOnTop: boolean
  opacity: number
  closeAction: 'ask' | 'quit' | 'tray'
}

type OpenStorageFolderResult = {
  path: string
  directory: string
  success: boolean
  error: string | null
}

const api = {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  performCloseAction: (action: 'quit' | 'tray') => ipcRenderer.invoke('window:performCloseAction', action),
  toggleTop: (val: boolean) => ipcRenderer.invoke('window:toggleTop', val),
  setOpacity: (val: number) => ipcRenderer.invoke('window:setOpacity', val),
  getSettings: (): Promise<WindowSettings> => ipcRenderer.invoke('window:getSettings'),
  setCloseAction: (value: 'ask' | 'quit' | 'tray') => ipcRenderer.invoke('window:setCloseAction', value),
  getTasks: (): Promise<TaskRecord[]> => ipcRenderer.invoke('store:getTasks'),
  setTasks: (tasks: TaskRecord[]) => ipcRenderer.invoke('store:setTasks', tasks),
  getStoragePath: (): Promise<string> => ipcRenderer.invoke('store:getStoragePath'),
  openStorageFolder: (): Promise<OpenStorageFolderResult> =>
    ipcRenderer.invoke('store:openStorageFolder')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
