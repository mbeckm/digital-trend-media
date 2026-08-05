import type { CSSProperties } from "react";

const stages = [
  { width: "100%", label: "52%" },
  { width: "84%", label: "46%" },
  { width: "66%", label: "40%" },
  { width: "48%", label: "34%" },
];

export function StalledPipeline() {
  return (
    <div className="scene-stage scene-pipe">
      <div className="scene-pipe__rows">
        <span className="scene-pipe__track" />
        {stages.map((stage) => (
          <div
            key={stage.width}
            className="scene-pipe__row"
            style={
              { "--w": stage.width, "--label-w": stage.label } as CSSProperties
            }
          >
            <span className="scene-pipe__label" />
            <span className="scene-pipe__chip" />
          </div>
        ))}
        {/* Permanent fail mark on stage 2; the lead arrives, waits, greys out. */}
        <span className="scene-pipe__stuck" aria-hidden />
        <span className="scene-pipe__lead" aria-hidden>
          <span className="scene-pipe__lead-core" />
          <span className="scene-pipe__lead-wait" />
        </span>
      </div>
    </div>
  );
}
