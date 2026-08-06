export function CalendarScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-cal">
          <div className="scene-cal__head">
            <span className="scene-cal__label">Termin</span>
            <span className="scene-cal__chip">frei</span>
          </div>
          <div className="scene-cal__grid">
            <span className="scene-cal__cell scene-cal__cell--mute" />
            <span className="scene-cal__cell" />
            <span className="scene-cal__cell scene-cal__cell--pick">
              <span className="scene-cal__check">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4.1 3.2 5.8 6.5 2.2"
                    stroke="#2b6ecb"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
            <span className="scene-cal__cell" />
            <span className="scene-cal__cell" />
            <span className="scene-cal__cell scene-cal__cell--mute" />
            <span className="scene-cal__cell" />
            <span className="scene-cal__cell scene-cal__cell--mute" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalysisScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-analysis">
          <div className="scene-analysis__sheet">
            <span className="scene-analysis__bar scene-analysis__bar--a" />
            <span className="scene-analysis__bar scene-analysis__bar--b" />
            <span className="scene-analysis__bar scene-analysis__bar--c" />
            <span className="scene-analysis__hotspot" />
          </div>
          <div className="scene-analysis__glass">
            <span className="scene-analysis__lens" />
            <span className="scene-analysis__handle" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PathScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-strategy">
          <div className="scene-strategy__options">
            <span className="scene-strategy__opt scene-strategy__opt--a" />
            <span className="scene-strategy__opt scene-strategy__opt--b" />
            <span className="scene-strategy__opt scene-strategy__opt--c" />
          </div>
          <div className="scene-strategy__beam" />
          <div className="scene-strategy__target">
            <span className="scene-strategy__ring" />
            <span className="scene-strategy__ring scene-strategy__ring--mid" />
            <span className="scene-strategy__core" />
          </div>
          <div className="scene-strategy__tag">Botschaft</div>
        </div>
      </div>
    </div>
  );
}

export function KickoffScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-kick">
          <div className="scene-kick__tile scene-kick__tile--accent">
            <span className="scene-kick__avatar" />
          </div>
          <div className="scene-kick__tile">
            <span className="scene-kick__avatar" />
          </div>
          <div className="scene-kick__tile">
            <span className="scene-kick__avatar" />
          </div>
          <div className="scene-kick__tile scene-kick__tile--accent">
            <span className="scene-kick__avatar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScriptScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-script">
          <span className="scene-script__row" />
          <span className="scene-script__row" />
          <span className="scene-script__row" />
          <span className="scene-script__row" />
        </div>
      </div>
    </div>
  );
}

export function StoryboardScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-board">
          <span className="scene-board__frame" />
          <span className="scene-board__frame" />
          <span className="scene-board__frame" />
        </div>
      </div>
    </div>
  );
}

export function ReelScene() {
  return (
    <div className="spine-scene" aria-hidden>
      <div className="spine-scene__stage">
        <div className="scene-reel">
          <span className="scene-reel__bar scene-reel__bar--top" />
          <span className="scene-reel__play" />
          <span className="scene-reel__bar scene-reel__bar--bot" />
        </div>
      </div>
    </div>
  );
}
