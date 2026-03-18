interface Props {
  onToggleSettings: () => void
}

function TitleBar({ onToggleSettings }: Props): JSX.Element {
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
          onClick={() => window.api.close()}
          title={'\u5173\u95ed'}
        >
          x
        </button>
      </div>
    </div>
  )
}

export default TitleBar
