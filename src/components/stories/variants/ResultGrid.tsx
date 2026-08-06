"use client";

import { CaseStudyLink } from "@/components/stories/CaseStudyLink";
import { CASE_STUDIES, type CaseStudy } from "@/components/stories/data";
import { StoriesHeader } from "@/components/stories/StoriesHeader";
import { VideoShell } from "@/components/stories/VideoShell";

/**
 * Result Grid — equal video cards led by a hard metric.
 * Mobbin cues: Rox pioneer grid, Webflow metric cards, Patreon video thumbs.
 */
function ResultCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group flex flex-col gap-5">
      <VideoShell
        title={`${study.name}, ${study.company}`}
        video={study.video}
        duration={study.duration}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="aspect-[4/3] rounded-[20px] smooth-shadow-ring-sm shadow-[#0c1a3a] transition-transform duration-500 ease-out group-hover:scale-[1.01]"
        fade
      />
      <div className="flex flex-col gap-3 px-0.5">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-[#7a879e] uppercase">
          {study.industry} · {study.company}
        </p>
        <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-none tracking-[-0.04em] text-[#0048a8] tabular-nums">
          {study.metric}
        </p>
        <p className="text-[1.05rem] font-semibold leading-snug tracking-[-0.015em] text-black text-pretty">
          {study.metricLabel}
        </p>
        <p className="text-sm leading-snug text-[#6b7280]">
          {study.name}, {study.role}
        </p>
        <div className="pt-1">
          <CaseStudyLink slug={study.slug}>Case Study ansehen</CaseStudyLink>
        </div>
      </div>
    </article>
  );
}

export function ResultGridStories() {
  return (
    <section
      id="kunden"
      className="flex w-full flex-col gap-8 py-10 md:gap-10 md:py-14"
    >
      <StoriesHeader />
      <div className="grid w-full gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
        {CASE_STUDIES.map((study) => (
          <ResultCard key={study.slug} study={study} />
        ))}
      </div>
    </section>
  );
}
