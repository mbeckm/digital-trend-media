"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { type ReactNode, useRef, useState } from "react";

type CardPair = {
  id: string;
  tilt: number;
  front: { image: string; title: string; body: string };
  back: { image: string; title: string; body: string };
};

const CARDS: CardPair[] = [
  {
    id: "text",
    tilt: 0,
    front: {
      image: "/images/card-flip/card-1-front.png",
      title: "Zu viel Text",
      body: "Deine Besucher haben keine Lust den ganzen Text auf deiner Website zu lesen und sind mit den vielen Inhalten überfordert.",
    },
    back: {
      image: "/images/card-flip/card-1-back.png",
      title: "In 90s verstanden",
      body: "Wir reduzieren dein Angebot auf das, was Interessenten wirklich wissen müssen.",
    },
  },
  {
    id: "anonymous",
    tilt: 0.86,
    front: {
      image: "/images/card-flip/card-2-front.png",
      title: "Anonyme Website",
      body: "Deine Website kann nicht die individuellen Rückfragen deiner Besucher beantworten - wer zweifelt, klickt weg.",
    },
    back: {
      image: "/images/card-flip/card-2-back.png",
      title: "Seite wird persönlich",
      body: "Charaktere, Stimme und Story schaffen Nähe, auch wenn du nicht selbst im Raum bist.",
    },
  },
  {
    id: "questions",
    tilt: -2.05,
    front: {
      image: "/images/card-flip/card-3-front.png",
      title: "Rückfragen",
      body: "Besucher nehmen sich im Schnitt nur 7 Sekunden Zeit, bevor sie eine Website wieder verlassen.",
    },
    back: {
      image: "/images/card-flip/card-3-back.png",
      title: "Einwände behandelt",
      body: "Dein Film beantwortet die wichtigsten Fragen, bevor das Vertriebsgespräch beginnt.",
    },
  },
];

/** Flips run on the sticky scrub; assemble is driven separately (earlier approach). */
const FLIP_WINDOWS = [
  [0.02, 0.34],
  [0.34, 0.66],
  [0.66, 0.98],
] as const;

