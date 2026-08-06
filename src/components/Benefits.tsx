"use client";

import { Inbox, Sparkles, Timer, type LucideIcon } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const benefits: { label: string; Icon: LucideIcon }[] = [
  { label: "Komplexes einfach erklärt", Icon: Sparkles },
  { label: "Mehr Anfragen", Icon: Inbox },
  { label: "Kürzere Vertriebszyklen", Icon: Timer },
];

export function Benefits() {
  return (
    <section
      aria-label="Vorteile"
      className="w-full bg-[var(--color-surface)]"
      style={{ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.06)" }}
    >
      <RevealGroup
        stagger={0.08}
        className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row md:gap-6 md:px-12 md:py-10 lg:px-20"
      >
        {benefits.map(({ label, Icon }) => (
          <RevealItem key={label} soft className="flex items-center gap-2.5">
            <div
              className="flex size-[42px] shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-soft)] text-[var(--color-link)]"
              style={{ boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.08)" }}
            >
              <Icon size={22} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
            </div>
            <span className="text-center text-[clamp(1rem,1.2vw,1.125rem)] font-semibold leading-7 text-black">
              {label}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
