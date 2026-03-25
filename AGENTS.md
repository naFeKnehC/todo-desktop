# Repository Guidelines

## 项目结构与模块划分

该仓库是一个基于 Electron、Vite、React 和 TypeScript 的桌面应用。核心代码位于 `src/`：

- `src/main/`：主进程，负责窗口创建、IPC 和持久化入口。
- `src/preload/`：预加载脚本，通过 `contextBridge` 暴露安全 API。
- `src/renderer/`：渲染进程页面；组件集中在 `src/renderer/src/components/`。
- `resources/`：打包图标等静态资源。
- `release/`：构建与分发产物输出目录，不应手动编辑。

## 构建、运行与打包命令

- `npm install`：安装依赖。
- `npm run dev`：启动 Electron 本地开发环境。
- `npm run build`：构建主进程、预加载和渲染进程代码到 `out/`。
- `npm run preview`：预览构建结果。
- `npm run dist`：构建并生成 Windows 安装包。
- `npm run dist:portable`：生成 Windows 便携版。
- `npm run dist:mac:arm64`：生成 macOS arm64 的 `dmg`/`zip`。

提交前至少运行一次 `npm run build`，涉及打包配置时再执行对应 `dist` 命令。

## 代码风格与命名约定

项目使用 TypeScript 与 React 函数组件，默认沿用现有风格：2 空格缩进、单引号、末尾分号。组件文件使用 PascalCase，如 `TaskList.tsx`、`TitleBar.tsx`；普通变量和函数使用 camelCase；IPC 名称、存储字段保持语义清晰，避免缩写。样式集中在 `src/renderer/src/styles.css`，新增 UI 组件优先复用现有 class 命名方式。

## 测试与验证

当前仓库未配置 Jest、Vitest 或 Playwright。新增功能时，至少完成以下验证：

- 运行 `npm run build` 确认 TypeScript 与打包入口通过。
- 手动验证任务新增、编辑、完成切换、删除，以及置顶和透明度设置。
- 修改打包流程后，验证 `release/` 中目标产物可生成。

如后续补充自动化测试，建议将测试文件放在对应模块旁，并使用 `*.test.ts` 或 `*.test.tsx` 命名。

## 提交与 Pull Request 规范

Git 历史同时出现了 `feat: ...` 和简短英文描述，建议统一为 Conventional Commits，例如 `feat: add storage folder shortcut`。每次提交只聚焦一个变更点。PR 需包含：变更目的、验证步骤、关联 issue；涉及界面改动时附截图；涉及打包配置时说明目标平台与产物。

## 配置与数据说明

应用数据通过 `electron-store` 写入 Electron `userData` 目录。不要提交本地生成的配置或打包结果；修改存储结构时，需考虑旧数据兼容与迁移。
