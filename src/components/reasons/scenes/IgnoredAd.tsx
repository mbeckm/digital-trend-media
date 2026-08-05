export function IgnoredAd() {
  return (
    <div className="scene-stage scene-ad">
      <div className="scene-ad__card">
        <div className="scene-ad__thumb" />
        <div className="scene-ad__meta">
          <div className="scene-ad__top">
            <span className="scene-ad__tag">Gesponsert</span>
            <span className="scene-ad__stat">0 Klicks</span>
          </div>
          <span className="scene-ad__bar" style={{ width: "82%" }} />
          <span className="scene-ad__bar" style={{ width: "58%" }} />
          <div className="scene-ad__action">
            <span className="scene-ad__cta" />
            <svg
              className="scene-ad__cursor"
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
            >
              <path
                d="M1 1.2 11.4 9.1 6.2 9.6 8.9 15.1 6.6 16 3.9 10.6 1 13.6Z"
                fill="#fff"
                stroke="#132c55"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
