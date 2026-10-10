"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const symptomFrames = [
  "/images/card-flip/card-1-front.png",
  "/images/card-flip/card-2-front.png",
  "/images/card-flip/card-3-front.png",
] as const;

const outcomes = [
  { image: "/images/card-flip/card-1-back.png", title: "Verstanden" },
  { image: "/images/card-flip/card-2-back.png", title: "Persönlich" },
  { image: "/images/card-flip/card-3-back.png", title: "Überzeugt" },
] as const;

/** One visitor session: 7 s on the page, then a beat of "gone", then replay. */
const SESSION = 7;
const LOOP = 9.5;

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * Symptom → Diagnose → Lösung. Few words; each scene is explained by a
 * small piece of motion on an edit-timeline language.
 */
export function ComicDiagnosis() {
  const scenesRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scenesRef,
    offset: ["start 0.7", "end 0.6"],
  });

  return (
    <section id="diagnose" className="comic-diagnosis">
      <div className="comic-shell flex flex-col items-center gap-14 md:gap-20">
        <ComicSectionIntro light title="Gutes Angebot. Zu wenig Anfragen." />

        <ol ref={scenesRef} className="comic-diagnosis__scenes">
          <span className="comic-diagnosis__rail" aria-hidden>
            <motion.span
              className="comic-diagnosis__playhead"
              style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
            />
          </span>

          <Scene label="Symptom" title="7 Sekunden." line="Dann sind Besucher wieder weg.">
            <SessionVisual reduceMotion={!!reduceMotion} />
          </Scene>

          <Scene
            label="Diagnose"
            title="Im Gespräch überzeugst du."
            line="Online fehlt dir die Zeit dafür."
          >
            <TalkVsWebVisual reduceMotion={!!reduceMotion} />
          </Scene>

          <Scene
            label="Lösung"
            title="Der Erklärfilm erklärt für dich."
            line="In 90 Sekunden. Für jeden Besucher."
          >
            <FilmVisual reduceMotion={!!reduceMotion} />
          </Scene>
        </ol>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}

function Scene({
  label,
  title,
  line,
  children,
}: {
  label: string;
  title: string;
  line: string;
  children: ReactNode;
}) {
  return (
    <li className="comic-diagnosis__scene">
      <span className="comic-diagnosis__keyframe" aria-hidden />
      <div className="comic-diagnosis__copy">
        <p className="comic-diagnosis__label">{label}</p>
        <h3 className="comic-diagnosis__title">{title}</h3>
        <p className="comic-diagnosis__body">{line}</p>
      </div>
      <div className="comic-diagnosis__visual">{children}</div>
    </li>
  );
}

/* --- Scene 1: a visitor session that ends after 7 seconds -------------- */

function SessionVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const t = useMotionValue(reduceMotion ? SESSION - 0.5 : 0);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    t.set(0);
    const controls = animate(t, LOOP, {
      duration: LOOP,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [inView, reduceMotion, t]);

  const clock = useTransform(t, (v) => formatTime(Math.min(v, SESSION)));
  const progress = useTransform(t, [0, SESSION], [0, 1], { clamp: true });
  const gone = useTransform(t, [SESSION, SESSION + 0.35], [0, 1], { clamp: true });
  const pageOpacity = useTransform(gone, [0, 1], [1, 0.25]);

  return (
    <div ref={ref} className="comic-session" aria-label="Ein Besuch dauert 7 Sekunden">
      <div className="comic-session__bar">
        <span className="comic-session__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="comic-session__url">deine-website.de</span>
        <motion.span className="comic-session__clock">{clock}</motion.span>
      </div>
      <motion.span
        className="comic-session__progress"
        style={{ scaleX: progress }}
        aria-hidden
      />
      <motion.div className="comic-session__page" style={{ opacity: pageOpacity }}>
        {symptomFrames.map((src, index) => (
          <SessionFrame key={src} src={src} index={index} t={t} />
        ))}
      </motion.div>
      <motion.p className="comic-session__gone" style={{ opacity: gone }} aria-hidden>
        Tab geschlossen
      </motion.p>
    </div>
  );
}

function SessionFrame({
  src,
  index,
  t,
}: {
  src: string;
  index: number;
  t: MotionValue<number>;
}) {
  // Text overload → open questions → the clock runs out.
  const slot = SESSION / symptomFrames.length;
  const start = index * slot;
  const opacity = useTransform(
    t,
    index === 0
      ? [0, slot - 0.25, slot]
      : [start - 0.25, start, start + slot - 0.25, start + slot],
    index === 0 ? [1, 1, 0] : [0, 1, 1, index === symptomFrames.length - 1 ? 1 : 0],
  );

  return (
    <motion.div className="comic-session__frame" style={{ opacity }}>
      <Image src={src} alt="" fill sizes="(max-width: 1024px) 90vw, 640px" />
    </motion.div>
  );
}

/* --- Scene 2: 30 minutes of conversation vs. 7 seconds online ---------- */

function TalkVsWebVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const p = useMotionValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const controls = animate(p, 1, { duration: 2.4, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, reduceMotion, p]);

  const talkWidth = useTransform(p, (v) => `${v * 100}%`);
  const talkClock = useTransform(p, (v) => formatTime(v * 1800));
  const webClock = useTransform(p, (v) => formatTime(Math.min(v * 4, 1) * 7));
  const done = useTransform(p, [0.85, 1], [0, 1]);

  return (
    <div ref={ref} className="comic-edit" aria-label="Gespräch: 30 Minuten. Website: 7 Sekunden.">
      <div className="comic-edit__track">
        <span className="comic-edit__name">Gespräch</span>
        <div className="comic-edit__lane">
          <motion.span
            className="comic-edit__clip comic-edit__clip--talk"
            style={{ width: talkWidth }}
          />
        </div>
        <motion.span className="comic-edit__time">{talkClock}</motion.span>
        <motion.span className="comic-edit__mark is-yes" style={{ opacity: done }}>
          ✓
        </motion.span>
      </div>
      <div className="comic-edit__track">
        <span className="comic-edit__name">Website</span>
        <div className="comic-edit__lane">
          <span className="comic-edit__clip comic-edit__clip--web" />
        </div>
        <motion.span className="comic-edit__time">{webClock}</motion.span>
        <motion.span className="comic-edit__mark is-no" style={{ opacity: done }}>
          ✕
        </motion.span>
      </div>
    </div>
  );
}

/* --- Scene 3: the explainer film fills the gap ------------------------- */

function FilmVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const play = reduceMotion || inView;

  return (
    <div ref={ref} className="comic-film">
      <div className="comic-edit">
        <div className="comic-edit__track">
          <span className="comic-edit__name">Website</span>
          <div className="comic-edit__lane">
            <span className="comic-edit__clip comic-edit__clip--web" />
            <motion.span
              className="comic-edit__clip comic-edit__clip--film"
              initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={play ? { scaleX: 1, opacity: 1 } : undefined}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              ▶<span className="comic-edit__film-label">Erklärfilm · 01:30</span>
            </motion.span>
          </div>
          <span className="comic-edit__time">01:37</span>
          <motion.span
            className="comic-edit__mark is-yes"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ delay: 1.1 }}
          >
            ✓
          </motion.span>
        </div>
      </div>

      <ul className="comic-film__outcomes">
        {outcomes.map((item, index) => (
          <motion.li
            key={item.title}
            className="comic-film__outcome"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 1.2 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={item.image}
              alt=""
              width={320}
              height={200}
              className="comic-film__media"
            />
            <span>{item.title}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
