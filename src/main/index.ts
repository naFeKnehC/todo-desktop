import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { dirname, join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'

type TaskRecord = {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
}

type StoreSchema = {
  tasks: TaskRecord[]
  alwaysOnTop: boolean
  opacity: number
}

const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    alwaysOnTop: true,
    opacity: 1
  }
})

let mainWindow: BrowserWindow | null = null

function clampOpacity(value: number): number {
  return Math.min(1, Math.max(0.3, value))
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 520,
    minWidth: 320,
    minHeight: 400,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: store.get('alwaysOnTop'),
    opacity: clampOpacity(store.get('opacity')),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('window:close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('window:toggleTop', (_, value: boolean) => {
    mainWindow?.setAlwaysOnTop(value)
    store.set('alwaysOnTop', value)
    return value
  })

  ipcMain.handle('window:setOpacity', (_, value: number) => {
    const nextOpacity = clampOpacity(value)
    mainWindow?.setOpacity(nextOpacity)
    store.set('opacity', nextOpacity)
    return nextOpacity
  })

  ipcMain.handle('window:getSettings', () => ({
    alwaysOnTop: store.get('alwaysOnTop'),
    opacity: clampOpacity(store.get('opacity'))
  }))

  ipcMain.handle('store:getTasks', () => store.get('tasks'))
  ipcMain.handle('store:setTasks', (_, tasks: TaskRecord[]) => {
    store.set('tasks', tasks)
  })
  ipcMain.handle('store:getStoragePath', () => store.path)
  ipcMain.handle('store:openStorageFolder', async () => {
    const storagePath = store.path
    const storageDir = dirname(storagePath)
    const error = await shell.openPath(storageDir)

    return {
      path: storagePath,
      directory: storageDir,
      success: error === '',
      error: error || null
    }
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.todo-desktop')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
