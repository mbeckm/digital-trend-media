"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  DotBurst,
  ScribbleArrow,
  SpeechBubble,
  SquiggleUnderline,
} from "@/components/brand-lab/graphics";
import { PRIMARY_VIDEO, VimeoHeroPlayer } from "@/components/VimeoEmbed";
import { CALENDLY_URL } from "@/lib/calendly";

const spring = { type: "spring" as const, duration: 0.55, bounce: 0.18 };

export function BrandHero() {
  const reduceMotion = useReducedMotion();
  const show = !reduceMotion;

  return (
    <section
      id="top"
      className="relative isolate overflow-x-clip px-[var(--bl-gutter)] pb-10 pt-10 md:pb-16 md:pt-14"
    >
      {/* Bold color field — not a subtle gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 size-[min(52vw,28rem)] rounded-[40%_60%_55%_45%] bg-[var(--bl-blue)] opacity-[0.12] md:top-4"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-24 size-40 rounded-full bg-[var(--bl-yellow)] opacity-40 blur-[2px] md:bottom-32"
      />

      <div className="relative mx-auto grid w-full max-w-[var(--bl-container)] gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-12">
        <div className="flex flex-col items-start gap-7 md:gap-8">
          <motion.div
            initial={show ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="bl-sticker bg-[var(--bl-green)] text-white">
              Erklärfilme
            </span>
            <span className="bl-sticker rotate-[-3deg] bg-[var(--bl-surface)]">
              Klar · menschlich · wirksam
            </span>
          </motion.div>

          <div className="relative max-w-[22ch]">
            <motion.p
              initial={show ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.05 }}
              className="bl-display mb-3 text-[clamp(1.15rem,2.4vw,1.45rem)] font-bold tracking-[-0.03em] text-[var(--bl-blue)]"
            >
              Digital Trend Media
            </motion.p>

            <motion.h1
              initial={show ? { opacity: 0, y: 22 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="bl-display text-[clamp(2.6rem,7.2vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-balance text-[var(--bl-ink)]"
            >
              Komplexes.
              <br />
              <span className="relative inline-block">
                Einfach erklärt.
                <SquiggleUnderline className="absolute -bottom-1 left-0 h-3 w-full md:-bottom-2 md:h-3.5" />
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={show ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.18 }}
            className="max-w-[36rem] text-pretty text-[clamp(1.05rem,1.7vw,1.2rem)] font-medium leading-[1.45] text-[var(--bl-muted)]"
          >
            Menschen kaufen nur, was sie auch verstehen. Wir machen Erklärfilme,
            die eure Zielgruppe begeistern und aus Interesse Anfragen machen.
          </motion.p>

          <motion.div
            initial={show ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.26 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              id="kontakt"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bl-btn"
            >
              Kostenloses Erstgespräch
            </a>
            <div className="relative hidden sm:block">
              <ScribbleArrow
                className="h-10 w-24 text-[var(--bl-orange)]"
                color="currentColor"
              />
              <span className="bl-display absolute -right-2 top-9 rotate-6 text-xs font-bold text-[var(--bl-orange)]">
                20 Min. Klarheit
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={show ? { opacity: 0, y: 28, rotate: 2 } : false}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ ...spring, delay: 0.2, duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -left-3 -top-5 z-20 sm:-left-6 sm:-top-6">
            <SpeechBubble tone="orange" className="bl-wiggle max-w-[11rem]">
              Hä? → Aha!
            </SpeechBubble>
          </div>
          <DotBurst className="bl-bob absolute -right-2 top-10 z-10 size-12 md:size-14" />

          <div className="bl-media aspect-[16/10] w-full rotate-[-1.5deg] shadow-[6px_6px_0_var(--bl-ink)] md:rotate-[-2deg]">
            <VimeoHeroPlayer
              video={PRIMARY_VIDEO}
              title="Digital Trend Media Showreel"
            />
          </div>

          <p className="bl-display mt-4 rotate-[-1deg] text-center text-sm font-bold tracking-[-0.01em] text-[var(--bl-muted)] md:text-left">
            Unser Showreel — lieber schauen als lesen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
