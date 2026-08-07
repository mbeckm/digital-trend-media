"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyLink } from "@/components/stories/CaseStudyLink";
import { CASE_STUDIES, type CaseStudy } from "@/components/stories/data";
import { StoriesHeader } from "@/components/stories/StoriesHeader";
import { VideoShell } from "@/components/stories/VideoShell";

const DRAG_THRESHOLD = 6;
/** px/ms — below this, treat release as a settle (no fling). */
const VELOCITY_MIN = 0.05;
/** Exponential friction per millisecond for desktop inertia. */
const FRICTION_PER_MS = 0.0032;

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
    <article className="flex w-[min(86vw,520px)] flex-col overflow-hidden rounded-2xl bg-white smooth-shadow-ring-md shadow-[#0c1a3a] md:w-[min(70vw,600px)] lg:w-[640px]">
      <div className="relative">
        <VideoShell
          title={`${study.name}, ${study.company}`}
          video={study.video}
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

function getSlideStep(scroller: HTMLElement) {
  const slide = scroller.querySelector<HTMLElement>(".stories-cinema-slide");
  if (!slide) return Math.min(scroller.clientWidth * 0.85, 640);
  const styles = getComputedStyle(scroller);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  return slide.offsetWidth + gap;
}

function snapToNearestSlide(scroller: HTMLElement) {
  const slides = scroller.querySelectorAll<HTMLElement>(".stories-cinema-slide");
  if (!slides.length) return;

  const scrollPadding = Number.parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
  const viewportCenter = scroller.scrollLeft + scrollPadding + (scroller.clientWidth - scrollPadding * 2) / 2;

  let best = slides[0];
  let bestDist = Infinity;
  for (const slide of slides) {
    const center = slide.offsetLeft + slide.offsetWidth / 2;
    const dist = Math.abs(center - viewportCenter);
    if (dist < bestDist) {
      bestDist = dist;
      best = slide;
    }
  }

  const target =
    best.offsetLeft - (scroller.clientWidth - best.offsetWidth) / 2;
  const maxScroll = scroller.scrollWidth - scroller.clientWidth;
  scroller.scrollTo({
    left: Math.max(0, Math.min(target, maxScroll)),
    behavior: "smooth",
  });
}

export function CinemaStories() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const momentumRef = useRef<number | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    scrollLeft: 0,
    pointerId: -1,
  });

  const stopMomentum = useCallback(() => {
    if (momentumRef.current != null) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const startMomentum = useCallback(
    (scroller: HTMLElement, velocityPxPerMs: number) => {
      stopMomentum();
      let velocity = velocityPxPerMs;
      let lastTime = performance.now();

      const step = (now: number) => {
        const dt = Math.min(now - lastTime, 32);
        lastTime = now;

        if (Math.abs(velocity) < VELOCITY_MIN) {
          scroller.classList.remove("is-dragging");
          snapToNearestSlide(scroller);
          momentumRef.current = null;
          return;
        }

        scroller.scrollLeft -= velocity * dt;
        velocity *= Math.exp(-FRICTION_PER_MS * dt);

        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        if (scroller.scrollLeft <= 0 || scroller.scrollLeft >= maxScroll) {
          scroller.scrollLeft = Math.max(0, Math.min(scroller.scrollLeft, maxScroll));
          scroller.classList.remove("is-dragging");
          snapToNearestSlide(scroller);
          momentumRef.current = null;
          return;
        }

        momentumRef.current = requestAnimationFrame(step);
      };

      momentumRef.current = requestAnimationFrame(step);
    },
    [stopMomentum],
  );

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    stopMomentum();
    el.classList.remove("is-dragging");
    el.scrollBy({ left: dir * getSlideStep(el), behavior: "smooth" });
  }, [stopMomentum]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Touch already has native momentum scrolling.
    if (event.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;

    stopMomentum();
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
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

    const now = performance.now();
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return;

    if (!drag.moved) {
      drag.moved = true;
      el.classList.add("is-dragging");
    }

    const dt = Math.max(now - drag.lastTime, 1);
    const frameDx = event.clientX - drag.lastX;
    // Low-pass the velocity so one noisy sample doesn't dominate the fling.
    const sample = frameDx / dt;
    drag.velocity = drag.velocity * 0.6 + sample * 0.4;
    drag.lastX = event.clientX;
    drag.lastTime = now;

    event.preventDefault();
    el.scrollLeft = drag.scrollLeft - dx;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const el = scrollerRef.current;

    drag.active = false;
    drag.pointerId = -1;

    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    if (!el || !drag.moved) {
      el?.classList.remove("is-dragging");
      return;
    }

    // Decay stale samples if the pointer paused before release.
    const idle = performance.now() - drag.lastTime;
    const velocity = idle > 80 ? 0 : drag.velocity;

    if (Math.abs(velocity) >= VELOCITY_MIN) {
      startMomentum(el, velocity);
    } else {
      el.classList.remove("is-dragging");
      snapToNearestSlide(el);
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
    return () => {
      el.removeEventListener("click", onClickCapture, true);
      stopMomentum();
    };
  }, [stopMomentum]);

  return (
    <section
      id="kunden"
      className="flex w-full flex-col gap-10 py-10 md:gap-14 md:py-14"
    >
      <div className="flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
        <StoriesHeader />
        <Reveal soft delay={0.12} className="hidden shrink-0 gap-2 md:flex">
          <ScrollButton direction="prev" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="next" onClick={() => scrollBy(1)} />
        </Reveal>
      </div>

      {/*
        Break out of the page gutter so cards can scroll edge-to-edge.
        Slide wrappers hold shadow gutters — overflow-x:auto otherwise
        swallows box-shadow on both axes.
      */}
      <div className="stories-cinema-bleed">
        <Reveal soft delay={0.1}>
          <div
            ref={scrollerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="stories-cinema-track flex cursor-grab snap-x snap-mandatory gap-5 [scrollbar-width:none] md:gap-6 lg:gap-7 [&::-webkit-scrollbar]:hidden"
          >
            {CASE_STUDIES.map((study, index) => (
              <div
                key={study.slug}
                className="stories-cinema-slide shrink-0 snap-center"
              >
                <CinemaCard study={study} seed={index * 2.7} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
