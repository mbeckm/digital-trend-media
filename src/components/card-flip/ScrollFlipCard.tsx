"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
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

/** Consecutive windows with abutting ranges so cards flip one after another. */
const FLIP_WINDOWS = [
  [0.02, 0.34],
  [0.34, 0.66],
  [0.66, 0.98],
] as const;

/** Ease-in: slow start, then accelerates (lift / flip / gravity). */
function easeInCubic(t: number) {
  return t * t * t;
}

function easeInQuad(t: number) {
  return t * t;
}

type FaceProps = {
  image: string;
  title: string;
  body: string;
  side: "front" | "back";
  glimmer?: boolean;
};

function CardFace({ image, title, body, side, glimmer }: FaceProps) {
  return (
    <div className={`flip-card__face flip-card__face--${side}`}>
      <div className="flip-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" />
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
 *  0–38%   glued to the ground (hard to pick up)
 * 38–54%   peel / lift with ease-in (little motion, then fast float)
 * 50–74%   flip with ease-in acceleration
 * 74–92%   gravity fall (short window, accelerating down)
 * 92–100%  settled — headline glimmer can fire
 */
function useFlipPhysics(progress: MotionValue<number>) {
  const rotateY = useTransform(progress, (p) => {
    if (p < 0.5) return 0;
    if (p < 0.54) {
      const t = (p - 0.5) / 0.04;
      return easeInQuad(t) * 8;
    }
    if (p < 0.74) {
      const t = (p - 0.54) / 0.2;
      return 8 + easeInCubic(t) * 172;
    }
    return 180;
  });

  const y = useTransform(progress, (p) => {
    // Slight press into the table — sticky / glued feel
    if (p < 0.32) return 0;
    if (p < 0.38) {
      const t = (p - 0.32) / 0.06;
      return easeInQuad(t) * 4;
    }
    // Peel off: slow at first, then shoots up
    if (p < 0.54) {
      const t = (p - 0.38) / 0.16;
      return 4 - easeInCubic(t) * 56;
    }
    // Hold near peak while flipping
    if (p < 0.74) {
      const t = (p - 0.54) / 0.2;
      return -52 + t * 4;
    }
    // Gravity: compressed window, strong ease-in so it drops hard
    if (p < 0.92) {
      const t = (p - 0.74) / 0.18;
      return -48 + easeInCubic(t) * 48;
    }
    return 0;
  });

  const scale = useTransform(progress, (p) => {
    if (p < 0.38) return 1;
    if (p < 0.54) {
      const t = (p - 0.38) / 0.16;
      return 1 + easeInCubic(t) * 0.09;
    }
    if (p < 0.74) {
      const t = (p - 0.54) / 0.2;
      return 1.09 - t * 0.05;
    }
    if (p < 0.92) {
      const t = (p - 0.74) / 0.18;
      return 1.04 - easeInCubic(t) * 0.04;
    }
    return 1;
  });

  const shadow = useTransform(progress, (p) => {
    let lift = 0;
    if (p >= 0.38 && p < 0.54) {
      lift = easeInCubic((p - 0.38) / 0.16);
    } else if (p >= 0.54 && p < 0.74) {
      lift = 1 - ((p - 0.54) / 0.2) * 0.2;
    } else if (p >= 0.74 && p < 0.92) {
      lift = 0.8 * (1 - easeInCubic((p - 0.74) / 0.18));
    }

    const yOff = 8 + lift * 28;
    const blur = lift * 40;
    const alpha = 0.08 + lift * 0.22;
    return `0 ${yOff}px ${blur}px rgba(26,0,26,${alpha.toFixed(3)})`;
  });

  return { rotateY, y, scale, boxShadow: shadow };
}

function FlipCard({
  card,
  progress,
  reduceMotion,
}: {
  card: CardPair;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const { rotateY, y, scale, boxShadow } = useFlipPhysics(progress);
  const [glimmer, setGlimmer] = useState(false);
  const hasLanded = useRef(false);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion) return;

    if (latest >= 0.92) {
      if (!hasLanded.current) {
        hasLanded.current = true;
        setGlimmer(false);
        requestAnimationFrame(() => setGlimmer(true));
      }
    } else if (latest < 0.74 && hasLanded.current) {
      hasLanded.current = false;
      setGlimmer(false);
    }
  });

  return (
    <div
      className="flip-card-slot"
      style={{ ["--card-tilt" as string]: `${card.tilt}deg` }}
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
        <CardFace side="back" {...card.back} glimmer={glimmer} />
      </motion.article>
    </div>
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
              progress={localProgress[index]!}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
