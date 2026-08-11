"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

type ComicBenefitProps = {
  title: string;
  icon: ReactNode;
  tilt: number;
  gooId?: number;
  wiggleDelay?: string;
};

type Phase = "idle" | "outside" | "crossing" | "inside";

/** Signed distance band where the membrane resists / pierces */
const CROSSING = 42;
/** How far outside the chip the slime cursor starts reaching */
const APPROACH = 72;
const MAGNET = 0.2;
/** Hard ceiling — springs must never paint above this */
const SCALE_MAX = 1.14;
const SCALE_HOVER = 1.08;
const SCALE_INSIDE = 1.1;

function sdBox(px: number, py: number, halfW: number, halfH: number) {
  const dx = Math.abs(px) - halfW;
  const dy = Math.abs(py) - halfH;
  const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  const inside = Math.min(Math.max(dx, dy), 0);
  return outside + inside;
}

function nearestEdgePoint(x: number, y: number, w: number, h: number) {
  const clampedX = Math.min(Math.max(x, 0), w);
  const clampedY = Math.min(Math.max(y, 0), h);
  const distLeft = Math.abs(x);
  const distRight = Math.abs(x - w);
  const distTop = Math.abs(y);
  const distBottom = Math.abs(y - h);
  const min = Math.min(distLeft, distRight, distTop, distBottom);

  if (min === distLeft) return { x: 0, y: clampedY, nx: -1, ny: 0 };
  if (min === distRight) return { x: w, y: clampedY, nx: 1, ny: 0 };
  if (min === distTop) return { x: clampedX, y: 0, nx: 0, ny: -1 };
  return { x: clampedX, y: h, nx: 0, ny: 1 };
}

