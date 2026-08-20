"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { films, type Film } from "@/components/portfolio/data";
import { VideoShell } from "@/components/stories/VideoShell";

/** Same three featured Erklärfilme as the previous sticky reel. */
const featured = films.filter((film) => film.featured).slice(0, 3);

const DRAG_THRESHOLD = 6;
const VELOCITY_MIN = 0.05;
const FRICTION_PER_MS = 0.0032;

function RefCard({ film }: { film: Film }) {
  return (
    <article
      className="comic-panel comic-refs-card"
      style={{ borderWidth: "5px 12px 15px 5px" }}
    >
      <div className="comic-refs-card__media">
        <VideoShell
          title={`${film.client} Erklärfilm`}
          video={film.video}
          sizes="(max-width: 768px) 90vw, 640px"
          className="aspect-video rounded-none outline-none"
          fade
        />
      </div>

      <div className="comic-refs-card__body">
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="comic-display text-[clamp(2rem,3.4vw,2.85rem)] leading-[1.02] text-[var(--comic-ink)]">
            {film.client}
          </h3>
          <p className="max-w-[32ch] text-pretty text-[clamp(1.05rem,1.7vw,1.35rem)] font-medium leading-[1.3] tracking-[-0.03em] text-[var(--comic-ink)]">
            {film.title}
          </p>
        </div>

        <a
          href="#portfolio"
          className="group/link mt-auto inline-flex items-center gap-2 pt-4 text-[clamp(1.05rem,1.6vw,1.25rem)] font-bold leading-snug tracking-[-0.03em] text-[var(--comic-purple)] transition-[opacity,transform] duration-200 ease-out hover:opacity-70 active:scale-[0.96]"
        >
          Zur Fallstudie
          <ArrowRight
            aria-hidden
            strokeWidth={2.5}
            className="size-[0.95em] shrink-0 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
          />
        </a>
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
  const label =
    direction === "prev" ? "Vorheriger Film" : "Nächster Film";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="comic-refs-nav"
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
  const slide = scroller.querySelector<HTMLElement>(".comic-refs-slide");
  if (!slide) return Math.min(scroller.clientWidth * 0.85, 640);
  const styles = getComputedStyle(scroller);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  return slide.offsetWidth + gap;
}

function snapToNearestSlide(scroller: HTMLElement) {
  const slides = scroller.querySelectorAll<HTMLElement>(".comic-refs-slide");
  if (!slides.length) return;

  const scrollPadding =
    Number.parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
  const viewportCenter =
    scroller.scrollLeft +
    scrollPadding +
    (scroller.clientWidth - scrollPadding * 2) / 2;

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

  const target = best.offsetLeft - (scroller.clientWidth - best.offsetWidth) / 2;
  const maxScroll = scroller.scrollWidth - scroller.clientWidth;
  scroller.scrollTo({
    left: Math.max(0, Math.min(target, maxScroll)),
    behavior: "smooth",
  });
}

export function ComicCaseStudies() {
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
      el.scrollBy({
        left: dir * getSlideStep(el),
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
    <section
      id="kunden"
      className="overflow-x-clip bg-[var(--comic-white)] py-[clamp(3.5rem,7vw,6.5rem)]"
    >
      <div className="comic-shell mb-8 flex items-end justify-between gap-6 md:mb-10">
        <h2 className="comic-display max-w-[16ch] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-balance text-[var(--comic-ink)]">
          Fallstudien
        </h2>
        <div className="hidden shrink-0 gap-2 md:flex">
          <ScrollButton direction="prev" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="next" onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div className="comic-refs-bleed">
        <div
          ref={scrollerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Referenzfilme"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="comic-refs-track cursor-grab"
        >
          {featured.map((film) => (
            <div key={film.id} className="comic-refs-slide">
              <RefCard film={film} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
