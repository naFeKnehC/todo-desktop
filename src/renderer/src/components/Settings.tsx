import { useState, useEffect, type ChangeEvent } from 'react'

function Settings(): JSX.Element {
  const [alwaysOnTop, setAlwaysOnTop] = useState(true)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    window.api.getSettings().then((s) => {
      setAlwaysOnTop(s.alwaysOnTop)
      setOpacity(s.opacity)
    })
  }, [])

  const handleTopToggle = async (): Promise<void> => {
    const nextValue = !alwaysOnTop
    await window.api.toggleTop(nextValue)
    setAlwaysOnTop(nextValue)
  }

  const handleOpacity = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const nextValue = parseFloat(e.target.value)
    const appliedValue = await window.api.setOpacity(nextValue)
    setOpacity(appliedValue)
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
    </div>
  )
}

export default Settings
