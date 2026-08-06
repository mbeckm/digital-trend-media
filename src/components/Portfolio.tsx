"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";
import { FilterDockPill } from "@/components/portfolio/FilterDropdowns";
import { FilmExpand, WallPoster } from "@/components/portfolio/FilmExpand";
import {
  type FilterGroup,
  type FilterState,
  emptyFilters,
  filterFilms,
  type Film,
} from "@/components/portfolio/data";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionDek } from "@/components/SectionDek";

const spring = { type: "spring" as const, duration: 0.45, bounce: 0 };

const hoverIn = {
  type: "tween" as const,
  duration: 0.3,
  ease: [0.22, 1.45, 0.36, 1] as const,
};

const hoverOut = {
  type: "tween" as const,
  duration: 0.12,
  ease: [0.4, 0, 1, 1] as const,
};

/** Higher = more wheel travel to scrub through the wall. */
const SCROLL_SLOWDOWN = 2.4;

export function Portfolio() {
  const [active, setActive] = useState<FilterState>(emptyFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ overflow: 0, viewH: 0 });
  const [sectionInView, setSectionInView] = useState(false);
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => filterFilms(active), [active]);
  const selected =
    filmsById(results, selectedId) ??
    filmsById(filterFilms(emptyFilters), selectedId);

  const pinScroll =
    !reduceMotion && metrics.overflow > 8 && metrics.viewH > 0;
  const showFilterDock = sectionInView && !selected;

  const onChange = (group: FilterGroup, value: string | null) => {
    setActive((prev) => ({ ...prev, [group]: value }));
  };

  const onReset = () => setActive(emptyFilters);
  const onClose = useCallback(() => setSelectedId(null), []);

  const onSkipToEnd = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const top =
      section.getBoundingClientRect().bottom +
      window.scrollY -
      Math.min(72, window.innerHeight * 0.08);
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  const measure = useCallback(() => {
    const wall = wallRef.current;
    if (!wall) return;

    const viewH = window.innerHeight || 0;
    const wallH = wall.offsetHeight;
    const overflow = reduceMotion ? 0 : Math.max(0, wallH - viewH);

    setMetrics((prev) => {
      if (
        Math.abs(prev.overflow - overflow) < 2 &&
        Math.abs(prev.viewH - viewH) < 2
      ) {
        return prev;
      }
      return { overflow, viewH };
    });
  }, [reduceMotion]);

  useLayoutEffect(() => {
    measure();
    const wall = wallRef.current;
    if (!wall) return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(wall);
    window.addEventListener("resize", measure);
    const t1 = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 300);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [measure, results.length]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let frame = 0;
    const update = () => {
      const rect = shell.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const visible = Math.max(
        0,
        Math.min(vh, rect.bottom) - Math.max(0, rect.top),
      );
      const coverage = visible / vh;

      // Dock tracks the wall shell, not the editorial heading above it.
      const deepEnough = rect.bottom > vh * 0.88;
      const entered = rect.top < vh * 0.42;
      const next = coverage >= 0.55 && deepEnough && entered;

      setSectionInView((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    if (reduceMotion) {
      shell.style.setProperty("--pw-p", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      const rect = shell.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.9;
      const end = vh * 0.05;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      shell.style.setProperty("--pw-p", p.toFixed(4));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const wallY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -metrics.overflow],
  );

  const trackHeight = pinScroll
    ? metrics.viewH + metrics.overflow * SCROLL_SLOWDOWN
    : undefined;

  return (
    <LayoutGroup>
      <section
        id="portfolio"
        ref={sectionRef}
        className="relative isolate w-full text-black"
      >
        {/* Editorial intro — normal page flow, outside the wall experience. */}
        <div className="mx-auto flex w-full max-w-[1280px] flex-col px-6 pb-10 pt-4 md:px-10 md:pb-12 lg:px-12 lg:pb-14">
          <RevealGroup className="flex max-w-[44rem] flex-col gap-5 md:gap-6">
            <RevealItem
              as="h2"
              className="font-[family-name:var(--font-inter-tight)] text-[clamp(3rem,6.5vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.035em] text-black"
            >
              Von Hä? zu Aha!
            </RevealItem>
            <RevealItem soft>
              <SectionDek
                tone="light"
                lead="Über 100 Filme. Für Unternehmen aus ganz unterschiedlichen Branchen."
                rest="Von Fintech bis Industrie, von Onboarding bis Pitch. Jedes Projekt eine eigene Geschichte."
              />
            </RevealItem>
          </RevealGroup>
        </div>

        {/* Immersive wall only: sky, expand shell, tiles, scrub. */}
        <div
          ref={shellRef}
          className="portfolio-shell relative"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          <CloudsVolumetric className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]" />

          <div
            ref={trackRef}
            className="relative z-10"
            style={trackHeight != null ? { height: trackHeight } : undefined}
          >
            <div
              className={
                pinScroll
                  ? "sticky top-0 h-svh overflow-clip pt-20 pb-8 md:pt-24 md:pb-10 lg:pt-28 lg:pb-12"
                  : "relative pt-16 pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12"
              }
              style={
                pinScroll
                  ? ({ overflowClipMargin: "20px" } as CSSProperties)
                  : undefined
              }
            >
              <motion.div
                ref={wallRef}
                style={pinScroll ? { y: wallY } : undefined}
                className="isolate grid w-full auto-rows-[minmax(160px,22vw)] grid-flow-dense grid-cols-2 gap-1.5 pb-28 will-change-transform sm:auto-rows-[minmax(180px,16vw)] sm:gap-2 sm:pb-32 md:grid-cols-4 lg:auto-rows-[minmax(200px,14vw)] lg:pb-36 xl:grid-cols-6"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {results.map((film, index) => {
                    const span = tileSpan(index, film.featured);
                    const isSelected = selectedId === film.id;

                    if (isSelected) {
                      return (
                        <div
                          key={film.id}
                          className={`${span} rounded-[10px] bg-black/[0.04]`}
                          aria-hidden
                        />
                      );
                    }

                    return (
                      <Tile
                        key={film.id}
                        film={film}
                        span={span}
                        index={index}
                        reduceMotion={!!reduceMotion}
                        onOpen={() => setSelectedId(film.id)}
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="relative z-10 flex flex-col items-center gap-3 px-6 py-24 text-center">
              <p className="font-[family-name:var(--font-inter-tight)] text-xl font-semibold text-black">
                Keine Filme für diese Kombination
              </p>
              <button
                type="button"
                onClick={onReset}
                className="text-[14px] font-semibold text-[var(--color-link)] underline-offset-4 hover:underline"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : null}
        </div>

        <FilterDockPill
          active={active}
          onChange={onChange}
          onReset={onReset}
          onSkipToEnd={onSkipToEnd}
          resultCount={results.length}
          visible={showFilterDock}
        />

        <FilmExpand film={selected} onClose={onClose} />
      </section>
    </LayoutGroup>
  );
}

function Tile({
  film,
  span,
  index,
  reduceMotion,
  onOpen,
}: {
  film: Film;
  span: string;
  index: number;
  reduceMotion: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      layoutId={`film-card-${film.id}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
        zIndex: 1,
      }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              layout: spring,
              opacity: {
                ...spring,
                delay: Math.min(index, 8) * 0.02,
              },
              scale: hoverOut,
              zIndex: { delay: 0, duration: 0 },
            }
      }
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.03,
              zIndex: 40,
              transition: hoverIn,
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : {
              scale: 0.985,
              transition: {
                type: "tween",
                duration: 0.1,
                ease: [0.4, 0, 0.2, 1],
              },
            }
      }
      onClick={onOpen}
      aria-label={`${film.client}: ${film.title} öffnen`}
      className={`portfolio-tile group relative isolate overflow-hidden rounded-[10px] bg-[oklch(0.14_0.03_258)] text-left smooth-shadow-ring-xs shadow-[#00142e] transition-[box-shadow] duration-300 ease-out hover:smooth-shadow-ring-md ${span}`}
    >
      <motion.div
        layoutId={`film-media-${film.id}`}
        className="absolute inset-0"
        transition={reduceMotion ? { duration: 0 } : spring}
      >
        <WallPoster
          film={film}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 pt-14 sm:p-4 md:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:text-[11px]">
          {film.client}
        </p>
        <h3 className="font-[family-name:var(--font-inter-tight)] text-[clamp(0.95rem,1.4vw,1.35rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
          {film.title}
        </h3>
      </div>
    </motion.button>
  );
}

function filmsById(list: Film[], id: string | null) {
  if (!id) return null;
  return list.find((film) => film.id === id) ?? null;
}

/**
 * Mix of hero / wide / tall / standard. Dense flow fills leftover cells
 * so row-span tiles don’t leave permanent holes.
 */
function tileSpan(index: number, featured?: boolean) {
  if (featured || index % 11 === 0) {
    return "col-span-2 row-span-2";
  }
  const slot = index % 8;
  if (slot === 2 || slot === 6) return "col-span-2";
  if (slot === 4) return "row-span-2";
  return "col-span-1";
}
