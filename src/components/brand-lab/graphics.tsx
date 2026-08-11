/** Occasional explainer-style marks — use sparingly, not as wallpaper. */

import type { ReactNode } from "react";

export function ScribbleArrow({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 48"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 28c18-18 42-26 68-18 14 4 26 14 36 26"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength={100}
        style={{
          strokeDasharray: 100,
          animation: "bl-draw-in 0.9s var(--bl-ease-out) both",
        }}
      />
      <path
        d="M92 22l16 14-18 2"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpeechBubble({
  children,
  className = "",
  tone = "yellow",
}: {
  children: ReactNode;
  className?: string;
  tone?: "yellow" | "blue" | "green" | "orange" | "cream";
}) {
  const tones = {
    yellow: "bg-[var(--bl-yellow)]",
    blue: "bg-[var(--bl-blue)] text-white",
    green: "bg-[var(--bl-green)] text-white",
    orange: "bg-[var(--bl-orange)] text-white",
    cream: "bg-[var(--bl-surface)]",
  } as const;

  return (
    <div
      className={`relative rounded-[var(--bl-radius-md)] border-[2.5px] border-[var(--bl-ink)] px-4 py-3 font-[family-name:var(--font-brand-display)] text-sm font-bold leading-snug tracking-[-0.01em] shadow-[3px_3px_0_var(--bl-ink)] ${tones[tone]} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-2 left-6 size-3 rotate-45 border-b-[2.5px] border-r-[2.5px] border-[var(--bl-ink)] bg-inherit"
      />
    </div>
  );
}

export function DotBurst({
  className = "",
  color = "var(--bl-orange)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="30"
          y="4"
          width="4"
          height="12"
          rx="2"
          fill={color}
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
    </svg>
  );
}

export function SquiggleUnderline({
  className = "",
  color = "var(--bl-yellow)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M2 8c20-8 40 6 60 0s40-8 60 0 40 8 60 0 20-6 16-4"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex size-14 items-center justify-center rounded-full border-[2.5px] border-[var(--bl-ink)] bg-[var(--bl-yellow)] shadow-[3px_3px_0_var(--bl-ink)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path d="M8 5.5v13l11-6.5L8 5.5Z" fill="var(--bl-ink)" />
      </svg>
    </span>
  );
}
