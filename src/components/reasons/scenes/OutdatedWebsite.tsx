export function OutdatedWebsite() {
  return (
    <div className="scene-stage">
      <div className="scene-window__frame">
        <div className="scene-window__chrome">
          <span className="scene-window__dot" />
          <span className="scene-window__dot" />
          <span className="scene-window__dot" />
          <span className="scene-window__url">
            <span className="scene-window__caret" />
          </span>
        </div>
        <div className="scene-window__viewport">
          <div className="scene-window__body">
            <div className="scene-window__nav">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="scene-window__banner" />
            <div className="scene-window__bar" style={{ width: "78%" }} />
            <div className="scene-window__bar" style={{ width: "56%" }} />
            <div className="scene-window__cta" />
          </div>
          {/* An always-visible chunky scrollbar dates the window as much as the
              bevelled button does. */}
          <div className="scene-window__scroll">
            <span className="scene-window__thumb" />
          </div>
        </div>
        {/* Visitor lands, glances, bounces — the empty chip is what stays behind. */}
        <span className="scene-window__visitor" aria-hidden>
          <span className="scene-window__visitor-head" />
          <span className="scene-window__visitor-body" />
        </span>
        <span className="scene-window__stat">0 Anfragen</span>
      </div>
    </div>
  );
}
