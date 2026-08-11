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

const accents = ["#604BB8", "#FF52E3", "#0099FF"] as const;
const tilts = [2.39, -2.58, 2.39] as const;
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
          title="Das sagen unsere Kunden"
          lead="Unsere Kunden erzählen von ihren Erfahrungen mit den Erklärfilmen von Digital Trend Media."
        />

        {/* Large screens: wider 3-up grid that breathes past the shell gutters */}
        <div className="hidden w-[calc(100%+2*var(--comic-gutter))] max-w-none -mx-[var(--comic-gutter)] grid-cols-3 gap-6 lg:grid xl:gap-7 2xl:gap-8">
          {studies.map((study, index) => (
            <TestimonialCard
              key={study.slug}
              study={study}
              index={index}
              sizes="(min-width: 1024px) 32vw, 100vw"
            />
          ))}
        </div>

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
  const accent = accents[index % accents.length]!;
  const poster =
    portraits[index % portraits.length] ?? vimeoPosterSrc(study.video);

  return (
    <article
      className={`comic-panel flex flex-col overflow-hidden pb-6 ${className}`.trim()}
      style={{ borderWidth: "5px 12px 15px 5px" }}
    >
      <div className="relative h-[220px] border-b-[5px] border-black md:h-[260px]">
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover contrast-[1.15]"
          sizes={sizes}
        />
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 pt-5">
        <div
          className="inline-flex w-fit flex-col rounded-lg bg-white px-4 py-2"
          style={{
            borderStyle: "solid",
            borderColor: accent,
            borderWidth: "2px 4px 8px 2px",
            rotate: `${tilts[index % tilts.length]}deg`,
          }}
        >
          <p
            className="comic-display text-[clamp(1.75rem,2.5vw,2.25rem)] leading-none"
            style={{ color: accent }}
          >
            {study.metric}
          </p>
          <p className="text-sm font-bold leading-5 text-[var(--comic-ink)]">
            {study.metricLabel}
          </p>
        </div>

        <blockquote className="text-[clamp(1.15rem,1.8vw,1.75rem)] font-bold tracking-[-0.03em] leading-[1.25] text-[var(--comic-ink)] text-pretty">
          „{study.quote}“
        </blockquote>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="min-w-0">
            <p className="text-sm font-medium leading-5">{study.name}</p>
            <p className="text-sm leading-5">
              {study.role} · {study.company}
            </p>
          </div>
          <CaseStudyLink
            slug={study.slug}
            className="shrink-0 !text-sm !font-bold !text-[var(--comic-purple)]"
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
          sizes="(max-width: 1023px) 78vw, 360px"
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
