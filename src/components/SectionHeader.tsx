"use client";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionDek } from "@/components/SectionDek";

type SectionHeaderProps = {
  title: string;
  lead: string;
  rest?: string;
  align?: "start" | "center";
  tone?: "light" | "dark";
  size?: "hero" | "section" | "compact";
  className?: string;
  titleClassName?: string;
};

const titleBase =
  "font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-balance text-black";

export function SectionHeader({
  title,
  lead,
  rest,
  align = "start",
  tone = "light",
  size = "section",
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <RevealGroup
      className={[
        "flex w-full flex-col gap-4 md:gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        className ?? "",
      ].join(" ")}
    >
      <RevealItem
        as="h2"
        className={[titleBase, titleClassName ?? ""].join(" ")}
      >
        {title}
      </RevealItem>
      <RevealItem soft>
        <SectionDek
          align={align}
          tone={tone}
          size={size}
          lead={lead}
          rest={rest}
        />
      </RevealItem>
    </RevealGroup>
  );
}
