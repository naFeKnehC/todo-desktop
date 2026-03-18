# Todo Desktop - Guide

## 1. Install

```bash
cd D:\project\todo-desktop
npm install
```

If the Electron binary is missing, install it separately:

```bash
node node_modules\electron\install.js
```

## 2. Current Status

Completed:
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

Verified:
- `npm run build`
- `npm run dev`

## 3. Project Structure

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

## 4. Implemented

Main process:
- Frameless transparent window
- Default size `360x520`
- Persistent tasks and settings with `electron-store`
- IPC for task read/write, always-on-top, opacity, minimize and close

Preload:
- `window.api` exposed via `contextBridge`
- All renderer IPC calls are bridged

Renderer:
- Custom title bar with drag area
- Task form with title, date and priority
- Task list with sorting, toggle and delete
- Settings panel with always-on-top and opacity

## 5. Distribution

For development:

```bash
npm run dev
```

For production build output:

```bash
npm run build
```

For Windows distributables:

```bash
npm run dist
```

Expected output:
- `release/*.exe` installer
- `release/*portable*.exe` portable app

Extra scripts:

```bash
npm run dist:dir
npm run dist:portable
```

Notes:
- End users should install from packaged `.exe`, not from source code
- `electron-store` data is stored per user on the target machine
- If `Electron uninstall` appears, the Electron binary is incomplete and must be reinstalled
