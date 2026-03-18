# Todo Desktop

一个基于 Electron、Vite、React 和 TypeScript 的桌面待办应用。

## 功能

- 无边框透明桌面窗口
- 支持任务标题、截止日期、优先级
- 任务列表支持排序、完成切换、删除
- 支持窗口置顶
- 支持窗口透明度调节
- 使用 `electron-store` 本地持久化数据

## 技术栈

- Electron
- electron-vite
- React
- TypeScript
- electron-store

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产文件：

```bash
npm run build
```

## 打包分发

打包 Windows 安装产物：

```bash
npm run dist
```

仅打包 Windows 便携版：

```bash
npm run dist:portable
```

打包产物输出在 `release/` 目录。

## 项目结构

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

## 说明

- 给最终用户使用时，应直接分发打包后的 `.exe`，不要分发源码
- 应用数据通过 `electron-store` 存在 Electron 的 `userData` 目录中
- 在 Windows 下，通常位于 `C:\Users\你的用户名\AppData\Roaming\应用名\config.json`
- 对这个项目，可优先到 `%APPDATA%` 下查找 `todo-desktop` 或 `Todo Desktop` 相关目录
- 项目与数据结构说明见 `AGENT.md`
- 如果开发环境提示 Electron 缺失，可执行：

```bash
node node_modules\electron\install.js
```