export function ComicBenefit({
  title,
  icon,
  tilt,
  wiggleDelay = "0s",
}: ComicBenefitProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const phaseRef = useRef<Phase>("idle");
  const resonanceUntilRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState(false);

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardScale = useMotionValue(1);
  const cardRotate = useMotionValue(tilt);
  /** Extra squash on impact — layered on top of uniform scale */
  const cardSquashX = useMotionValue(1);
  const cardSquashY = useMotionValue(1);

  const springCardX = useSpring(cardX, { stiffness: 200, damping: 18, mass: 0.75 });
  const springCardY = useSpring(cardY, { stiffness: 200, damping: 18, mass: 0.75 });
  const springScale = useSpring(cardScale, {
    stiffness: 280,
    damping: 24,
    mass: 0.55,
  });
  const springRotate = useSpring(cardRotate, {
    stiffness: 200,
    damping: 20,
    mass: 0.6,
  });
  const springSquashX = useSpring(cardSquashX, {
    stiffness: 320,
    damping: 22,
    mass: 0.4,
  });
  const springSquashY = useSpring(cardSquashY, {
    stiffness: 320,
    damping: 22,
    mass: 0.4,
  });
  const displayScaleX = useTransform(
    [springScale, springSquashX],
    ([scale, squash]: number[]) =>
      Math.min(SCALE_MAX, Math.max(0.92, scale * squash)),
  );
  const displayScaleY = useTransform(
    [springScale, springSquashY],
    ([scale, squash]: number[]) =>
      Math.min(SCALE_MAX, Math.max(0.92, scale * squash)),
  );

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorSize = useMotionValue(14);
  const cursorStretch = useMotionValue(1);
  const cursorSquash = useMotionValue(1);
  const cursorAngle = useMotionValue(0);
  const cursorOpacity = useMotionValue(0);

  const springCursorX = useSpring(cursorX, { stiffness: 380, damping: 28, mass: 0.35 });
  const springCursorY = useSpring(cursorY, { stiffness: 380, damping: 28, mass: 0.35 });
  const springCursorSize = useSpring(cursorSize, {
    stiffness: 260,
    damping: 20,
    mass: 0.4,
  });
  const springStretch = useSpring(cursorStretch, {
    stiffness: 240,
    damping: 16,
    mass: 0.35,
  });
  const springSquash = useSpring(cursorSquash, {
    stiffness: 240,
    damping: 16,
    mass: 0.35,
  });
  const springAngle = useSpring(cursorAngle, { stiffness: 220, damping: 20, mass: 0.4 });
  const springOpacity = useSpring(cursorOpacity, {
    stiffness: 280,
    damping: 26,
    mass: 0.35,
  });

  const bulgeX = useMotionValue(0);
  const bulgeY = useMotionValue(0);
  const bulgeSize = useMotionValue(0);
  const bulgeOpacity = useMotionValue(0);
  const springBulgeX = useSpring(bulgeX, { stiffness: 280, damping: 22, mass: 0.4 });
  const springBulgeY = useSpring(bulgeY, { stiffness: 280, damping: 22, mass: 0.4 });
  const springBulgeSize = useSpring(bulgeSize, {
    stiffness: 240,
    damping: 16,
    mass: 0.4,
  });
  const springBulgeOpacity = useSpring(bulgeOpacity, {
    stiffness: 260,
    damping: 24,
    mass: 0.35,
  });

  const settlePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const reset = () => {
    setActive(false);
    settlePhase("idle");
    resonanceUntilRef.current = 0;
    cardX.set(0);
    cardY.set(0);
    cardScale.jump(1);
    cardRotate.jump(tilt);
    cardSquashX.jump(1);
    cardSquashY.jump(1);
    cursorOpacity.set(0);
    cursorStretch.set(1);
    cursorSquash.set(1);
    cursorSize.set(14);
    bulgeSize.set(0);
    bulgeOpacity.set(0);
  };

  /** Resonant “you’re inside” impact — springs so it stays interruptible */
  const pulseEnter = (nx: number, ny: number, speed: number) => {
    const impact = Math.min(0.06 + speed * 0.002, 0.1);
    const twist = (nx - ny) * (2.2 + speed * 0.04);

    cardSquashX.jump(1 + (ny !== 0 ? impact : -impact * 0.45));
    cardSquashY.jump(1 + (nx !== 0 ? impact : -impact * 0.45));
    cardScale.jump(Math.min(SCALE_MAX, SCALE_INSIDE + impact * 0.5));

    animate(cardScale, SCALE_INSIDE, {
      type: "spring",
      stiffness: 380,
      damping: 22,
      mass: 0.45,
    });
    animate(cardSquashX, 1, {
      type: "spring",
      stiffness: 360,
      damping: 20,
      mass: 0.4,
    });
    animate(cardSquashY, 1, {
      type: "spring",
      stiffness: 360,
      damping: 20,
      mass: 0.4,
    });
    animate(cardRotate, tilt + twist * 0.25, {
      type: "spring",
      stiffness: 280,
      damping: 18,
      mass: 0.5,
    });
    resonanceUntilRef.current = performance.now() + 220;
  };

  const pulseExit = (nx: number, ny: number, speed: number) => {
    const impact = Math.min(0.04 + speed * 0.002, 0.07);
    cardSquashX.jump(1 + (nx !== 0 ? impact : -impact * 0.35));
    cardSquashY.jump(1 + (ny !== 0 ? impact : -impact * 0.35));
    animate(cardSquashX, 1, {
      type: "spring",
      stiffness: 320,
      damping: 22,
      mass: 0.4,
    });
    animate(cardSquashY, 1, {
      type: "spring",
      stiffness: 320,
      damping: 22,
      mass: 0.4,
    });
    animate(cardScale, SCALE_HOVER, {
      type: "spring",
      stiffness: 320,
      damping: 22,
      mass: 0.5,
    });
    resonanceUntilRef.current = performance.now() + 160;
  };

  /** Blob dissolves into the membrane at the pierce point */
  const morphIntoBox = (edgeX: number, edgeY: number) => {
    cursorX.set(edgeX);
    cursorY.set(edgeY);
    cursorSize.set(28);
    cursorStretch.set(1);
    cursorSquash.set(1);
    cursorOpacity.set(0);
    bulgeX.set(edgeX);
    bulgeY.set(edgeY);
    bulgeSize.set(40);
    bulgeOpacity.set(0);
  };

  /** Blob reforms as you leave the membrane */
  const morphOutOfBox = (edgeX: number, edgeY: number, angle: number) => {
    cursorX.jump(edgeX);
    cursorY.jump(edgeY);
    cursorSize.set(14);
    cursorStretch.set(1.25);
    cursorSquash.set(0.78);
    cursorAngle.set(angle);
    cursorOpacity.set(1);
    bulgeX.set(edgeX);
    bulgeY.set(edgeY);
    bulgeSize.set(22);
    bulgeOpacity.set(0.85);
  };

  const onPointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    setActive(true);
    lastRef.current = { x: event.clientX, y: event.clientY, t: performance.now() };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const el = rootRef.current;
    if (!el) return;

    // Layout size (pre-transform) — never use getBoundingClientRect width/height
    // for physics, or scale feeds back into itself and the chip can explode.
    const layoutW = el.offsetWidth || 1;
    const layoutH = el.offsetHeight || 1;
    const rect = el.getBoundingClientRect();
    const liveScaleX = rect.width / layoutW || 1;
    const liveScaleY = rect.height / layoutH || 1;
    const x = (event.clientX - rect.left) / liveScaleX;
    const y = (event.clientY - rect.top) / liveScaleY;
    const halfW = layoutW / 2;
    const halfH = layoutH / 2;
    const dist = sdBox(x - halfW, y - halfH, halfW, halfH);
    const now = performance.now();
    const dt = Math.max(now - lastRef.current.t, 1);
    const vx = ((event.clientX - lastRef.current.x) / dt) * 16;
    const vy = ((event.clientY - lastRef.current.y) / dt) * 16;
    const speed = Math.min(Math.hypot(vx, vy), 24);
    lastRef.current = { x: event.clientX, y: event.clientY, t: now };

    const engaged = dist < APPROACH;
    const nx = engaged ? Math.max(-1, Math.min(1, (x - halfW) / halfW)) : 0;
    const ny = engaged ? Math.max(-1, Math.min(1, (y - halfH) / halfH)) : 0;

    // Magnetic drag — stronger once you’re inside the mass
    const magnet = dist < 0 ? MAGNET * 1.1 : MAGNET;
    cardX.set(nx * halfW * magnet);
    cardY.set(ny * halfH * magnet);

    const resonating = now < resonanceUntilRef.current;
    const prev = phaseRef.current;
    let nextPhase: Phase = "outside";
    if (dist < -10) nextPhase = "inside";
    else if (Math.abs(dist) < CROSSING) nextPhase = "crossing";

    // Let entry/exit resonance own scale + rotate briefly
    if (!resonating) {
      if (nextPhase === "inside") {
        cardScale.set(
          Math.min(SCALE_MAX, SCALE_INSIDE + Math.min(speed * 0.001, 0.015)),
        );
        cardRotate.set(tilt + nx * 2.2 + ny * -1.1);
      } else if (engaged) {
        cardScale.set(
          Math.min(SCALE_MAX, SCALE_HOVER + Math.min(speed * 0.001, 0.02)),
        );
        cardRotate.set(tilt + nx * 2.8 + ny * -1.4);
      } else {
        cardScale.set(1);
        cardRotate.set(tilt);
      }
    }

    const edge = nearestEdgePoint(x, y, layoutW, layoutH);
    const edgeAngle = (Math.atan2(edge.y - y, edge.x - x) * 180) / Math.PI;

    // Phase transitions — resonance + morph live here, not in a thin distance band alone
    if (prev !== "inside" && nextPhase === "inside") {
      morphIntoBox(edge.x, edge.y);
      pulseEnter(edge.nx, edge.ny, speed);
      settlePhase("inside");
      return;
    }

    if (prev === "inside" && nextPhase !== "inside") {
      morphOutOfBox(edge.x, edge.y, edgeAngle);
      pulseExit(edge.nx, edge.ny, speed);
      settlePhase(nextPhase);
      return;
    }

    settlePhase(nextPhase);

    if (nextPhase === "inside") {
      // You’re the box now — no cursor avatar
      cursorOpacity.set(0);
      bulgeOpacity.set(0);
      bulgeSize.set(0);
      return;
    }

    // Outside / crossing: slime is your body approaching the membrane
    cursorX.set(x);
    cursorY.set(y);
    cursorOpacity.set(1);
    cursorAngle.set(edgeAngle);
    bulgeX.set(edge.x);
    bulgeY.set(edge.y);

    if (nextPhase === "crossing") {
      const pierce = 1 - Math.min(Math.abs(dist) / CROSSING, 1);
      const entering = dist >= 0;
      // Keep deformation readable, not extreme — otherwise it reads as a glitch
      cursorSize.set(14 + pierce * 10);
      cursorStretch.set(1 + pierce * (entering ? 0.55 : 0.4));
      cursorSquash.set(Math.max(0.72, 1 - pierce * 0.28));
      bulgeSize.set(16 + pierce * 22);
      bulgeOpacity.set(0.55 + pierce * 0.4);

      if (entering && !resonating) {
        cardSquashX.set(
          1 + edge.nx * edge.nx * pierce * 0.04 - edge.ny * edge.ny * pierce * 0.025,
        );
        cardSquashY.set(
          1 + edge.ny * edge.ny * pierce * 0.04 - edge.nx * edge.nx * pierce * 0.025,
        );
      }
      return;
    }

    const pull = Math.max(0, 1 - Math.max(dist, 0) / APPROACH);
    cursorSize.set(12 + pull * 4);
    cursorStretch.set(1 + pull * 0.22 + Math.min(speed * 0.008, 0.12));
    cursorSquash.set(Math.max(0.82, 1 - pull * 0.12));
    bulgeSize.set(pull * 14);
    bulgeOpacity.set(pull * 0.55);
    if (!resonating) {
      cardSquashX.set(1);
      cardSquashY.set(1);
    }
  };

  const onPointerLeave = () => {
    if (reduceMotion) return;
    reset();
  };

  const vars = {
    "--benefit-tilt": `${tilt}deg`,
    "--wiggle-delay": wiggleDelay,
  } as CSSProperties;

  return (
    <div
      className={[
        "comic-benefit-shell",
        active ? "is-active" : "",
        reduceMotion ? "is-reduced" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={vars}
    >
      <motion.div
        ref={rootRef}
        className={[
          "comic-benefit",
          active ? "is-active" : "",
          phase === "inside" ? "is-inside" : "",
          phase === "crossing" ? "is-crossing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          reduceMotion
            ? { rotate: `${tilt}deg` }
            : {
                x: springCardX,
                y: springCardY,
                scaleX: displayScaleX,
                scaleY: displayScaleY,
                rotate: springRotate,
              }
        }
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {!reduceMotion ? (
          <div className="comic-benefit__slime" aria-hidden>
            <motion.div
              className="comic-benefit__bulge-track"
              style={{ x: springBulgeX, y: springBulgeY, opacity: springBulgeOpacity }}
            >
              <motion.div
                className="comic-benefit__bulge"
                style={{ width: springBulgeSize, height: springBulgeSize }}
              />
            </motion.div>
            <motion.div
              className="comic-benefit__cursor-track"
              style={{
                x: springCursorX,
                y: springCursorY,
                opacity: springOpacity,
                rotate: springAngle,
                scaleX: springStretch,
                scaleY: springSquash,
              }}
            >
              <motion.div
                className="comic-benefit__cursor"
                style={{ width: springCursorSize, height: springCursorSize }}
              />
            </motion.div>
          </div>
        ) : null}

        <div className="comic-benefit__body">
          <span className="comic-benefit__icon">{icon}</span>
          <p className="comic-benefit__label">{title}</p>
        </div>
      </motion.div>
    </div>
  );
}
