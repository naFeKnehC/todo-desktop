# Todo Desktop

A small desktop todo app built with Electron, Vite, React, and TypeScript.

## Features

- Frameless transparent desktop window
- Task creation with due date and priority
- Task list with sort, toggle, and delete
- Always-on-top toggle
- Window opacity control
- Local persistence with `electron-store`

## Stack

- Electron
- electron-vite
- React
- TypeScript
- electron-store

## Development

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

## Packaging

Build Windows distributables:

```bash
npm run dist
```

Build only a portable Windows executable:

```bash
npm run dist:portable
```

The packaged files are generated in `release/`.

## Project Structure

```text
src/
|- main/
|- preload/
`- renderer/
   |- index.html
   `- src/
      |- App.tsx
      |- main.tsx
      |- styles.css
      `- components/
```

## Notes

- End users should use the packaged `.exe`, not the source code
- App data is stored per user by `electron-store`
- If Electron is missing locally during development, run:

```bash
node node_modules\electron\install.js
```
