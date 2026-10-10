"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";
import { CaseStudyLink } from "@/components/stories/CaseStudyLink";
import { CASE_STUDIES, type CaseStudy } from "@/components/stories/data";
import { vimeoPosterSrc } from "@/components/VimeoEmbed";

const portraits = [
  "/images/testimonials/office-1.jpg",
  "/images/testimonials/office-2.jpg",
  "/images/testimonials/office-3.jpg",
] as const;

const studies = CASE_STUDIES.slice(0, 3);

export function ComicTestimonials() {
  return (
    <section className="overflow-x-clip bg-[var(--comic-white)] py-[clamp(4rem,8vw,7.5rem)]">
      <div className="comic-shell flex flex-col items-center gap-12 md:gap-16">
        <ComicSectionIntro
          eyebrow="Kundenstimmen"
          title="Das sagen unsere Kunden"
          lead="Unsere Kunden erzählen von ihren Erfahrungen mit den Erklärfilmen von Digital Trend Media."
        />
      </div>

      {/* Large screens: centered editorial 3-up outside the shell so it can span wider */}
      <div className="mx-auto mt-12 hidden w-[min(calc(100vw-3rem),1800px)] grid-cols-3 gap-6 md:mt-16 lg:grid xl:gap-8 2xl:gap-9">
        {studies.map((study, index) => (
          <TestimonialCard
            key={study.slug}
            study={study}
            index={index}
            sizes="(min-width: 1024px) 38vw, 100vw"
          />
        ))}
      </div>

      <div className="comic-shell mt-12 flex flex-col items-center gap-12 md:mt-16 md:gap-16">
        {/* Smaller screens: infinite horizontal marquee, still manually scrollable */}
        <TestimonialMarquee className="lg:hidden" />

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}

function TestimonialCard({
  study,
  index,
  sizes,
  className = "",
}: {
  study: CaseStudy;
  index: number;
  sizes: string;
  className?: string;
}) {
  const poster =
    portraits[index % portraits.length] ?? vimeoPosterSrc(study.video);

  return (
    <article
      className={`comic-panel flex flex-col overflow-hidden pb-8 ${className}`.trim()}
    >
      <div className="relative h-[220px] md:h-[260px]">
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>

      <div className="flex flex-1 flex-col gap-6 px-6 pt-6 md:px-8 md:pt-8">
        <div
          className="flex items-baseline gap-3 border-b border-[var(--comic-line)] pb-5"
        >
          <p
            className="comic-display text-[clamp(2rem,3vw,2.75rem)] leading-none text-[var(--comic-purple)]"
          >
            {study.metric}
          </p>
          <p className="text-base font-medium leading-snug text-[var(--comic-muted)]">
            {study.metricLabel}
          </p>
        </div>

        <blockquote className="text-[clamp(1.125rem,1.5vw,1.375rem)] font-medium tracking-[-0.02em] leading-[1.4] text-[var(--comic-ink)] text-pretty">
          „{study.quote}“
        </blockquote>

        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          <div className="min-w-0">
            <p className="text-base font-semibold leading-snug">{study.name}</p>
            <p className="text-base leading-snug text-[var(--comic-muted)]">{study.company}</p>
          </div>
          <CaseStudyLink
            slug={study.slug}
            className="shrink-0 !text-base !font-semibold !leading-snug !text-[var(--comic-purple)]"
          >
            Zur Case Study
          </CaseStudyLink>
        </div>
      </div>
    </article>
  );
}

/**
 * Full-bleed horizontal track: auto-drifts infinitely, pauses on interaction,
 * and stays manually scrollable (touch / trackpad / drag).
 */
function TestimonialMarquee({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(0);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const pause = (resumeMs?: number) => {
    pausedRef.current = true;
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = 0;
    }
    if (reduceMotion || resumeMs == null) return;
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimer.current = 0;
    }, resumeMs);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let wrapping = false;

    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (half <= 0 || wrapping) return;
      // Seed sits exactly on `half`; only wrap once we cross it.
      if (el.scrollLeft > half) {
        wrapping = true;
        el.scrollLeft -= half;
        wrapping = false;
      } else if (el.scrollLeft <= 0) {
        wrapping = true;
        el.scrollLeft += half;
        wrapping = false;
      }
    };

    const seed = () => {
      const half = el.scrollWidth / 2;
      if (half > 0 && el.clientWidth > 0) {
        wrapping = true;
        el.scrollLeft = half;
        wrapping = false;
      }
    };

    el.addEventListener("scroll", wrap, { passive: true });

    const ro = new ResizeObserver(() => {
      // Becoming visible (display:none → block) or width change: re-seed.
      if (el.clientWidth > 0 && el.scrollLeft === 0) seed();
    });
    ro.observe(el);
    seed();

    return () => {
      el.removeEventListener("scroll", wrap);
      ro.disconnect();
    };
  }, []);

  // Gentle auto-drift; paused while interacting or when reduced motion is on.
  useEffect(() => {
    if (reduceMotion) return;
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();
    let carry = 0;
    const speed = 32; // px / second

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Skip while the track is display:none (desktop breakpoint).
      if (el.clientWidth > 0 && !pausedRef.current && !dragRef.current) {
        carry += speed * dt;
        if (carry >= 1) {
          const step = Math.floor(carry);
          carry -= step;
          el.scrollLeft += step;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Touch/pen: native scroll + pause auto-drift. Mouse: drag-to-scroll.
    if (event.pointerType !== "mouse" || event.button !== 0) {
      pause();
      return;
    }
    const el = scrollerRef.current;
    if (!el) return;
    pause();
    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      suppressClickRef.current = true;
      setDragging(true);
    }
    if (drag.moved) {
      el.scrollLeft = drag.startScroll - dx;
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const moved = drag.moved;
    dragRef.current = null;
    setDragging(false);
    try {
      scrollerRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    pause(moved ? 2400 : 1200);
  };

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const slides = (prefix: string, hidden: boolean) =>
    studies.map((study, index) => (
      <div
        key={`${prefix}-${study.slug}`}
        className="comic-testimonial-slide shrink-0"
        aria-hidden={hidden || undefined}
        {...(hidden ? { inert: true } : {})}
      >
        <TestimonialCard
          study={study}
          index={index}
          sizes="(max-width: 1023px) 84vw, 420px"
        />
      </div>
    ));

  return (
    <div
      className={`comic-testimonial-bleed relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 ${className}`.trim()}
    >
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Kundenstimmen"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onWheel={() => pause(1800)}
        onTouchStart={() => pause()}
        onTouchEnd={() => pause(2200)}
        className={`comic-testimonial-track ${
          dragging ? "is-dragging cursor-grabbing" : "cursor-grab"
        }`}
      >
        {slides("a", false)}
        {slides("b", true)}
      </div>
    </div>
  );
}
