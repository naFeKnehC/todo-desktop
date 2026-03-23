import { app, shell, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron'
import { dirname, join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'

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

type StoreSchema = {
  tasks: TaskRecord[]
  alwaysOnTop: boolean
  opacity: number
  closeAction: 'ask' | 'quit' | 'tray'
}

const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    alwaysOnTop: false,
    opacity: 1,
    closeAction: 'ask'
  }
})

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function getAssetPath(fileName: string): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'resources', fileName)
  }

  return join(__dirname, `../../resources/${fileName}`)
}

function getWindowIconPath(): string {
  return getAssetPath('icon.png')
}

function getTrayIconPath(): string {
  return getAssetPath(process.platform === 'win32' ? 'icon.ico' : 'icon.png')
}

function createTray(): void {
  if (tray) {
    return
  }

  tray = new Tray(nativeImage.createFromPath(getTrayIconPath()))
  tray.setToolTip('Todo Desktop')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '显示主窗口',
        click: () => {
          showMainWindow()
        }
      },
      {
        label: '退出',
        click: () => {
          quitApplication()
        }
      }
    ])
  )

  tray.on('double-click', () => {
    showMainWindow()
  })

  tray.on('click', () => {
    showMainWindow()
  })
}

function showMainWindow(): void {
  if (!mainWindow) {
    return
  }

  mainWindow.setSkipTaskbar(false)
  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }
  mainWindow.show()
  mainWindow.focus()
}

function hideToTray(): void {
  if (!mainWindow) {
    return
  }

  createTray()
  mainWindow.setSkipTaskbar(true)
  mainWindow.hide()
}

function quitApplication(): void {
  app.quit()
}

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
    icon: getWindowIconPath(),
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

  ipcMain.handle('window:performCloseAction', (_, action: 'quit' | 'tray') => {
    if (action === 'tray') {
      hideToTray()
      return
    }

    quitApplication()
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
    opacity: clampOpacity(store.get('opacity')),
    closeAction: store.get('closeAction')
  }))

  ipcMain.handle('window:setCloseAction', (_, value: 'ask' | 'quit' | 'tray') => {
    store.set('closeAction', value)
    return value
  })

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
  app.setName('Todo Desktop')
  electronApp.setAppUserModelId('com.todo.desktop')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else showMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
