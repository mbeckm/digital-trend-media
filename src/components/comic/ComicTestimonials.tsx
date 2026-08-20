"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";
import { CaseStudyLink } from "@/components/stories/CaseStudyLink";
import { CASE_STUDIES, type CaseStudy } from "@/components/stories/data";

const accents = ["#604BB8", "#FF52E3", "#0099FF"] as const;
const tilts = [2.39, -2.58, 2.39, -1.8, 2.1, -2.4] as const;
const portraits = [
  "/images/testimonials/portrait-1.jpg",
  "/images/testimonials/portrait-2.jpg",
  "/images/testimonials/portrait-3.jpg",
  "/images/testimonials/portrait-4.jpg",
  "/images/testimonials/office-1.jpg",
  "/images/testimonials/office-2.jpg",
] as const;

const DRAG_THRESHOLD = 6;
const VELOCITY_MIN = 0.05;
const FRICTION_PER_MS = 0.0032;

export function ComicTestimonials() {
  return (
    <section className="overflow-x-clip bg-[var(--comic-white)] py-[clamp(4rem,8vw,7.5rem)]">
      <div className="comic-shell flex flex-col items-center gap-12 md:gap-16">
        <ComicSectionIntro
          title="Das sagen unsere Kunden"
          lead="Unsere Kunden erzählen von ihren Erfahrungen mit den Erklärfilmen von Digital Trend Media."
        />
      </div>

      <TestimonialCarousel />

      <div className="comic-shell mt-12 flex flex-col items-center md:mt-16">
        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}

function TestimonialCard({
  study,
  index,
}: {
  study: CaseStudy;
  index: number;
}) {
  const accent = accents[index % accents.length]!;
  const poster = portraits[index % portraits.length]!;

  return (
    <article
      className="comic-panel comic-testimonial-card"
      style={{ borderWidth: "5px 12px 15px 5px" }}
    >
      <div className="comic-testimonial-card__media">
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover contrast-[1.15] outline outline-1 -outline-offset-1 outline-black/10"
          sizes="(max-width: 767px) 86vw, 28rem"
        />
      </div>

      <div className="comic-testimonial-card__body">
        <div
          className="inline-flex w-fit flex-col gap-2.5 rounded-lg bg-white px-5 py-3 md:px-6 md:py-4"
          style={{
            borderStyle: "solid",
            borderColor: accent,
            borderWidth: "2px 4px 8px 2px",
            rotate: `${tilts[index % tilts.length]}deg`,
          }}
        >
          <p
            className="comic-display text-[clamp(1.85rem,3vw,2.5rem)] leading-none tabular-nums"
            style={{ color: accent }}
          >
            {study.metric}
          </p>
          <p className="text-base font-bold leading-snug text-[var(--comic-ink)] md:text-lg">
            {study.metricLabel}
          </p>
        </div>

        <blockquote className="text-pretty text-[clamp(1.2rem,2vw,1.85rem)] font-bold leading-[1.28] tracking-[-0.03em] text-[var(--comic-ink)]">
          <span
            aria-hidden
            className="comic-display mr-1 align-[-0.18em] text-[1.35em] leading-none"
            style={{ color: accent }}
          >
            „
          </span>
          {study.quote}“
        </blockquote>

        <div className="mt-auto flex flex-col gap-4 border-t-[3px] border-[var(--comic-ink)] pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <p className="text-lg font-bold leading-snug">{study.name}</p>
            <p className="text-base leading-snug text-[var(--comic-muted)]">
              {study.role}
            </p>
            <p className="text-base leading-snug text-[var(--comic-muted)]">
              {study.company}
            </p>
          </div>
          <CaseStudyLink
            slug={study.slug}
            className="shrink-0 !text-base !font-bold !leading-snug !text-[var(--comic-purple)]"
          >
            Zur Case Study
          </CaseStudyLink>
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
  const label = direction === "prev" ? "Vorherige Stimme" : "Nächste Stimme";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`comic-testimonial-nav comic-testimonial-nav--${direction}`}
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
  const slide = scroller.querySelector<HTMLElement>(".comic-testimonial-slide");
  if (!slide) return scroller.clientWidth * 0.88;
  const styles = getComputedStyle(scroller);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  return slide.offsetWidth + gap;
}

function snapToNearestSlide(scroller: HTMLElement) {
  const slides = scroller.querySelectorAll<HTMLElement>(
    ".comic-testimonial-slide",
  );
  if (!slides.length) return;

  const padding =
    Number.parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
  const marker = scroller.scrollLeft + padding;

  let best = slides[0];
  let bestDist = Infinity;
  for (const slide of slides) {
    const dist = Math.abs(slide.offsetLeft - marker);
    if (dist < bestDist) {
      bestDist = dist;
      best = slide;
    }
  }

  const maxScroll = scroller.scrollWidth - scroller.clientWidth;
  scroller.scrollTo({
    left: Math.max(0, Math.min(best.offsetLeft - padding, maxScroll)),
    behavior: "smooth",
  });
}

function TestimonialCarousel() {
  const reduceMotion = useReducedMotion();
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
          scroller.scrollLeft = Math.max(
            0,
            Math.min(scroller.scrollLeft, maxScroll),
          );
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

  const scrollBy = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el) return;
      stopMomentum();
      el.classList.remove("is-dragging");
      const step = getSlideStep(el);
      const max = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft + dir * step;
      if (next > max + 12) next = 0;
      else if (next < -12) next = max;
      el.scrollTo({
        left: Math.max(0, Math.min(next, max)),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion, stopMomentum],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
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
    const sample = (event.clientX - drag.lastX) / dt;
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

    const idle = performance.now() - drag.lastTime;
    const velocity = idle > 80 ? 0 : drag.velocity;

    if (Math.abs(velocity) >= VELOCITY_MIN) {
      startMomentum(el, velocity);
    } else {
      el.classList.remove("is-dragging");
      snapToNearestSlide(el);
    }
  };

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
    <div className="comic-testimonial-carousel mt-12 md:mt-16">
      <div className="comic-testimonial-bleed">
        <div
          ref={scrollerRef}
          role="region"
          aria-roledescription="Karussell"
          aria-label="Kundenstimmen"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="comic-testimonial-track cursor-grab"
        >
          {CASE_STUDIES.map((study, index) => (
            <div
              key={study.slug}
              className="comic-testimonial-slide"
            >
              <TestimonialCard study={study} index={index} />
            </div>
          ))}
        </div>
      </div>

      <div className="comic-testimonial-navs">
        <ScrollButton direction="prev" onClick={() => scrollBy(-1)} />
        <ScrollButton direction="next" onClick={() => scrollBy(1)} />
      </div>
    </div>
  );
}
