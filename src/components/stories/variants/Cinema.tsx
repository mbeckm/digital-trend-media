"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";
import { CaseStudyLink } from "@/components/stories/CaseStudyLink";
import { CASE_STUDIES, type CaseStudy } from "@/components/stories/data";
import { StoriesHeader } from "@/components/stories/StoriesHeader";
import { VideoShell } from "@/components/stories/VideoShell";

const DRAG_THRESHOLD = 6;

/**
 * Cinema — large video-forward horizontal strip.
 * Brand cues from MoreTestimonials: soft ring shadow, Inter Tight quotes,
 * cloud wash behind copy, generous text padding.
 */
function CinemaCard({
  study,
  seed,
}: {
  study: CaseStudy;
  seed: number;
}) {
  return (
    <article className="flex w-[min(86vw,520px)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-white smooth-shadow-ring-md shadow-[#0c1a3a] md:w-[min(70vw,600px)] lg:w-[640px]">
      <div className="relative">
        <VideoShell
          title={`${study.name}, ${study.company}`}
          videoId={study.videoId}
          duration={study.duration}
          sizes="(max-width: 768px) 90vw, 640px"
          className="aspect-video rounded-none outline-none"
          fade
        />
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <CloudsVolumetric
          variant="subtle"
          seed={seed}
          className="pointer-events-none absolute inset-0 z-0"
        />
        <div className="relative z-10 flex flex-1 flex-col gap-8 p-8 md:gap-10 md:px-10 md:pb-10 md:pt-9 lg:gap-11 lg:px-12 lg:pb-12 lg:pt-10">
          <div className="flex flex-col gap-6 md:gap-7">
            <div className="flex flex-col gap-2.5">
              <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.04em] text-[#0048a8] tabular-nums">
                {study.metric}
              </p>
              <p className="max-w-[28ch] text-pretty text-[1.05rem] font-semibold leading-snug tracking-[-0.015em] text-[#3c3d3e] md:text-[1.125rem]">
                {study.metricLabel}
              </p>
            </div>
            <blockquote className="max-w-[36ch] text-pretty font-[family-name:var(--font-inter-tight)] text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-[1.4] tracking-[-0.02em] text-black">
              „{study.quote}“
            </blockquote>
          </div>

          <div className="mt-auto flex flex-col gap-5 border-t border-black/[0.08] pt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="flex flex-col gap-2">
              <p className="font-[family-name:var(--font-inter-tight)] text-base font-semibold leading-snug tracking-[-0.01em] text-black md:text-lg">
                {study.name}
              </p>
              <p className="text-[15px] leading-snug text-[var(--color-card-meta)]">
                {study.role} · {study.company}
              </p>
            </div>
            <CaseStudyLink slug={study.slug} className="shrink-0 text-base">
              Zur Case Study
            </CaseStudyLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function ScrollButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const label = direction === "prev" ? "Vorherige Story" : "Nächste Story";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full bg-white text-[#132c55] smooth-shadow-ring-sm shadow-[#0c1a3a] transition-[transform,background-color] duration-200 ease-out hover:bg-[#eaf3ff] active:scale-[0.96]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className={direction === "prev" ? "rotate-180" : undefined}
      >
        <path
          d="M6 3.5L10.5 8L6 12.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function CinemaStories() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: -1,
  });

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const amount = card
      ? card.offsetWidth + 24
      : Math.min(el.clientWidth * 0.85, 640);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Touch already has native momentum scrolling.
    if (event.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: event.pointerId,
    };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const el = scrollerRef.current;
    if (!el) return;

    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return;

    if (!drag.moved) {
      drag.moved = true;
      el.classList.add("is-dragging");
    }

    event.preventDefault();
    el.scrollLeft = drag.scrollLeft - dx;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const el = scrollerRef.current;

    drag.active = false;
    drag.pointerId = -1;
    el?.classList.remove("is-dragging");

    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    // Keep `moved` true until the following click capture handler clears it.
  };

  // Suppress click on children after a drag so play / links don't fire mid-swipe.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onClickCapture = (event: MouseEvent) => {
      if (!dragRef.current.moved) return;
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    };

    el.addEventListener("click", onClickCapture, true);
    return () => el.removeEventListener("click", onClickCapture, true);
  }, []);

  return (
    <section
      id="kunden"
      className="flex w-full flex-col gap-10 py-10 md:gap-14 md:py-14"
    >
      <div className="flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
        <StoriesHeader />
        <div className="hidden shrink-0 gap-2 md:flex">
          <ScrollButton direction="prev" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="next" onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="stories-cinema-track -mx-6 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-6 pt-1 pb-10 [scrollbar-width:none] md:-mx-10 md:gap-6 md:px-10 md:pb-12 lg:-mx-12 lg:gap-7 lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {CASE_STUDIES.map((study, index) => (
          <CinemaCard
            key={study.slug}
            study={study}
            seed={index * 2.7}
          />
        ))}
      </div>
    </section>
  );
}
