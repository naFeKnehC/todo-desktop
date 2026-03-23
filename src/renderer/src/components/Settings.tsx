import { useState, useEffect, type ChangeEvent } from 'react'

type CloseAction = 'ask' | 'quit' | 'tray'

interface Props {
  alwaysOnTop: boolean
  closeAction: CloseAction
  onAlwaysOnTopChange: (value: boolean) => Promise<void>
  onCloseActionChange: (value: CloseAction) => Promise<void>
}

function Settings({
  alwaysOnTop,
  closeAction,
  onAlwaysOnTopChange,
  onCloseActionChange
}: Props): JSX.Element {
  const [opacity, setOpacity] = useState(1)
  const [storagePath, setStoragePath] = useState('')
  const [storageHint, setStorageHint] = useState('')

  useEffect(() => {
    Promise.all([window.api.getSettings(), window.api.getStoragePath()]).then(
      ([settings, path]) => {
        setOpacity(settings.opacity)
        setStoragePath(path)
      }
    )
  }, [])

  const handleTopToggle = async (): Promise<void> => {
    const nextValue = !alwaysOnTop
    await onAlwaysOnTopChange(nextValue)
  }

  const handleOpacity = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const nextValue = parseFloat(e.target.value)
    const appliedValue = await window.api.setOpacity(nextValue)
    setOpacity(appliedValue)
  }

  const handleOpenStorageFolder = async (): Promise<void> => {
    const result = await window.api.openStorageFolder()
    setStoragePath(result.path)
    setStorageHint(
      result.success
        ? '\u5df2\u6253\u5f00\u5b58\u50a8\u6587\u4ef6\u5939'
        : result.error || '\u6253\u5f00\u5b58\u50a8\u6587\u4ef6\u5939\u5931\u8d25'
    )
  }

  const handleCloseAction = async (e: ChangeEvent<HTMLSelectElement>): Promise<void> => {
    await onCloseActionChange(e.target.value as CloseAction)
  }

  return (
    <div className="settings">
      <div className="settings-row">
        <label>{'\u7a97\u53e3\u7f6e\u9876'}</label>
        <button className={`toggle ${alwaysOnTop ? 'on' : ''}`} type="button" onClick={handleTopToggle}>
          {alwaysOnTop ? '\u5f00' : '\u5173'}
        </button>
      </div>
      <div className="settings-row">
        <label>{`\u900f\u660e\u5ea6 ${Math.round(opacity * 100)}%`}</label>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={opacity}
          onChange={handleOpacity}
        />
      </div>
      <div className="settings-row">
        <label>{'\u5173\u95ed\u6309\u94ae\u884c\u4e3a'}</label>
        <select className="settings-select" value={closeAction} onChange={handleCloseAction}>
          <option value="ask">{'\u6bcf\u6b21\u8be2\u95ee'}</option>
          <option value="quit">{'\u76f4\u63a5\u5173\u95ed'}</option>
          <option value="tray">{'\u6700\u5c0f\u5316\u5230\u6258\u76d8'}</option>
        </select>
      </div>
      <div className="settings-row settings-storage">
        <label>{'\u672c\u5730\u5b58\u50a8'}</label>
        <button className="toggle" type="button" onClick={handleOpenStorageFolder}>
          {'\u6253\u5f00\u6587\u4ef6\u5939'}
        </button>
      </div>
      <div className="settings-path" title={storagePath}>
        {storagePath || '\u6b63\u5728\u8bfb\u53d6\u5b58\u50a8\u8def\u5f84...'}
      </div>
      {storageHint && <div className="settings-hint">{storageHint}</div>}
    </div>
  )
}

export default Settings
