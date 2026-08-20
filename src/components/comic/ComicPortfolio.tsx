"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";
import { FilmExpand, WallPoster } from "@/components/portfolio/FilmExpand";
import {
  type FilterGroup,
  type FilterState,
  emptyFilters,
  filterFilms,
  filterGroups,
  filterValue,
  setFilter,
  type Film,
} from "@/components/portfolio/data";

const PAGE_SIZE = 12;

export function ComicPortfolio() {
  const [active, setActive] = useState<FilterState>(emptyFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const results = useMemo(() => filterFilms(active), [active]);
  const visible = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;
  const selected =
    results.find((f) => f.id === selectedId) ??
    filterFilms(emptyFilters).find((f) => f.id === selectedId) ??
    null;

  const onChange = (group: FilterGroup, value: string | null) => {
    setActive((prev) => setFilter(prev, group, value));
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = () => {
    setActive(emptyFilters);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <LayoutGroup>
      <section id="portfolio" className="py-[clamp(4rem,8vw,7.5rem)]">
        <div className="comic-shell flex flex-col items-center gap-12 md:gap-16">
          <ComicSectionIntro
            title="Entdecke unsere Filme"
            lead="Über 200 Unternehmen setzen unsere Filme ein. Von Finanzindustrie bis Solarwirtschaft."
          />

          <div className="comic-portfolio-filters" role="group" aria-label="Portfolio-Filter">
            {(Object.keys(filterGroups) as FilterGroup[]).map((group) => {
              const value = filterValue(active, group);
              return (
                <label key={group} className="comic-chip" data-active={!!value}>
                  <span className="comic-chip__label">{group}</span>
                  <span className="comic-chip__value">
                    {value ?? "Alle"}
                  </span>
                  <span className="comic-chip__chevron" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 5.25 7 9.25 11 5.25"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <select
                    className="comic-chip__select"
                    value={value ?? ""}
                    onChange={(e) =>
                      onChange(group, e.target.value === "" ? null : e.target.value)
                    }
                    aria-label={group}
                  >
                    <option value="">Alle</option>
                    {filterGroups[group].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
            {active ? (
              <button
                type="button"
                className="comic-chip"
                onClick={resetFilters}
              >
                Zurücksetzen
              </button>
            ) : null}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-xl font-bold tracking-[-0.02em]">
                Keine Filme für diesen Filter
              </p>
              <button
                type="button"
                className="font-semibold text-[var(--comic-purple)] underline-offset-4 hover:underline"
                onClick={resetFilters}
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-8">
              <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-7">
                {visible.map((film) => (
                  <ComicFilmTile
                    key={film.id}
                    film={film}
                    reduceMotion={!!reduceMotion}
                    hidden={selectedId === film.id}
                    onOpen={() => setSelectedId(film.id)}
                  />
                ))}
              </div>
              {hasMore ? (
                <button
                  type="button"
                  className="comic-portfolio-more"
                  onClick={() =>
                    setVisibleCount((count) => count + PAGE_SIZE)
                  }
                >
                  Mehr Filme laden
                </button>
              ) : null}
            </div>
          )}

          <ComicCta className="!mt-0" />
        </div>

        <FilmExpand
          film={selected}
          onClose={() => setSelectedId(null)}
          variant="comic"
        />
      </section>
    </LayoutGroup>
  );
}

function ComicFilmTile({
  film,
  reduceMotion,
  hidden,
  onOpen,
}: {
  film: Film;
  reduceMotion: boolean;
  hidden: boolean;
  onOpen: () => void;
}) {
  if (hidden) {
    return <div className="aspect-[16/10] rounded-[12px] bg-[var(--comic-ink)]/5" aria-hidden />;
  }

  return (
    <motion.button
      type="button"
      layoutId={`film-card-${film.id}`}
      onClick={onOpen}
      aria-label={`${film.client} öffnen`}
      className="comic-portfolio-tile group aspect-[16/10] w-full text-left"
      whileHover={
        reduceMotion
          ? undefined
          : { scale: 1.02, transition: { duration: 0.25 } }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
    >
      <motion.div
        layoutId={`film-media-${film.id}`}
        className="absolute inset-0"
        transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.28, bounce: 0 }}
      >
        <WallPoster
          film={film}
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--comic-ink)]/90 via-[var(--comic-ink)]/45 to-transparent p-4 pt-16 md:p-5">
        <h3 className="text-[clamp(1.05rem,1.8vw,1.45rem)] font-bold leading-tight tracking-[-0.02em] text-white">
          {film.client}
        </h3>
      </div>
    </motion.button>
  );
}
