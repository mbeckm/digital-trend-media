import { ArrowRight } from "lucide-react";

import { ComicSectionIntro } from "@/components/comic/ComicUi";
import { films, type Film } from "@/components/portfolio/data";
import { VideoShell } from "@/components/stories/VideoShell";

/** Same three featured Erklärfilme as the previous sticky reel. */
const featured = films.filter((film) => film.featured).slice(0, 3);

function RefCard({ film }: { film: Film }) {
  return (
    <article className="comic-panel comic-refs-card">
      <div className="comic-refs-card__media">
        <VideoShell
          title={`${film.client} Erklärfilm`}
          video={film.video}
          sizes="(max-width: 900px) 90vw, 30vw"
          className="aspect-video rounded-none outline-none"
          fade
        />
      </div>

      <div className="comic-refs-card__body">
        <div className="flex flex-col gap-2">
          <h3 className="comic-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.05] text-[var(--comic-ink)]">
            {film.client}
          </h3>
          <p className="text-pretty text-[1.0625rem] leading-[1.45] tracking-[-0.01em] text-[var(--comic-muted)]">
            {film.title}
          </p>
        </div>

        <a
          href="#portfolio"
          className="group/link mt-auto inline-flex items-center gap-2 pt-2 text-base font-semibold leading-snug tracking-[-0.01em] text-[var(--comic-purple)] transition-opacity duration-200 ease-out hover:opacity-70"
        >
          Zur Fallstudie
          <ArrowRight
            aria-hidden
            strokeWidth={2.25}
            className="size-[0.95em] shrink-0 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
          />
        </a>
      </div>
    </article>
  );
}

/** Three featured films side by side — no carousel to drive. */
export function ComicCaseStudies() {
  return (
    <section
      id="kunden"
      className="bg-[var(--comic-white)] py-[clamp(4rem,8vw,7.5rem)]"
    >
      <div className="comic-shell flex flex-col gap-12 md:gap-16">
        <ComicSectionIntro title="Fallstudien" />
        <div className="comic-refs-grid">
          {featured.map((film) => (
            <RefCard key={film.id} film={film} />
          ))}
        </div>
      </div>
    </section>
  );
}
