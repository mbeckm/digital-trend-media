"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const frames = [
  {
    label: "Symptom",
    image: "/images/card-flip/card-3-front.png",
    value: 7,
    unit: "Sek.",
    caption: "bleibt ein Besucher im Schnitt auf deiner Website.",
  },
  {
    label: "Diagnose",
    image: "/images/card-flip/card-2-back.png",
    value: 30,
    unit: "Min.",
    caption: "hast du im Gespräch, um dein Angebot zu erklären.",
  },
  {
    label: "Lösung",
    image: "/images/card-flip/card-1-back.png",
    value: 90,
    unit: "Sek.",
    caption: "braucht ein Erklärfilm, bis dein Angebot sitzt.",
  },
] as const;

/**
 * Symptom → Diagnose → Lösung as three storyboard frames over a studio
 * photo. Each frame lands with one number that counts up in under a second.
 */
export function ComicDiagnosis() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="diagnose" className="comic-diagnosis">
      <Image
        src="/images/studio/studio-grading.webp"
        alt=""
        fill
        sizes="100vw"
        className="comic-diagnosis__bg"
      />
      <div className="comic-shell relative z-10 flex flex-col items-center gap-12 md:gap-16">
        <ComicSectionIntro light title="Gutes Angebot. Zu wenig Anfragen." />

        <ol className="comic-storyboard">
          {frames.map((frame, index) => (
            <motion.li
              key={frame.label}
              className="comic-storyboard__frame"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="comic-storyboard__media">
                <Image
                  src={frame.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 90vw, 30vw"
                />
                <span className="comic-storyboard__shot">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="comic-storyboard__body">
                <p className="comic-storyboard__label">{frame.label}</p>
                <p className="comic-storyboard__stat">
                  <CountUp to={frame.value} delay={0.25 + index * 0.12} reduceMotion={!!reduceMotion} />
                  <span>{frame.unit}</span>
                </p>
                <p className="comic-storyboard__caption">{frame.caption}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}

function CountUp({
  to,
  delay,
  reduceMotion,
}: {
  to: number;
  delay: number;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const value = useMotionValue(reduceMotion ? to : 0);
  const text = useTransform(value, (v) => String(Math.round(v)));

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const controls = animate(value, to, { duration: 0.8, delay, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduceMotion, to, delay, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