function easeInCubic(t: number) {
  return t * t * t;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function easeOutQuint(t: number) {
  return 1 - (1 - t) ** 5;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function easeInQuad(t: number) {
  return t * t;
}

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

/** How "in the air / flipping" a card is — drives neighbor lean. */
function activityOf(p: number) {
  if (p < 0.36 || p > 0.92) return 0;
  if (p < 0.48) return easeInCubic((p - 0.36) / 0.12);
  if (p < 0.8) return 1;
  return 1 - easeInCubic((p - 0.8) / 0.12);
}

type FaceProps = {
  image: string;
  title: string;
  body: string;
  side: "front" | "back";
  glimmer?: boolean;
  mediaScale?: MotionValue<number>;
  mediaY?: MotionValue<number>;
};

function CardFace({
  image,
  title,
  body,
  side,
  glimmer,
  mediaScale,
  mediaY,
}: FaceProps) {
  return (
    <div className={`flip-card__face flip-card__face--${side}`}>
      <div className="flip-card__media">
        <motion.div
          className="flip-card__media-motion"
          style={
            mediaScale && mediaY
              ? { scale: mediaScale, y: mediaY }
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" />
        </motion.div>
      </div>
      <div className="flip-card__copy">
        <h2
          className={`flip-card__title${glimmer ? " is-glimmering" : ""}`}
        >
          {title}
        </h2>
        <p className="flip-card__body">{body}</p>
      </div>
    </div>
  );
}

/**
 * Local card physics (0–1 within each card's window):
 *  0–36%   glued to the ground (hard to pick up)
 * 36–48%   peel / lift
 * 46–82%   flip — long, even arc so scrubbing feels continuous
 * 82–92%   gravity fall
 * 92–100%  impact squash → settle — headline glimmer / burst can fire
 */
function useFlipPhysics(progress: MotionValue<number>) {
  const rotateYRaw = useTransform(progress, (p) => {
    if (p < 0.46) return 0;
    if (p < 0.5) {
      // Soft lead-in — card starts to yaw before the main turn
      const t = (p - 0.46) / 0.04;
      return easeOutQuad(t) * 12;
    }
    if (p < 0.82) {
      // Even angular travel across a long window (was ease-in over 20%)
      const t = (p - 0.5) / 0.32;
      return 12 + easeInOutCubic(t) * 168;
    }
    return 180;
  });

  const yRaw = useTransform(progress, (p) => {
    if (p < 0.3) return 0;
    if (p < 0.36) {
      const t = (p - 0.3) / 0.06;
      return easeInQuad(t) * 4;
    }
    if (p < 0.48) {
      const t = (p - 0.36) / 0.12;
      return 4 - easeOutCubic(t) * 56;
    }
    if (p < 0.82) {
      // Hold near peak while flipping — gentle drift, no jumps
      const t = (p - 0.48) / 0.34;
      return -52 + easeInOutCubic(t) * 6;
    }
    if (p < 0.92) {
      const t = (p - 0.82) / 0.1;
      return -46 + easeInCubic(t) * 46;
    }
    // Harder rebound — readable slam then settle
    if (p < 0.955) {
      const t = (p - 0.92) / 0.035;
      return easeOutCubic(t) * -18;
    }
    if (p < 1) {
      const t = (p - 0.955) / 0.045;
      return -18 + easeOutCubic(t) * 18;
    }
    return 0;
  });

  const scaleXRaw = useTransform(progress, (p) => {
    if (p < 0.36) return 1;
    if (p < 0.48) {
      const t = (p - 0.36) / 0.12;
      return 1 + easeOutCubic(t) * 0.09;
    }
    if (p < 0.82) {
      const t = (p - 0.48) / 0.34;
      return 1.09 - easeInOutCubic(t) * 0.05;
    }
    if (p < 0.92) {
      const t = (p - 0.82) / 0.1;
      return 1.04 - easeInCubic(t) * 0.04;
    }
    // Pronounced impact squash
    if (p < 0.955) {
      const t = (p - 0.92) / 0.035;
      return 1 + easeOutCubic(Math.min(1, t)) * 0.16;
    }
    if (p < 1) {
      const t = (p - 0.955) / 0.045;
      return 1.16 - easeOutCubic(t) * 0.16;
    }
    return 1;
  });

  const scaleYRaw = useTransform(progress, (p) => {
    if (p < 0.36) return 1;
    if (p < 0.48) {
      const t = (p - 0.36) / 0.12;
      return 1 + easeOutCubic(t) * 0.09;
    }
    if (p < 0.82) {
      const t = (p - 0.48) / 0.34;
      return 1.09 - easeInOutCubic(t) * 0.05;
    }
    if (p < 0.92) {
      const t = (p - 0.82) / 0.1;
      return 1.04 - easeInCubic(t) * 0.04;
    }
    if (p < 0.955) {
      const t = (p - 0.92) / 0.035;
      return 1 - easeOutCubic(Math.min(1, t)) * 0.16;
    }
    if (p < 1) {
      const t = (p - 0.955) / 0.045;
      return 0.84 + easeOutCubic(t) * 0.2;
    }
    return 1;
  });

  // Light springs fill gaps between discrete scroll-wheel steps
  // without drifting far from the scrub position.
  const springCfg = { stiffness: 380, damping: 36, mass: 0.28 } as const;
  const rotateY = useSpring(rotateYRaw, springCfg);
  const y = useSpring(yRaw, springCfg);
  const scaleX = useSpring(scaleXRaw, springCfg);
  const scaleY = useSpring(scaleYRaw, springCfg);

  const boxShadow = useTransform(progress, (p) => {
    let lift = 0;
    if (p >= 0.36 && p < 0.48) {
      lift = easeOutCubic((p - 0.36) / 0.12);
    } else if (p >= 0.48 && p < 0.82) {
      lift = 1 - easeInOutCubic((p - 0.48) / 0.34) * 0.15;
    } else if (p >= 0.82 && p < 0.92) {
      lift = 0.85 * (1 - easeInCubic((p - 0.82) / 0.1));
    } else if (p >= 0.92 && p < 0.97) {
      const t = (p - 0.92) / 0.05;
      const yOff = 1 + t * 3;
      const blur = 2 + t * 6;
      const alpha = 0.62 - t * 0.32;
      return `0 ${yOff}px ${blur}px rgba(26,0,26,${alpha.toFixed(3)}), 0 3px 0 rgba(26,0,26,0.55)`;
    }

    const yOff = 8 + lift * 28;
    const blur = lift * 40;
    const alpha = 0.08 + lift * 0.22;
    return `0 ${yOff}px ${blur}px rgba(26,0,26,${alpha.toFixed(3)})`;
  });

  const mediaScale = useTransform(progress, (p) => {
    if (p < 0.36) return 1;
    if (p < 0.48) {
      const t = (p - 0.36) / 0.12;
      return 1 + easeOutCubic(t) * 0.08;
    }
    if (p < 0.82) return 1.08;
    if (p < 0.92) {
      const t = (p - 0.82) / 0.1;
      return 1.08 - easeInCubic(t) * 0.08;
    }
    return 1;
  });

  const mediaY = useTransform(progress, (p) => {
    if (p < 0.36) return 0;
    if (p < 0.48) {
      const t = (p - 0.36) / 0.12;
      return -easeOutCubic(t) * 10;
    }
    if (p < 0.82) return -10;
    if (p < 0.92) {
      const t = (p - 0.82) / 0.1;
      return -10 + easeInCubic(t) * 10;
    }
    return 0;
  });

  return {
    rotateY,
    y,
    scaleX,
    scaleY,
    boxShadow,
    mediaScale,
    mediaY,
  };
}

function useNeighborLean(
  left: MotionValue<number> | undefined,
  right: MotionValue<number> | undefined,
  self: MotionValue<number>,
  baseTilt: number,
  assemble: MotionValue<number>,
  enterSpin: number,
) {
  // Stand in with self when a neighbor is missing so hook inputs stay stable.
  const leftOrSelf = left ?? self;
  const rightOrSelf = right ?? self;
  const hasLeft = !!left;
  const hasRight = !!right;

  const rotateZ = useTransform(
    [leftOrSelf, rightOrSelf, assemble],
    ([l, r, a]: number[]) => {
      const leftPush = hasLeft ? activityOf(l) * 2.4 : 0;
      const rightPush = hasRight ? activityOf(r) * -2.4 : 0;
      const flySpin = (1 - easeOutQuint(a)) * enterSpin;
      return baseTilt + leftPush + rightPush + flySpin;
    },
  );

  const pressY = useTransform(
    [leftOrSelf, rightOrSelf],
    ([l, r]: number[]) => {
      const act = Math.max(
        hasLeft ? activityOf(l) : 0,
        hasRight ? activityOf(r) : 0,
      );
      return act * 3.5;
    },
  );

  return { rotateZ, pressY };
}

function FlipCard({
  card,
  index,
  progress,
  assemble,
  leftNeighbor,
  rightNeighbor,
  reduceMotion,
}: {
  card: CardPair;
  index: number;
  progress: MotionValue<number>;
  assemble: MotionValue<number>;
  leftNeighbor?: MotionValue<number>;
  rightNeighbor?: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const {
    rotateY,
    y,
    scaleX,
    scaleY,
    boxShadow,
    mediaScale,
    mediaY,
  } = useFlipPhysics(progress);

  // Middle stays put; sides fly in from off-stage
  const enterFrom =
    index === 0 ? -1 : index === 2 ? 1 : 0;
  const enterSpin = enterFrom * -14;

  const { rotateZ, pressY } = useNeighborLean(
    leftNeighbor,
    rightNeighbor,
    progress,
    card.tilt,
    assemble,
    enterSpin,
  );

  const enterX = useTransform(assemble, (a) => {
    if (enterFrom === 0) return "0%";
    const t = easeOutQuint(a);
    const from = enterFrom * 125;
    return `${from * (1 - t)}%`;
  });

  const [glimmer, setGlimmer] = useState(false);
  const [burst, setBurst] = useState(false);
  const hasLanded = useRef(false);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion) return;

    // Fire only after the slam squash peaks — not while still falling
    if (latest >= 0.955) {
      if (!hasLanded.current) {
        hasLanded.current = true;
        setGlimmer(false);
        setBurst(false);
        requestAnimationFrame(() => {
          setGlimmer(true);
          setBurst(true);
        });
      }
    } else if (latest < 0.9 && hasLanded.current) {
      hasLanded.current = false;
      setGlimmer(false);
      setBurst(false);
    }
  });

  return (
    <motion.div
      className="flip-card-slot"
      style={
        reduceMotion
          ? { ["--card-tilt" as string]: `${card.tilt}deg` }
          : { x: enterX, y: pressY, rotateZ }
      }
    >
      <motion.article
        className={`flip-card${burst ? " is-bursting" : ""}`}
        style={
          reduceMotion
            ? undefined
            : {
                rotateY,
                y,
                scaleX,
                scaleY,
                boxShadow,
                transformPerspective: 1200,
              }
        }
      >
        <CardFace
          side="front"
          {...card.front}
          mediaScale={reduceMotion ? undefined : mediaScale}
          mediaY={reduceMotion ? undefined : mediaY}
        />
        <CardFace
          side="back"
          {...card.back}
          glimmer={glimmer}
          mediaScale={reduceMotion ? undefined : mediaScale}
          mediaY={reduceMotion ? undefined : mediaY}
        />

        {burst ? (
          <div className="flip-card__burst" aria-hidden>
            <span className="flip-card__burst-star" data-i="0" />
            <span className="flip-card__burst-star" data-i="1" />
            <span className="flip-card__burst-star" data-i="2" />
            <span className="flip-card__burst-star" data-i="3" />
            <span className="flip-card__burst-star" data-i="4" />
            <span className="flip-card__burst-star" data-i="5" />
            <span className="flip-card__burst-spark" data-i="0" />
            <span className="flip-card__burst-spark" data-i="1" />
            <span className="flip-card__burst-spark" data-i="2" />
            <span className="flip-card__burst-spark" data-i="3" />
            <span className="flip-card__burst-spark" data-i="4" />
            <span className="flip-card__burst-spark" data-i="5" />
          </div>
        ) : null}
      </motion.article>
    </motion.div>
  );
}

function useWindowProgress(
  global: MotionValue<number>,
  start: number,
  end: number,
) {
  return useTransform(global, [start, end], [0, 1], { clamp: true });
}

export function ScrollFlipCard({
  header,
  layout = "sticky",
}: {
  header?: ReactNode;
  /** sticky = tall pin scrub; inline = flips while the row crosses the viewport */
  layout?: "sticky" | "inline";
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset:
      layout === "inline"
        ? ["start 0.85", "end 0.2"]
        : ["start start", "end end"],
  });

  // Assemble while the heading is still scrolling away — as the card
  // scene rises through the lower viewport, not after a pause at pin.
  const { scrollYProgress: approachProgress } = useScroll({
    target: sceneRef,
    offset:
      layout === "inline"
        ? ["start 0.95", "start 0.4"]
        : ["start 0.92", "start 0.28"],
  });

  const assemble = useTransform(approachProgress, [0, 1], [0, 1], {
    clamp: true,
  });

  const p0 = useWindowProgress(
    scrollYProgress,
    FLIP_WINDOWS[0][0],
    FLIP_WINDOWS[0][1],
  );
  const p1 = useWindowProgress(
    scrollYProgress,
    FLIP_WINDOWS[1][0],
    FLIP_WINDOWS[1][1],
  );
  const p2 = useWindowProgress(
    scrollYProgress,
    FLIP_WINDOWS[2][0],
    FLIP_WINDOWS[2][1],
  );
  const localProgress = [p0, p1, p2];

  return (
    <section
      ref={sceneRef}
      className={`card-flip-scene${layout === "inline" ? " card-flip-scene--inline" : ""}`}
      aria-label="Karten-Flip Reihe"
    >
      <div className="card-flip-scene__sticky">
        {header}
        <div className="flip-card-row">
          {CARDS.map((card, index) => (
            <FlipCard
              key={card.id}
              card={card}
              index={index}
              progress={localProgress[index]!}
              assemble={assemble}
              leftNeighbor={
                index > 0 ? localProgress[index - 1] : undefined
              }
              rightNeighbor={
                index < localProgress.length - 1
                  ? localProgress[index + 1]
                  : undefined
              }
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
