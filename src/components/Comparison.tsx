"use client";

import type { CSSProperties } from "react";
import {
  Clapperboard,
  Palette,
  RefreshCw,
  Rocket,
  Target,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/SectionHeader";

const rows: {
  label: string;
  Icon: LucideIcon;
  us: string;
  them: string;
}[] = [
  {
    label: "Korrekturschleifen",
    Icon: RefreshCw,
    us: "Unbegrenzte Korrekturschleifen inklusive",
    them: "1-2 Schleifen pro Phase. Danach wird es teuer.",
  },
  {
    label: "Design",
    Icon: Palette,
    us: "Individuell auf euer Unternehmen zugeschnitten.",
    them: "Templates und Figuren von der Stange.",
  },
  {
    label: "Drehbuch",
    Icon: Clapperboard,
    us: "Entwickelt von professionellen Werbetextern und Drehbuchautoren.",
    them: "Die Story schreibt häufig der Animator gleich mit.",
  },
  {
    label: "Ergebnis",
    Icon: Target,
    us: "Konzipiert für eure Marketing- und Vertriebsziele.",
    them: "Hauptsache fertig und ausgeliefert.",
  },
  {
    label: "Nach der Produktion",
    Icon: Rocket,
    us: "Wir zeigen euch, wo und wie der Film die größte Wirkung erzielt.",
    them: "Film fertig, Datei verschickt. Was danach passiert, ist euer Problem.",
  },
];

export function Comparison() {
  return (
    <section
      className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14"
      style={
        {
          "--cmp-soft": "#eaf1fd",
          "--cmp-line": "#c5d9f5",
        } as CSSProperties
      }
    >
      <SectionHeader
        title="Digital Trend Media im Vergleich"
        lead="Mehr Freiraum in der Produktion. Mehr Wirkung im Vertrieb."
        rest="Unbegrenzte Korrekturen, individuelle Gestaltung und eine Story, die auf eure Ziele einzahlt. Statt Dateien ohne Wirkung."
      />

      <Reveal soft delay={0.08}>
        <div
          role="table"
          aria-label="Vergleich Digital Trend Media und andere Agenturen"
          className="grid w-full grid-cols-1 md:grid-cols-[minmax(9.5rem,0.85fr)_minmax(0,1.15fr)_minmax(0,1.15fr)]"
        >
          <div
            role="row"
            className="col-span-full hidden grid-cols-subgrid md:grid"
            aria-hidden
          >
            <div className="border-b border-[var(--color-border)] pb-4 pr-6" />
            <div className="rounded-t-[20px] border-b border-[var(--cmp-line)] bg-[var(--cmp-soft)] px-5 pb-4 pt-5">
              <p className="font-[family-name:var(--font-inter-tight)] text-[15px] font-semibold tracking-[-0.015em] text-[var(--color-chip-text)]">
                Digital Trend Media
              </p>
            </div>
            <div className="border-b border-[var(--color-border)] px-5 pb-4 pt-5">
              <p className="font-[family-name:var(--font-inter-tight)] text-[15px] font-medium tracking-[-0.015em] text-[var(--color-muted)]">
                Andere Agenturen
              </p>
            </div>
          </div>

          {rows.map(({ label, Icon, us, them }, i) => {
            const isLast = i === rows.length - 1;
            const rule = isLast
              ? ""
              : "md:border-b md:border-[var(--color-border)]";
            const usRule = isLast
              ? ""
              : "md:border-b md:border-[var(--cmp-line)]";

            return (
              <div
                key={label}
                role="row"
                className="col-span-full grid grid-cols-1 gap-2.5 border-b border-[var(--color-border)] py-5 last:border-b-0 sm:grid-cols-2 sm:gap-3 md:grid-cols-subgrid md:gap-0 md:border-b-0 md:py-0"
              >
                <div
                  role="rowheader"
                  className={`col-span-full flex items-center gap-3 pt-0 sm:col-span-2 md:col-span-1 md:py-5 md:pr-6 ${rule}`}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--cmp-soft)] text-[var(--color-footer)]"
                    aria-hidden
                  >
                    <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth />
                  </span>
                  <span className="font-[family-name:var(--font-inter-tight)] text-[15px] font-semibold leading-snug tracking-[-0.015em] text-black md:text-base">
                    {label}
                  </span>
                </div>

                <div
                  role="cell"
                  className={`rounded-2xl bg-[var(--cmp-soft)] px-4 py-3.5 md:rounded-none md:px-5 md:py-5 ${usRule} ${
                    isLast ? "md:rounded-b-[20px]" : ""
                  }`}
                >
                  <p className="mb-1.5 font-[family-name:var(--font-inter-tight)] text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-chip-text)] md:hidden">
                    Digital Trend Media
                  </p>
                  <p className="text-[15px] font-medium leading-snug tracking-[-0.01em] text-pretty text-[var(--color-chip-text)] md:text-base md:leading-[1.45]">
                    {us}
                  </p>
                </div>

                <div
                  role="cell"
                  className={`rounded-2xl bg-[var(--color-surface-soft)] px-4 py-3.5 md:rounded-none md:bg-transparent md:px-5 md:py-5 ${rule}`}
                >
                  <p className="mb-1.5 font-[family-name:var(--font-inter-tight)] text-[13px] font-medium tracking-[-0.01em] text-[var(--color-muted)] md:hidden">
                    Andere Agenturen
                  </p>
                  <p className="text-[15px] font-medium leading-snug tracking-[-0.01em] text-pretty text-[var(--color-muted)] md:text-base md:leading-[1.45]">
                    {them}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
