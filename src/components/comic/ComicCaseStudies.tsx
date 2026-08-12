"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

import { films, type Film } from "@/components/portfolio/data";
import {
  type VimeoVideo,
  vimeoPosterSrc,
} from "@/components/VimeoEmbed";

/** Featured portfolio Erklärfilme — first three for the sticky reel. */
const featured = films
  .filter((f) => f.featured)
  .slice(0, 3)
  .map((film) => ({
    film,
    company: film.client,
    body: `Für ${film.client} haben wir einen Erklärfilm gemacht, der das Angebot innerhalb weniger Sekunden an alle relevanten Stakeholder kommuniziert.`,
  }));

const reelEase = "cubic-bezier(0.75, 0, 0.85, 1)";
const reelDuration = "420ms";

/**
 * Paper row, sticky + reel:
 * left copy (title / body / CTA) + right video stay in the Paper layout;
 * only the content reels on scroll.
 */
export function ComicCaseStudies() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileRefs = useRef<(HTMLElement | null)[]>([]);

  // Desktop: map scroll progress through the pin track → reel index.
  // The last segment is weighted heavier so reel 3 dwells before unpin.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const count = featured.length;
    // One unit per reel advance, plus extra dwell on the final reel.
    const dwellUnits = 1.35;
    const totalUnits = count - 1 + dwellUnits;

    const updateFromScroll = () => {
      if (!mql.matches) return;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const next = Math.min(
        count - 1,
        Math.floor(progress * totalUnits),
      );
      setActive((prev) => (prev === next ? prev : next));
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    mql.addEventListener("change", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      mql.removeEventListener("change", updateFromScroll);
    };
  }, []);

  // Mobile: stacked rows still use IntersectionObserver.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const ratios = new Map<Element, number>();
    let io: IntersectionObserver | null = null;

    const bind = () => {
      io?.disconnect();
      ratios.clear();
      if (mql.matches) return;

      const nodes = mobileRefs.current.filter(Boolean) as HTMLElement[];
      if (nodes.length === 0) return;

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target, entry.intersectionRatio);
          }
          let bestIndex = 0;
          let bestRatio = -1;
          nodes.forEach((node, index) => {
            const ratio = ratios.get(node) ?? 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestIndex = index;
            }
          });
          setActive((prev) => (prev === bestIndex ? prev : bestIndex));
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: "-12% 0px -20% 0px",
        },
      );

      nodes.forEach((node) => io!.observe(node));
    };

    bind();
    mql.addEventListener("change", bind);
    return () => {
      mql.removeEventListener("change", bind);
      io?.disconnect();
    };
  }, []);

  const attachMobile = (index: number) => (node: HTMLElement | null) => {
    mobileRefs.current[index] = node;
  };

  return (
    <section id="kunden" className="comic-koto">
      <div className="comic-shell">
        {/*
          Desktop pin model:
          - No section padding above the track → sticky engages as soon as
            the section top hits the viewport top.
          - Sticky panel is full viewport height so the row sits with balanced
            breathing room (no huge empty band under the video).
          - Track height = advance steps + dwell so the last reel stays put
            for a beat before the page unpins.
        */}
        <div ref={trackRef} className="relative hidden lg:block">
          <div className="flex flex-col" aria-hidden>
            {/* One viewport-ish step per reel advance */}
            {featured.slice(0, -1).map((item) => (
              <div
                key={`step-${item.film.id}`}
                className="h-[min(70svh,38rem)] w-full"
              />
            ))}
            {/* Final reel + dwell (longer than a single step) */}
            <div className="h-[min(155svh,82rem)] w-full" />
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="sticky top-0 flex min-h-[100svh] items-center py-[clamp(2.5rem,5vw,4.5rem)]">
              <div className="pointer-events-auto flex w-full items-stretch gap-6">
                {/* Left — Paper flex basis 561, Fallstudie link at video bottom */}
                <div className="flex min-h-0 min-w-0 flex-[561] flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <ReelSlot
                      active={active}
                      reduceMotion={!!reduceMotion}
                      className="h-[4.8rem]"
                    >
                      {featured.map((item) => (
                        <h2
                          key={item.film.id}
                          className="w-max text-[clamp(2.5rem,4.2vw,4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[var(--comic-ink)]"
                        >
                          {item.company}
                        </h2>
                      ))}
                    </ReelSlot>

                    <ReelSlot
                      active={active}
                      reduceMotion={!!reduceMotion}
                      className="min-h-[9.75rem]"
                    >
                      {featured.map((item) => (
                        <p
                          key={item.film.id}
                          className="max-w-[34ch] text-[clamp(1.25rem,2.1vw,2rem)] font-medium leading-[1.2] tracking-[-0.05em] text-[var(--comic-ink)] text-pretty"
                        >
                          {item.body}
                        </p>
                      ))}
                    </ReelSlot>
                  </div>

                  <FilmStudyLink className="text-[clamp(1.25rem,2.1vw,2rem)]" />
                </div>

                {/* Right — Paper 831×486 ratio */}
                <div className="comic-koto-stage relative aspect-[831/486] min-w-0 flex-[831] overflow-hidden rounded-[12px] bg-[var(--comic-ink)]">
                  {featured.map((item, index) => {
                    const offset = index - active;
                    const isActive = index === active;
                    const style: CSSProperties = reduceMotion
                      ? {
                          opacity: isActive ? 1 : 0,
                          pointerEvents: isActive ? "auto" : "none",
                        }
                      : {
                          transform: `translateY(${offset * 18}%)`,
                          opacity: isActive ? 1 : 0,
                          pointerEvents: isActive ? "auto" : "none",
                          transition: `transform ${reelDuration} ${reelEase}, opacity ${reelDuration} ${reelEase}`,
                        };

                    return (
                      <div
                        key={item.film.id}
                        className="absolute inset-0"
                        style={style}
                        aria-hidden={!isActive}
                      >
                        <KotoVideo
                          film={item.film}
                          company={item.company}
                          active={isActive}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: stacked Paper rows */}
        <div className="flex flex-col gap-16 py-[clamp(4rem,8vw,7.5rem)] lg:hidden">
          {featured.map((item, index) => (
            <div
              key={item.film.id}
              ref={attachMobile(index)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-[clamp(2rem,8vw,3rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[var(--comic-ink)]">
                  {item.company}
                </h2>
                <p className="text-[clamp(1.15rem,4.2vw,1.5rem)] font-medium leading-[1.25] tracking-[-0.05em] text-[var(--comic-ink)] text-pretty">
                  {item.body}
                </p>
                <FilmStudyLink className="text-[clamp(1.15rem,4.2vw,1.5rem)]" />
              </div>
              <div className="comic-koto-stage relative aspect-[831/486] w-full overflow-hidden rounded-[12px] bg-[var(--comic-ink)]">
                <KotoVideo
                  film={item.film}
                  company={item.company}
                  active={index === active}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fixed-height slot: layers share one place; active reels up, next rises into view. */
function ReelSlot({
  active,
  reduceMotion,
  className,
  children,
}: {
  active: number;
  reduceMotion: boolean;
  className?: string;
  children: ReactNode;
}) {
  const layers = Children.toArray(children);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {layers.map((child, index) => {
        const offset = index - active;
        const isActive = index === active;
        const style: CSSProperties = reduceMotion
          ? {
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }
          : {
              transform: `translateY(${offset * 100}%)`,
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
              transition: `transform ${reelDuration} ${reelEase}, opacity ${reelDuration} ${reelEase}`,
            };

        return (
          <div
            key={index}
            className="absolute inset-x-0 top-0"
            style={style}
            aria-hidden={!isActive}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

function FilmStudyLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="#portfolio"
      className={`group/link inline-flex items-center gap-2.5 font-bold leading-[1.2] tracking-[-0.04em] text-[var(--comic-purple)] transition-[opacity,transform] duration-200 ease-out hover:opacity-70 active:scale-[0.96] ${className}`}
    >
      Zur Fallstudie
      <svg
        viewBox="0 0 18 12"
        width="18"
        height="12"
        aria-hidden
        className="shrink-0 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
      >
        <path
          d="M0 6H18M18 6L12 12M18 6L12 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

function KotoVideo({
  film,
  company,
  active,
}: {
  film: Film;
  company: string;
  active: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--comic-ink)]">
      <AutoplayVimeo
        video={film.video}
        title={`${company} Erklärfilm`}
        active={active}
      />
    </div>
  );
}

/** Muted looping Vimeo embed, mounted only near viewport. */
function AutoplayVimeo({
  video,
  title,
  active,
}: {
  video: VimeoVideo;
  title: string;
  active: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let leaveTimer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible =
          Boolean(entry?.isIntersecting) &&
          (entry?.intersectionRatio ?? 0) > 0 &&
          host.getClientRects().length > 0;
        if (visible) {
          if (leaveTimer) {
            window.clearTimeout(leaveTimer);
            leaveTimer = 0;
          }
          setNear(true);
        } else {
          leaveTimer = window.setTimeout(() => {
            setNear(false);
            leaveTimer = 0;
          }, 700);
        }
      },
      { rootMargin: "160px 0px", threshold: [0, 0.05] },
    );
    io.observe(host);
    return () => {
      io.disconnect();
      if (leaveTimer) window.clearTimeout(leaveTimer);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const host = hostRef.current;
    if (host && host.getClientRects().length > 0) setNear(true);
  }, [active]);

  const params = new URLSearchParams({
    background: "1",
    autoplay: "1",
    muted: "1",
    loop: "1",
    autopause: "0",
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });
  if (video.hash) params.set("h", video.hash);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={vimeoPosterSrc(video)}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          near ? "opacity-0" : "opacity-100"
        }`}
      />
      {near ? (
        <iframe
          src={`https://player.vimeo.com/video/${video.id}?${params.toString()}`}
          title={title}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
            active ? "opacity-100" : "opacity-90"
          }`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
    </div>
  );
}
