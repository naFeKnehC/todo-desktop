# AGENT

## Overview

Todo Desktop is a small Electron desktop todo application built with:

- Electron
- electron-vite
- React
- TypeScript
- electron-store

Core capabilities:

- frameless transparent desktop window
- task create, edit, toggle, and delete
- priority and due-date based sorting
- always-on-top toggle
- opacity control
- local persistence
- quick access to the local storage folder

## Current Status

Implemented files:

- `package.json`
- `electron.vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `tsconfig.web.json`
- `src/main/index.ts`
- `src/preload/index.ts`
- `src/preload/index.d.ts`
- `src/renderer/index.html`
- `src/renderer/src/main.tsx`
- `src/renderer/src/App.tsx`
- `src/renderer/src/components/TitleBar.tsx`
- `src/renderer/src/components/TaskForm.tsx`
- `src/renderer/src/components/TaskList.tsx`
- `src/renderer/src/components/Settings.tsx`
- `src/renderer/src/styles.css`

Verified commands:

- `npm run build`
- `npm run dev`
- `npm run dist:portable`

## Project Structure

```text
todo-desktop/
|- electron.vite.config.ts
|- package.json
|- tsconfig.json
|- tsconfig.node.json
|- tsconfig.web.json
`- src/
   |- main/
   |  `- index.ts
   |- preload/
   |  |- index.ts
   |  `- index.d.ts
   `- renderer/
      |- index.html
      `- src/
         |- main.tsx
         |- App.tsx
         |- styles.css
         `- components/
            |- TitleBar.tsx
            |- TaskForm.tsx
            |- TaskList.tsx
            `- Settings.tsx
```

## Runtime Model

All runtime data is stored through `electron-store`.

Top-level store shape:

```ts
type StoreSchema = {
  tasks: Task[]
  alwaysOnTop: boolean
  opacity: number
}
```

Task shape:

```ts
type Task = {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
  updatedAt: string
}
```

Field notes:

- `id`: unique task id
- `title`: todo title
- `dueDate`: target date in `YYYY-MM-DD`
- `priority`: `high`, `medium`, or `low`
- `completed`: completion state
- `createdAt`: creation timestamp in ISO 8601
- `updatedAt`: latest update timestamp in ISO 8601
- `alwaysOnTop`: persisted window pin state
- `opacity`: persisted window opacity, clamped to `0.3 - 1.0`

## Sorting Rules

Task list order:

1. `dueDate`
2. `priority`
3. `updatedAt`

Sorting details:

- earlier `dueDate` comes first
- tasks without a valid `dueDate` are placed later
- priority order is `high -> medium -> low`
- for equal due date and priority, more recently updated tasks come first

## Compatibility

Older persisted task records may not contain `updatedAt`.

On load, the renderer normalizes legacy tasks by:

- keeping the original `createdAt`
- filling missing `updatedAt` with `createdAt`
- writing normalized records back to storage

## Main Process

Implemented in `src/main/index.ts`:

- creates a frameless transparent BrowserWindow
- default window size is `360x520`
- exposes IPC for window controls
- persists tasks and settings
- exposes local storage path and opens the storage folder

## Preload

Implemented in `src/preload/index.ts`:

- exposes `window.api` through `contextBridge`
- bridges renderer access to all IPC handlers

## Renderer

Implemented behavior:

- custom draggable title bar
- task form for create and edit
- default due date starts as today
- after the user changes the date, new tasks continue using the changed date
- task list supports edit, toggle, and delete
- settings panel supports always-on-top, opacity, and storage-folder shortcut

## Build And Distribution

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Windows distributables:

```bash
npm run dist
```

Extra packaging commands:

```bash
npm run dist:dir
npm run dist:portable
```

Output:

- `release/*.exe`
- `release/win-unpacked/`

## Notes

- end users should use packaged `.exe` files instead of source code
- app data is stored under the current user's Electron `userData` directory
- if `Electron uninstall` appears during development, reinstall the Electron binary with `node node_modules\electron\install.js`
- the storage shortcut opens the folder that contains the persisted config file
