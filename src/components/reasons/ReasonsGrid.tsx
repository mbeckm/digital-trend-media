"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ComponentType } from "react";

import "./reasons.css";
import { IgnoredAd } from "./scenes/IgnoredAd";
import { OutdatedWebsite } from "./scenes/OutdatedWebsite";
import { SinkingMarket } from "./scenes/SinkingMarket";
import { StalledPipeline } from "./scenes/StalledPipeline";

const reasons: { n: string; title: string; Scene: ComponentType }[] = [
  { n: "#1", title: "Website ist zu alt", Scene: OutdatedWebsite },
  { n: "#2", title: "Vertrieb muss besser werden", Scene: StalledPipeline },
  { n: "#3", title: "Werbeanzeigen funktionieren nicht", Scene: IgnoredAd },
  { n: "#4", title: "Marktlage ist schlecht", Scene: SinkingMarket },
];

export function ReasonsGrid() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      {reasons.map((reason, i) => (
        <ReasonCard key={reason.title} {...reason} index={i} />
      ))}
    </div>
  );
}

function ReasonCard({
  n,
  title,
  Scene,
  index,
}: {
  n: string;
  title: string;
  Scene: ComponentType;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const onScreen = useInView(ref, { margin: "-8% 0px -8% 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      data-in-view={onScreen}
      className="reason-card flex flex-col rounded-2xl bg-white p-2 smooth-shadow-ring-md shadow-[#0c1a3a] transition-shadow duration-300 hover:smooth-shadow-ring-lg"
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, transform: "translateY(16px)" }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{
        type: "spring",
        duration: 0.55,
        bounce: 0.1,
        delay: index * 0.06,
      }}
    >
      {/* Concentric with the card: 16px outer radius minus 8px of padding. */}
      <div
        className="reason-scene h-[168px] rounded-lg bg-[var(--color-surface-soft)] md:h-[188px]"
        aria-hidden
      >
        <Scene />
        <span className="absolute left-2.5 top-2.5 z-10 rounded-md border border-[#e3e8f4] bg-white/85 px-1.5 py-0.5 text-[0.6875rem] font-medium leading-none tabular-nums text-[var(--color-chip-text)] backdrop-blur-sm">
          {n}
        </span>
      </div>
      <h3 className="px-2 pb-1.5 pt-4 font-[family-name:var(--font-inter-tight)] text-[clamp(1.125rem,1.6vw,1.5rem)] font-semibold leading-[1.35] tracking-[-0.015em] text-black">
        {title}
      </h3>
    </motion.article>
  );
}
