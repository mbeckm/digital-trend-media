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
  type Film,
} from "@/components/portfolio/data";

export function ComicPortfolio() {
  const [active, setActive] = useState<FilterState>(emptyFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const results = useMemo(() => filterFilms(active), [active]);
  const selected =
    results.find((f) => f.id === selectedId) ??
    filterFilms(emptyFilters).find((f) => f.id === selectedId) ??
    null;

  const onChange = (group: FilterGroup, value: string | null) => {
    setActive((prev) => ({ ...prev, [group]: value }));
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
            {(Object.keys(filterGroups) as FilterGroup[]).map((group) => (
              <label key={group} className="comic-chip" data-active={!!active[group]}>
                <span className="opacity-60">{group}</span>
                <select
                  value={active[group] ?? ""}
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
            ))}
            {Object.values(active).some(Boolean) ? (
              <button
                type="button"
                className="comic-chip"
                onClick={() => setActive(emptyFilters)}
              >
                Zurücksetzen
              </button>
            ) : null}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-xl font-bold tracking-[-0.02em]">
                Keine Filme für diese Kombination
              </p>
              <button
                type="button"
                className="font-semibold text-[var(--comic-purple)] underline-offset-4 hover:underline"
                onClick={() => setActive(emptyFilters)}
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-7">
              {results.slice(0, 12).map((film) => (
                <ComicFilmTile
                  key={film.id}
                  film={film}
                  reduceMotion={!!reduceMotion}
                  hidden={selectedId === film.id}
                  onOpen={() => setSelectedId(film.id)}
                />
              ))}
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
    return <div className="aspect-[16/10] rounded-[12px] bg-black/5" aria-hidden />;
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
        transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0 }}
      >
        <WallPoster
          film={film}
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 pt-16 md:p-5">
        <h3 className="text-[clamp(1.05rem,1.8vw,1.45rem)] font-bold leading-tight tracking-[-0.02em] text-white">
          {film.client}
        </h3>
      </div>
    </motion.button>
  );
}
