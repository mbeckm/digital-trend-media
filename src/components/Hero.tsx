"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";
import {
  revealItem,
  revealSoft,
  revealStagger,
  revealTransition,
} from "@/components/motion/reveal";
import { YouTubeBackground } from "@/components/YouTubeEmbed";

const enterTransition = revealTransition;
const stagger = revealStagger;

/** Smoothstep — relaxed scrub, no linear “machine” feel. */
function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Extra scroll after full-bleed so the film can sit before Benefits. */
const HOLD_VH = 0.48;
const HOLD_MIN = 280;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const media = mediaRef.current;
    const intro = introRef.current;
    if (!section || !media) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const mediaEndHeight = () =>
      Math.min(window.innerWidth * 0.5625, window.innerHeight * 0.78);

    const layoutPin = () => {
      if (!pin || reduceQuery.matches) {
        pin?.style.removeProperty("height");
        return;
      }
      const hold = Math.max(window.innerHeight * HOLD_VH, HOLD_MIN);
      // Sticky stage = full film height + hold travel after expand settles.
      pin.style.height = `${mediaEndHeight() + hold}px`;
    };

    const update = () => {
      if (reduceQuery.matches) {
        section.style.setProperty("--hero-p", "0");
        media.style.removeProperty("--hero-p");
        pin?.style.removeProperty("height");
        if (intro) intro.style.pointerEvents = "auto";
        return;
      }

      layoutPin();

      // Expand finishes before the hold — then p stays at 1 while sticky.
      const expandDistance = Math.max(window.innerHeight * 0.52, 340);
      const raw = Math.min(1, Math.max(0, window.scrollY / expandDistance));
      const p = smoothstep(raw);

      section.style.setProperty("--hero-p", p.toFixed(4));
      media.classList.remove("hero-media--css-scroll");
      media.style.setProperty("--hero-p", p.toFixed(4));

      if (intro) {
        intro.style.pointerEvents = p > 0.72 ? "none" : "auto";
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduceQuery.addEventListener("change", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduceQuery.removeEventListener("change", onScroll);
    };
  }, []);

  const showMotion = !reduceMotion;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero relative isolate flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <CloudsVolumetric className="hero-clouds -z-10" />

      <div
        ref={introRef}
        className="flex w-full flex-col items-center gap-8 md:gap-10"
      >
        <div className="hero-copy w-full px-6 md:px-12">
          <motion.div
            className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6"
            initial={showMotion ? "hidden" : false}
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: stagger, delayChildren: 0.06 },
              },
            }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.h1
                className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.025em] text-balance text-black"
                variants={revealItem}
                transition={enterTransition}
              >
                Komplexes.
              </motion.h1>
              <motion.p
                className="-mt-2 bg-clip-text font-[family-name:var(--font-inter-tight)] text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.025em] text-transparent"
                style={{ backgroundImage: "var(--gradient-blue-text)" }}
                variants={revealItem}
                transition={enterTransition}
              >
                Einfach erklärt.
              </motion.p>
            </div>
            <motion.p
              className="mx-auto max-w-[40rem] text-pretty text-center font-[family-name:var(--font-inter-tight)] text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.015em] text-black"
              variants={revealSoft}
              transition={enterTransition}
            >
              Menschen kaufen nur, was sie auch verstehen. Wir machen Erklärfilme,
              die eure Zielgruppe begeistern und aus Interesse Anfragen machen.
            </motion.p>
          </motion.div>
        </div>

        <div className="hero-cta-scroll">
          <motion.a
            id="kontakt"
            href="#kontakt"
            className="hero-cta"
            initial={
              showMotion
                ? { opacity: 0, y: 12, filter: "blur(5px)" }
                : false
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...enterTransition, delay: showMotion ? 0.32 : 0 }}
          >
            Kostenloses Erstgespräch
          </motion.a>
        </div>
      </div>

      <div ref={pinRef} className="hero-pin w-full">
        <motion.div
          className="hero-pin-sticky flex w-full justify-center"
          initial={
            showMotion
              ? { opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" }
              : false
          }
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{
            ...enterTransition,
            duration: 1.05,
            delay: showMotion ? 0.28 : 0,
          }}
        >
          <div ref={mediaRef} className="hero-media relative overflow-hidden">
            <YouTubeBackground title="Digital Trend Media Showreel" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
