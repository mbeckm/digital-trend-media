"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface CursorImageTrailProps {
  items: React.ReactNode[];
  /** Size of each trail item in px. @default 120 */
  itemSize?: number;
  /** Max simultaneous items in the trail. @default 8 */
  trailLength?: number;
  /** Minimum cursor travel (px) before spawning a new item. @default 80 */
  spawnDistance?: number;
  /** Max random rotation applied to each item in degrees. @default 20 */
  rotationRange?: number;
  /** Render target — defaults to the whole window. */
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  children?: React.ReactNode;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  itemIndex: number;
}

let _id = 0;
const nextId = () => ++_id;

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function CursorImageTrail({
  items,
  itemSize = 120,
  trailLength = 8,
  spawnDistance = 80,
  rotationRange = 20,
  containerRef,
  className,
  children,
}: CursorImageTrailProps) {
  const reduceMotion = useReducedMotion();
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const [canTrail, setCanTrail] = React.useState(false);
  const lastPos = React.useRef<{ x: number; y: number } | null>(null);
  const itemCounter = React.useRef(0);
  const containerElRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanTrail(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (reduceMotion || !canTrail || items.length === 0) {
      setTrail([]);
      return;
    }

    const el = containerRef?.current ?? containerElRef.current;
    if (!el) return;

    const onLeave = () => {
      lastPos.current = null;
      setTrail([]);
    };

    const onMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect =
        containerRef?.current?.getBoundingClientRect() ??
        containerElRef.current?.getBoundingClientRect();

      const x = rect ? mouseEvent.clientX - rect.left : mouseEvent.clientX;
      const y = rect ? mouseEvent.clientY - rect.top : mouseEvent.clientY;

      if (lastPos.current) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < spawnDistance) return;
      }

      lastPos.current = { x, y };

      // Prefer a clear lean either way — still random, less often nearly upright.
      const sign = Math.random() < 0.5 ? -1 : 1;
      const rotation =
        sign *
        (rotationRange * 0.25 + Math.random() * rotationRange * 0.75);
      const itemIndex = itemCounter.current % items.length;
      itemCounter.current += 1;

      setTrail((prev) => {
        const next = [...prev, { id: nextId(), x, y, rotation, itemIndex }];
        return next.slice(-trailLength);
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [
    items,
    spawnDistance,
    rotationRange,
    trailLength,
    containerRef,
    reduceMotion,
    canTrail,
  ]);

  const total = trail.length;

  return (
    <div
      ref={containerElRef}
      className={joinClassNames("relative overflow-hidden", className)}
    >
      {children}

      {canTrail && !reduceMotion ? (
        <AnimatePresence>
          {trail.map((item, i) => {
            const age = total - 1 - i;
            const scale = 0.72 + 0.28 * (1 - age / Math.max(trailLength, 1));
            const opacity = 1 - (age / Math.max(trailLength, 1)) * 0.35;

            return (
              <motion.div
                key={item.id}
                data-cursor-trail-item
                className="pointer-events-none absolute select-none"
                style={{
                  left: item.x,
                  top: item.y,
                  width: itemSize,
                  x: "-50%",
                  y: "-50%",
                  zIndex: 2 + i,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.65,
                  rotate: item.rotation * 1.25,
                }}
                animate={{
                  opacity,
                  scale,
                  rotate: item.rotation,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.4,
                  rotate: item.rotation * 0.6,
                }}
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-full [&>svg]:h-auto [&>svg]:w-full [&>img]:h-auto [&>img]:w-full">
                  {items[item.itemIndex]}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      ) : null}
    </div>
  );
}
