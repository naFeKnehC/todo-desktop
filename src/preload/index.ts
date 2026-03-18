import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type TaskRecord = {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
}

type WindowSettings = {
  alwaysOnTop: boolean
  opacity: number
}

type OpenStorageFolderResult = {
  path: string
  directory: string
  success: boolean
  error: string | null
}

const api = {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
  toggleTop: (val: boolean) => ipcRenderer.invoke('window:toggleTop', val),
  setOpacity: (val: number) => ipcRenderer.invoke('window:setOpacity', val),
  getSettings: (): Promise<WindowSettings> => ipcRenderer.invoke('window:getSettings'),
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
