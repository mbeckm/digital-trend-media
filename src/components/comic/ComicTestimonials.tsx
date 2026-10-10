import Image from "next/image";

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
          title="Das sagen unsere Kunden"
          lead="Unsere Kunden erzählen von ihren Erfahrungen mit den Erklärfilmen von Digital Trend Media."
        />
      </div>

      {/* Three-up on desktop, stacked on phones — nothing to swipe */}
      <div className="comic-shell mt-12 flex flex-col items-center gap-12 md:mt-16 md:gap-16">
        <div className="grid w-full max-w-[36rem] grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3 xl:gap-8">
          {studies.map((study, index) => (
            <TestimonialCard
              key={study.slug}
              study={study}
              index={index}
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          ))}
        </div>

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
