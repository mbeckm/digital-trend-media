"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { PRIMARY_VIDEO, VimeoHeroPlayer } from "@/components/VimeoEmbed";
import { CALENDLY_URL } from "@/lib/calendly";

const spring = { type: "spring" as const, duration: 0.55, bounce: 0.12 };

export function CloudsHero() {
  const reduceMotion = useReducedMotion();
  const show = !reduceMotion;

  return (
    <section id="top" className="relative isolate overflow-x-clip">
      <div aria-hidden className="bl-clouds absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 8% 18%, rgb(232 145 168 / 0.55), transparent 60%),
            radial-gradient(ellipse 55% 50% at 48% 8%, rgb(163 137 189 / 0.5), transparent 62%),
            radial-gradient(ellipse 65% 55% at 92% 22%, rgb(91 180 232 / 0.6), transparent 58%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgb(255 250 247 / 0.5), transparent 55%)
          `,
        }}
      />

      <div className="relative px-[var(--bl-gutter)] pt-10 md:pt-14">
        <div className="relative mx-auto grid w-full max-w-[var(--bl-container)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <div className="relative z-10 flex flex-col items-start gap-6 md:gap-7">
            <motion.p
              initial={show ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
              className="text-sm font-semibold tracking-[0.04em] text-[var(--bl-ink)]/70 uppercase"
            >
              Digital Trend Media
            </motion.p>

            <motion.h1
              initial={show ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.06 }}
              className="bl-display max-w-[14ch] text-[clamp(2.5rem,6.5vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.035em] text-balance text-[var(--bl-ink)]"
            >
              Komplexes.
              <br />
              Einfach erklärt.
            </motion.h1>

            <motion.p
              initial={show ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.12 }}
              className="max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-[var(--bl-muted)] md:text-[1.125rem]"
            >
              Menschen kaufen nur, was sie auch verstehen. Wir machen Erklärfilme,
              die eure Zielgruppe begeistern und aus Interesse Anfragen machen.
            </motion.p>

            <motion.a
              id="kontakt"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bl-btn"
              initial={show ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.18 }}
            >
              Kostenloses Erstgespräch
            </motion.a>
          </div>

          <motion.div
            initial={show ? { opacity: 0, y: 22 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.14, duration: 0.65 }}
            className="relative z-10 mb-2 lg:mb-8"
          >
            <div className="bl-media aspect-[16/10] w-full shadow-[var(--bl-shadow-soft)]">
              <VimeoHeroPlayer
                video={PRIMARY_VIDEO}
                title="Digital Trend Media Showreel"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={show ? { opacity: 0, y: 28 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.22, duration: 0.7 }}
        className="relative mt-4 md:mt-0"
      >
        <div className="relative mx-auto w-[min(1400px,112%)] max-w-none origin-bottom scale-[1.06] md:scale-110">
          <Image
            src="/images/brand-lab/characters-clouds.png"
            alt="Figuren aus den Erklärfilmen von Digital Trend Media"
            width={1024}
            height={296}
            priority
            className="relative z-0 h-auto w-full select-none object-cover object-bottom"
            sizes="100vw"
          />
        </div>
      </motion.div>
    </section>
  );
}
