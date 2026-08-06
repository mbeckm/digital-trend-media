"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import {
  YouTubePlayer,
  youTubePoster,
} from "@/components/YouTubeEmbed";
import type { Film } from "@/components/portfolio/data";

const spring = { type: "spring" as const, duration: 0.45, bounce: 0 };

export function WallPoster({
  film,
  sizes,
}: {
  film: Film;
  sizes: string;
}) {
  return (
    <>
      <Image
        src={youTubePoster(film.videoId)}
        alt=""
        fill
        className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03]"
        sizes={sizes}
      />
      <span className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/25" />
    </>
  );
}

export function FilmExpand({
  film,
  onClose,
}: {
  film: Film | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [showPlayer, setShowPlayer] = useState(false);

  const handleClose = useCallback(() => {
    setShowPlayer(false);
    window.requestAnimationFrame(() => onClose());
  }, [onClose]);

  useEffect(() => {
    if (!film) {
      setShowPlayer(false);
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const playerTimer = window.setTimeout(
      () => setShowPlayer(true),
      reduceMotion ? 0 : 420,
    );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(playerTimer);
    };
  }, [film, reduceMotion, handleClose]);

  return (
    <AnimatePresence>
      {film ? (
        <div
          key={film.id}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
        >
          <motion.button
            type="button"
            aria-label="Schließen"
            className="absolute inset-0 cursor-default bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onClick={handleClose}
          />

          <motion.div
            layoutId={`film-card-${film.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-[1080px] flex-col overflow-hidden rounded-[28px] bg-[#0c0f14] text-white smooth-shadow-ring-2xl smooth-ring-white/12 shadow-black md:rounded-[32px] lg:flex-row"
            transition={reduceMotion ? { duration: 0 } : spring}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video w-full shrink-0 bg-black lg:aspect-auto lg:w-[58%] lg:min-h-[420px]">
              <motion.div
                layoutId={`film-media-${film.id}`}
                className="absolute inset-0 overflow-hidden"
                transition={reduceMotion ? { duration: 0 } : spring}
              >
                {showPlayer ? (
                  <YouTubePlayer videoId={film.videoId} title={film.title} />
                ) : (
                  <WallPoster
                    film={film}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                )}
              </motion.div>
            </div>

            <motion.div
              className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5 sm:p-7 lg:p-8"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.35, bounce: 0, delay: 0.1 }
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {film.client} · {film.branche}
                  </p>
                  <h3
                    id={titleId}
                    className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.08] tracking-[-0.03em]"
                  >
                    {film.title}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={handleClose}
                  aria-label="Case Study schließen"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,transform] hover:bg-white/15 active:scale-[0.96]"
                >
                  <X className="size-5" strokeWidth={2} />
                </button>
              </div>

              <p className="text-pretty text-[15px] leading-[1.55] text-white/70 sm:text-[16px]">
                {film.summary}
              </p>

              <ul className="flex flex-col gap-2.5">
                {film.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-[14px] leading-snug text-white/85 sm:text-[15px]"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/55"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-5 text-[12px] text-white/40">
                <span>{film.stil}</span>
                <span aria-hidden>·</span>
                <span>{film.videoart}</span>
              </div>

              <a
                href={film.caseHref}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-black transition-transform active:scale-[0.96]"
              >
                Vollständige Case Study
                <span aria-hidden>→</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
