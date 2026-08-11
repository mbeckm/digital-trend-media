"use client";

import { motion, useReducedMotion } from "motion/react";

import { DotBurst } from "@/components/brand-lab/graphics";
import { CASE_STUDIES, caseStudyHref } from "@/components/stories/data";

const accents = [
  {
    bubble: "bg-[var(--bl-yellow)]",
    metric: "bg-[var(--bl-blue-deep)] text-white",
    rotate: "-1.5deg",
  },
  {
    bubble: "bg-[var(--bl-surface)]",
    metric: "bg-[var(--bl-orange)] text-white",
    rotate: "1.2deg",
  },
  {
    bubble: "bg-[var(--bl-red)] text-white",
    metric: "bg-[var(--bl-ink)] text-[var(--bl-yellow)]",
    rotate: "-0.8deg",
  },
] as const;

const stories = CASE_STUDIES.slice(0, 3);

export function BrandProof() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="kunden"
      className="relative overflow-x-clip px-[var(--bl-gutter)] py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-10 size-24 rounded-[28%] bg-[var(--bl-red)]/15 md:size-32"
      />

      <div className="relative mx-auto w-full max-w-[var(--bl-container)]">
        <div className="mb-12 max-w-[40rem] md:mb-16">
          <p className="bl-sticker mb-4 bg-[var(--bl-red)] text-white">
            Echte Ergebnisse
          </p>
          <h2 className="bl-display text-[clamp(2.1rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.04em] text-balance text-[var(--bl-ink)]">
            Geschichten unserer Kunden
          </h2>
          <p className="mt-4 max-w-[42ch] text-pretty text-[1.05rem] leading-relaxed text-[var(--bl-muted)]">
            Weniger Marketing-Sprech, mehr Dialog — so klingen die Leute, mit
            denen wir arbeiten.
          </p>
        </div>

        <div className="flex flex-col gap-10 md:gap-14">
          {stories.map((study, i) => {
            const accent = accents[i % accents.length];
            const flip = i % 2 === 1;

            return (
              <motion.article
                key={study.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{
                  type: "spring",
                  duration: 0.5,
                  bounce: 0.12,
                  delay: i * 0.06,
                }}
                className={`grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10 ${
                  flip ? "md:[direction:rtl]" : ""
                }`}
              >
                <div
                  className={`relative rounded-[var(--bl-radius-lg)] border-[2.5px] border-[var(--bl-ink)] px-6 py-6 shadow-[5px_5px_0_var(--bl-ink)] md:px-8 md:py-8 ${accent.bubble} ${
                    flip ? "md:[direction:ltr]" : ""
                  }`}
                  style={{ transform: `rotate(${accent.rotate})` }}
                >
                  <p className="bl-display text-[clamp(1.2rem,2.4vw,1.65rem)] font-bold leading-[1.35] tracking-[-0.02em]">
                    „{study.quote}“
                  </p>
                  <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-bold">{study.company}</span>
                    <span className="text-sm text-[var(--bl-muted)]">
                      {study.industry}
                    </span>
                  </div>
                  {/* Speech tail */}
                  <span
                    aria-hidden
                    className={`absolute -bottom-2.5 size-4 rotate-45 border-b-[2.5px] border-r-[2.5px] border-[var(--bl-ink)] bg-inherit ${
                      flip ? "right-10" : "left-10"
                    }`}
                  />
                </div>

                <div
                  className={`relative flex flex-col items-start gap-4 ${
                    flip ? "md:items-end md:[direction:ltr]" : ""
                  }`}
                >
                  <div
                    className={`relative inline-flex flex-col rounded-[var(--bl-radius-md)] border-[2.5px] border-[var(--bl-ink)] px-5 py-4 shadow-[4px_4px_0_var(--bl-ink)] ${accent.metric}`}
                  >
                    <span className="bl-display text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
                      {study.metric}
                    </span>
                    <span className="mt-1 max-w-[14ch] text-xs font-semibold leading-snug opacity-90">
                      {study.metricLabel}
                    </span>
                    {i === 0 ? (
                      <DotBurst className="absolute -right-5 -top-5 size-10" />
                    ) : null}
                  </div>

                  <a
                    href={caseStudyHref(study.slug)}
                    className="bl-display text-sm font-bold text-[var(--bl-blue)] underline decoration-[3px] decoration-[var(--bl-yellow)] underline-offset-4 transition-colors hover:text-[var(--bl-ink)]"
                  >
                    Zur Case Study →
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
