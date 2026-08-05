const BASELINE = 84;
const BAR_W = 18;
const BAR_GAP = 8;
const FIRST_X = 26;

// Demand thinning out month over month.
const heights = [58, 50, 43, 33, 24, 15];

const bars = heights.map((h, i) => ({
  x: FIRST_X + i * (BAR_W + BAR_GAP),
  y: BASELINE - h,
  height: h,
}));

// Sitting just above each bar keeps the line legible without detaching from them.
const points = bars.map((bar) => ({
  x: bar.x + BAR_W / 2,
  y: bar.y - 4,
}));

const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
const area = `${line} L${points.at(-1)!.x} ${BASELINE} L${points[0].x} ${BASELINE} Z`;
const head = points.at(-1)!;

export function SinkingMarket() {
  return (
    <div className="scene-stage scene-market">
      <svg
        className="scene-market__svg"
        viewBox="0 0 200 96"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="scene-market-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b6ecb" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2b6ecb" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The card's dot grid already supplies the graph paper, so the only rule
            drawn here is the axis the bars stand on. */}
        <line
          x1="14"
          x2="186"
          y1={BASELINE}
          y2={BASELINE}
          stroke="#d7deee"
          strokeWidth="1"
        />

        {bars.map((bar, i) => (
          <rect
            key={bar.x}
            className="scene-market__bar"
            x={bar.x}
            y={bar.y}
            width={BAR_W}
            height={bar.height}
            rx="2"
            fill="#c5d9f5"
            fillOpacity={0.95 - i * 0.11}
          />
        ))}

        <path
          className="scene-market__area"
          d={area}
          fill="url(#scene-market-fade)"
        />
        <path
          className="scene-market__line"
          d={line}
          stroke="#2b6ecb"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          className="scene-market__pulse"
          cx={head.x}
          cy={head.y}
          r="3.5"
          fill="none"
          stroke="#2b6ecb"
          strokeWidth="1.4"
        />
        <circle
          className="scene-market__head"
          cx={head.x}
          cy={head.y}
          r="3.5"
          fill="#2b6ecb"
          stroke="#fff"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  );
}
