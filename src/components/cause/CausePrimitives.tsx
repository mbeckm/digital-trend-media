import type { ReactNode } from "react";

export function CauseVariantShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`cause-card cause-enter cause-anim ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CauseVisitor({ className }: { className: string }) {
  return (
    <span className={`cause-visitor cause-anim ${className}`}>
      <span className="cause-visitor__head" />
      <span className="cause-visitor__body" />
    </span>
  );
}

export function CauseCursor({ className }: { className: string }) {
  return (
    <svg
      className={`cause-cursor cause-anim ${className}`}
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
  );
}

export function CauseFailChip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`cause-fail-chip cause-anim ${className}`.trim()}>
      {children}
    </span>
  );
}
