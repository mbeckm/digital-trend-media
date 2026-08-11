"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { PlayBadge, SpeechBubble } from "@/components/brand-lab/graphics";
import { films } from "@/components/portfolio/data";
import {
  VimeoPlayer,
  vimeoPosterSrc,
  type VimeoVideo,
} from "@/components/VimeoEmbed";

const featuredIds = ["intalcon", "keyspot", "frenger", "tempmate"] as const;

const picks = featuredIds
  .map((id) => films.find((f) => f.id === id))
  .filter(Boolean) as typeof films;

function FilmTile({
  title,
  client,
  stil,
  video,
  large = false,
  accent,
  tilt = 0,
}: {
  title: string;
  client: string;
  stil: string;
  video: VimeoVideo;
  large?: boolean;
  accent: string;
  tilt?: number;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <article
      className={`group relative flex flex-col gap-3 ${large ? "lg:col-span-7" : "lg:col-span-5"}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      <div
        className={`bl-media relative w-full overflow-hidden shadow-[5px_5px_0_var(--bl-ink)] ${
          large ? "aspect-[16/10]" : "aspect-video"
        }`}
      >
        {playing ? (
          <VimeoPlayer video={video} title={`${client}: ${title}`} />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Video abspielen: ${title}`}
            className="absolute inset-0 block h-full w-full cursor-pointer"
          >
            <Image
              src={vimeoPosterSrc(video)}
              alt=""
              fill
              unoptimized
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes={
                large
                  ? "(max-width: 1024px) 100vw, 60vw"
                  : "(max-width: 1024px) 100vw, 40vw"
              }
            />
            <span className="absolute inset-0 bg-[var(--bl-ink)]/25 transition-colors duration-300 group-hover:bg-[var(--bl-ink)]/15" />
            <PlayBadge className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span
              className="bl-sticker absolute left-3 top-3 text-[var(--bl-ink)]"
              style={{ background: accent }}
            >
              {stil}
            </span>
          </button>
        )}
      </div>

      <div className={`flex flex-col gap-1 ${large ? "md:flex-row md:items-end md:justify-between md:gap-6" : ""}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bl-blue)]">
            {client}
          </p>
          <h3
            className={`bl-display mt-1 font-extrabold tracking-[-0.03em] text-[var(--bl-ink)] ${
              large
                ? "text-[clamp(1.4rem,2.5vw,2rem)]"
                : "text-[clamp(1.15rem,1.8vw,1.35rem)]"
            }`}
          >
            {title}
          </h3>
        </div>
        {large ? (
          <p className="max-w-[28ch] text-sm leading-snug text-[var(--bl-muted)] md:text-right">
            Komplexe Finanzprodukte — in Klartext, ohne Fachchinesisch.
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function BrandWork() {
  const reduceMotion = useReducedMotion();
  const [hero, second, third, fourth] = picks;
  if (!hero || !second || !third) return null;

  return (
    <section id="portfolio" className="relative overflow-x-clip">
      {/* Bold color block for the section intro only — films sit on cream */}
      <div className="bg-[var(--bl-band)] px-[var(--bl-gutter)] pb-14 pt-16 md:pb-16 md:pt-24">
        <div className="mx-auto flex w-full max-w-[var(--bl-container)] flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-[16ch]">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="bl-sticker mb-4 bg-[var(--bl-yellow)] text-[var(--bl-ink)]"
            >
              Portfolio
            </motion.p>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.05 }}
              className="bl-display text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-balance text-white"
            >
              Von Hä? zu Aha!
            </motion.h2>
          </div>

          <div className="relative max-w-[32rem] md:pb-1">
            <SpeechBubble
              tone="cream"
              className="!text-[0.95rem] !font-semibold !leading-snug !shadow-[4px_4px_0_#0b1f4a] md:!text-base"
            >
              Über 100 Filme. Von Fintech bis Industrie — wir machen komplizierte
              Angebote greifbar.
            </SpeechBubble>
          </div>
        </div>
      </div>

      <div className="px-[var(--bl-gutter)] pb-16 pt-0 md:pb-24">
        <div className="mx-auto w-full max-w-[var(--bl-container)]">
          {/* Dominant work first — not equal cards; lead film overlaps the blue band */}
          <div className="-mt-8 grid grid-cols-1 gap-8 md:-mt-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
            <FilmTile
              {...hero}
              large
              accent="var(--bl-yellow)"
              tilt={-0.6}
            />
            <div className="flex flex-col gap-8 lg:col-span-5 lg:pt-20">
              <FilmTile {...second} accent="var(--bl-orange)" tilt={1.2} />
              <FilmTile {...third} accent="var(--bl-green)" tilt={-0.8} />
            </div>
          </div>

          {fourth ? (
            <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[1fr_minmax(0,1.35fr)] md:items-center md:gap-10">
              <div className="order-2 md:order-1">
                <p className="bl-display text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold tracking-[-0.035em] text-[var(--bl-ink)]">
                  Und noch eins zum Reinzoomen.
                </p>
                <p className="mt-3 max-w-[34ch] text-[var(--bl-muted)] leading-relaxed">
                  {fourth.client}: {fourth.title}. Klick rein — der Film sagt mehr
                  als jede Feature-Liste.
                </p>
                <a
                  href="#kunden"
                  className="bl-btn bl-btn--blue mt-6 !text-sm"
                >
                  Zu den Kundengeschichten
                </a>
              </div>
              <div className="order-1 md:order-2 md:translate-x-4 md:rotate-[1.5deg]">
                <FilmTile {...fourth} accent="var(--bl-red)" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
