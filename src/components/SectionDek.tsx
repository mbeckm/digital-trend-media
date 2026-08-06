type SectionDekProps = {
  lead: string;
  rest?: string;
  align?: "start" | "center";
  tone?: "light" | "dark";
  size?: "hero" | "section" | "compact";
};

const sizeClass = {
  // Wider measure so the block reads as 2–4 lines, not a tall column.
  hero: "max-w-[40rem] text-[clamp(1.25rem,2vw,1.5rem)]",
  section: "max-w-[48rem] text-[clamp(1.375rem,2.4vw,1.875rem)]",
  compact: "max-w-[40rem] text-[clamp(1.2rem,2vw,1.5rem)]",
} as const;

export function SectionDek({
  lead,
  rest,
  align = "start",
  tone = "light",
  size = "section",
}: SectionDekProps) {
  const ink = tone === "dark" ? "text-white" : "text-black";
  const mute = tone === "dark" ? "text-white/45" : "text-[#8a8d92]";

  return (
    <p
      className={[
        "text-pretty font-[family-name:var(--font-inter-tight)] font-medium leading-[1.35] tracking-[-0.015em]",
        sizeClass[size],
        align === "center" ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      <span className={ink}>{lead}</span>
      {rest ? (
        <>
          {" "}
          <span className={mute}>{rest}</span>
        </>
      ) : null}
    </p>
  );
}
