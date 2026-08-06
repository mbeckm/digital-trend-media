"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import "./cause.css";
import { Combined } from "./variants/Combined";
import { DecisionParalysis } from "./variants/DecisionParalysis";
import { FoggedOffer } from "./variants/FoggedOffer";
import { MixedSignals } from "./variants/MixedSignals";
import { UnreadablePitch } from "./variants/UnreadablePitch";

export const CAUSE_VARIANTS = [
  {
    id: "mixed-signals",
    label: "A · Mixed signals",
    Scene: MixedSignals,
  },
  {
    id: "fogged-offer",
    label: "B · Fogged offer",
    Scene: FoggedOffer,
  },
  {
    id: "decision-paralysis",
    label: "C · Unclear picture",
    Scene: DecisionParalysis,
  },
  {
    id: "unreadable-pitch",
    label: "D · Unreadable pitch",
    Scene: UnreadablePitch,
  },
  {
    id: "combined",
    label: "E · Combined",
    Scene: Combined,
  },
] as const;

export type CauseVariantId = (typeof CAUSE_VARIANTS)[number]["id"];

export function CauseStage({
  variant = "combined",
  className = "",
}: {
  variant?: CauseVariantId;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const active =
    CAUSE_VARIANTS.find((item) => item.id === variant) ?? CAUSE_VARIANTS[4];
  const { Scene } = active;

  return (
    <motion.div
      ref={ref}
      data-in-view={onScreen}
      data-variant={active.id}
      className={`cause-stage ${className}`.trim()}
      aria-hidden
      initial={
        reduceMotion ? { opacity: 1 } : { opacity: 0, transform: "translateY(14px)" }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.08 }}
    >
      <div className="cause-stage__veil" />
      <div className="cause-stage__board">
        <Scene key={active.id} />
      </div>
    </motion.div>
  );
}
