"use client";

import { CaseStudyLink } from "@/components/stories/CaseStudyLink";
import { CASE_STUDIES, type CaseStudy } from "@/components/stories/data";
import { StoriesHeader } from "@/components/stories/StoriesHeader";
import { VideoShell } from "@/components/stories/VideoShell";

/**
 * Spotlight — featured split + secondary row.
 * Mobbin cues: Vanta featured leader, Dovetail quote split, Harvest featured story.
 */
function Featured({ study }: { study: CaseStudy }) {
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-media)] bg-[#f4f7fc] smooth-shadow-ring-md shadow-[#0c1a3a] lg:grid-cols-[1.15fr_1fr]">
      <VideoShell
        title={`${study.name}, ${study.company}`}
        videoId={study.videoId}
        duration={study.duration}
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="aspect-[16/10] min-h-[280px] lg:aspect-auto lg:min-h-[420px]"
        fade
      />
      <div className="flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold tracking-[0.06em] text-[#7a879e] uppercase">
            <span>Featured Story</span>
            <span aria-hidden className="text-[#c5cddc]">
              ·
            </span>
            <span>{study.industry}</span>
          </div>
          <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.75rem,3vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.03em] text-black text-balance">
            <span className="text-[#0048a8]">{study.metric}</span>{" "}
            {study.metricLabel}
          </p>
          <blockquote className="max-w-[36ch] text-pretty text-[1.05rem] leading-relaxed text-[#3c3d3e] md:text-[1.125rem]">
            „{study.quote}“
          </blockquote>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-semibold text-black">{study.name}</p>
            <p className="text-sm text-[#6b7280]">
              {study.role} · {study.company}
            </p>
          </div>
          <CaseStudyLink slug={study.slug} className="text-base">
            Zur Case Study
          </CaseStudyLink>
        </div>
      </div>
    </article>
  );
}

function SecondaryCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group flex flex-1 flex-col overflow-hidden rounded-[20px] bg-white smooth-shadow-ring-sm shadow-[#0c1a3a] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:smooth-shadow-ring-md">
      <VideoShell
        title={`${study.name}, ${study.company}`}
        videoId={study.videoId}
        duration={study.duration}
        sizes="(max-width: 768px) 100vw, 40vw"
        className="aspect-[16/10]"
        fade
      />
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.35rem,2vw,1.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-black">
          <span className="text-[#0048a8]">{study.metric}</span>{" "}
          <span className="text-[#3c3d3e]">{study.metricLabel}</span>
        </p>
        <p className="text-sm leading-snug text-[#6b7280]">
          {study.name}, {study.role} bei {study.company}
        </p>
        <div className="mt-auto pt-1">
          <CaseStudyLink slug={study.slug}>Case Study ansehen</CaseStudyLink>
        </div>
      </div>
    </article>
  );
}

export function SpotlightStories() {
  const [featured, ...rest] = CASE_STUDIES;

  return (
    <section
      id="kunden"
      className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14"
    >
      <StoriesHeader />
      <div className="flex w-full flex-col gap-6">
        <Featured study={featured} />
        <div className="flex flex-col gap-6 md:flex-row">
          {rest.map((study) => (
            <SecondaryCard key={study.slug} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
