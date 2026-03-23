interface Props {
  alwaysOnTop: boolean
  onToggleSettings: () => void
  onToggleAlwaysOnTop: () => void
  onRequestClose: () => void
}

function TitleBar({
  alwaysOnTop,
  onToggleSettings,
  onToggleAlwaysOnTop,
  onRequestClose
}: Props): JSX.Element {
  return (
    <div className="titlebar">
      <span className="titlebar-title">{'\u684c\u9762\u5f85\u529e'}</span>
      <div className="titlebar-btns">
        <button
          className="titlebar-btn"
          type="button"
          onClick={onToggleSettings}
          title={'\u8bbe\u7f6e'}
        >
          {'\u2699'}
        </button>
        <button
          className={`titlebar-btn ${alwaysOnTop ? 'active' : ''}`}
          type="button"
          onClick={onToggleAlwaysOnTop}
          title={alwaysOnTop ? '\u53d6\u6d88\u7f6e\u9876' : '\u7a97\u53e3\u7f6e\u9876'}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M5.25 2.75H10.75L12.5 5.25L9.5 6.5V10.25L8 11.75L6.5 10.25V6.5L3.5 5.25L5.25 2.75Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 11.75V13.25"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          className="titlebar-btn"
          type="button"
          onClick={() => window.api.minimize()}
          title={'\u6700\u5c0f\u5316'}
        >
          -
        </button>
        <button
          className="titlebar-btn close"
          type="button"
          onClick={onRequestClose}
          title={'\u5173\u95ed'}
        >
          x
        </button>
      </div>
    </div>
  )
}

export default TitleBar
