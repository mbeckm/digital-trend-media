"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { type ReactNode, useRef } from "react";

type CardPair = {
  id: string;
  front: { image: string; title: string; body: string };
  back: { image: string; title: string; body: string };
};

const CARDS: CardPair[] = [
  {
    id: "text",
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

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

type FaceProps = {
  image: string;
  title: string;
  body: string;
  side: "front" | "back";
};

function CardFace({ image, title, body, side }: FaceProps) {
  return (
    <div className={`flip-card__face flip-card__face--${side}`}>
      <div className="flip-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" />
      </div>
      <div className="flip-card__copy">
        <h2 className="flip-card__title">{title}</h2>
        <p className="flip-card__body">{body}</p>
      </div>
    </div>
  );
}

/**
 * Local card motion (0–1 within each card's window):
 *  0–30%   resting
 * 30–45%   lift slightly off the page
 * 45–80%   turn over
 * 80–100%  settle back down
 */
function useFlipMotion(progress: MotionValue<number>) {
  const rotateYRaw = useTransform(progress, (p) => {
    if (p < 0.45) return 0;
    if (p < 0.8) return easeInOutCubic((p - 0.45) / 0.35) * 180;
    return 180;
  });

  const liftRaw = useTransform(progress, (p) => {
    if (p < 0.3) return 0;
    if (p < 0.45) return easeOutCubic((p - 0.3) / 0.15);
    if (p < 0.8) return 1;
    if (p < 1) return 1 - easeInOutCubic((p - 0.8) / 0.2);
    return 0;
  });

  // Light springs fill gaps between discrete scroll-wheel steps
  // without drifting far from the scrub position.
  const springCfg = { stiffness: 380, damping: 40, mass: 0.3 } as const;
  const rotateY = useSpring(rotateYRaw, springCfg);
  const lift = useSpring(liftRaw, springCfg);

  const y = useTransform(lift, (l) => l * -16);
  const scale = useTransform(lift, (l) => 1 + l * 0.02);
  const boxShadow = useTransform(lift, (l) => {
    const yOff = 10 + l * 18;
    const blur = 30 + l * 30;
    const alpha = 0.16 + l * 0.12;
    return `0 ${yOff.toFixed(1)}px ${blur.toFixed(1)}px -12px rgba(26,0,26,${alpha.toFixed(3)})`;
  });

  return { rotateY, y, scale, boxShadow };
}

function FlipCard({
  card,
  index,
  progress,
  assemble,
  reduceMotion,
}: {
  card: CardPair;
  index: number;
  progress: MotionValue<number>;
  assemble: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const { rotateY, y, scale, boxShadow } = useFlipMotion(progress);

  // Cards fade up into place in sequence as the row scrolls in
  const enterY = useTransform(assemble, (a) => {
    const t = easeOutCubic(Math.min(1, Math.max(0, a * 1.4 - index * 0.2)));
    return 40 * (1 - t);
  });
  const enterOpacity = useTransform(assemble, (a) =>
    Math.min(1, Math.max(0, a * 1.6 - index * 0.25)),
  );

  return (
    <motion.div
      className="flip-card-slot"
      style={reduceMotion ? undefined : { y: enterY, opacity: enterOpacity }}
    >
      <motion.article
        className="flip-card"
        style={
          reduceMotion
            ? undefined
            : {
                rotateY,
                y,
                scale,
                boxShadow,
                transformPerspective: 1200,
              }
        }
      >
        <CardFace side="front" {...card.front} />
        <CardFace side="back" {...card.back} />
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
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
