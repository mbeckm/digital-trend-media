"use client";

import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  type ComponentType,
  type CSSProperties,
} from "react";

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

/** How much of each previous card peeks above the one in front (chip + top edge). */
const PEEK_PX = 28;

export function ReasonsGrid() {
  const [stuck, setStuck] = useState<boolean[]>(() =>
    reasons.map((_, i) => i === 0),
  );

  const onStuckChange = useCallback((index: number, isStuck: boolean) => {
    setStuck((prev) => {
      if (prev[index] === isStuck) return prev;
      const next = [...prev];
      next[index] = isStuck;
      return next;
    });
  }, []);

  // Highest stuck card is the front of the deck; only it casts ambient shadow.
  const frontIndex = stuck.reduce((acc, v, i) => (v ? i : acc), 0);

  return (
    <div className="relative flex w-full flex-col gap-[min(42vh,18rem)]">
      {reasons.map((reason, i) => (
        <ReasonCard
          key={reason.title}
          {...reason}
          index={i}
          isFront={i === frontIndex}
          onStuckChange={onStuckChange}
        />
      ))}
    </div>
  );
}

function ReasonCard({
  n,
  title,
  Scene,
  index,
  isFront,
  onStuckChange,
}: {
  n: string;
  title: string;
  Scene: ComponentType;
  index: number;
  isFront: boolean;
  onStuckChange: (index: number, isStuck: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const onScreen = useInView(cardRef, { margin: "-8% 0px -8% 0px" });
  const reduceMotion = useReducedMotion();

  // Fade + lift as the card enters from the bottom of the viewport.
  const { scrollYProgress: enterProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "start 52%"],
  });
  const opacity = useTransform(enterProgress, [0, 1], [0, 1]);
  const enterY = useTransform(enterProgress, [0, 1], [56, 0]);

  // Crosses ~1 when this card has reached its sticky rest position.
  const { scrollYProgress: stickProgress } = useScroll({
    target: wrapRef,
    offset: ["start 70%", "start 28%"],
  });
  useEffect(() => {
    onStuckChange(index, stickProgress.get() >= 0.92);
  }, [index, onStuckChange, stickProgress]);
  useMotionValueEvent(stickProgress, "change", (v) => {
    onStuckChange(index, v >= 0.92);
  });

  // Later cards stick slightly lower so earlier ones stay visible as a deck peek.
  const peek = index * PEEK_PX;
  const stickyStyle = {
    zIndex: index + 1,
    "--reason-peek": `${peek}px`,
  } as CSSProperties;

  return (
    <div
      ref={wrapRef}
      className="sticky top-[calc(1.5rem+var(--reason-peek))] md:top-[calc(6rem+var(--reason-peek))] lg:top-[calc(7rem+var(--reason-peek))]"
      style={stickyStyle}
    >
      <motion.article
        ref={cardRef}
        data-in-view={onScreen}
        data-front={isFront}
        className="reason-card flex flex-col rounded-2xl bg-white p-2"
        style={reduceMotion ? undefined : { opacity, y: enterY }}
      >
        {/* Concentric with the card: 16px outer radius minus 8px of padding. */}
        <div
          className="reason-scene h-[168px] rounded-lg bg-[var(--color-surface-soft)] md:h-[220px] lg:h-[240px]"
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
    </div>
  );
}
