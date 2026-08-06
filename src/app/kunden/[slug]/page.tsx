import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CASE_STUDIES,
  getCaseStudy,
} from "@/components/stories/data";
import { VideoShell } from "@/components/stories/VideoShell";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="mx-auto flex w-full max-w-[960px] flex-col gap-10 px-6 py-12 md:px-10 md:py-16">
      <Link
        href="/#kunden"
        className="w-fit text-sm font-semibold text-[#1f4e8e] transition-opacity hover:opacity-70"
      >
        ← Zurück zu den Geschichten
      </Link>

      <header className="flex flex-col gap-4">
        <p className="text-[13px] font-semibold tracking-[0.08em] text-[#7a879e] uppercase">
          {study.industry} · Case Study
        </p>
        <h1 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-black text-balance">
          {study.headline}
        </h1>
        <p className="text-base text-[#6b7280]">
          {study.name}, {study.role} bei {study.company}
        </p>
      </header>

      <VideoShell
        title={`${study.name}, ${study.company}`}
        video={study.video}
        duration={study.duration}
        sizes="100vw"
        className="aspect-video rounded-[var(--radius-media)]"
      />

      <div className="grid gap-6 rounded-[20px] bg-[#f4f7fc] p-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:p-8">
        <div>
          <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-[#0048a8] tabular-nums">
            {study.metric}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#3c3d3e]">
            {study.metricLabel}
          </p>
        </div>
        <blockquote className="text-pretty text-[1.125rem] leading-relaxed text-[#3c3d3e] md:text-[1.25rem]">
          „{study.quote}“
        </blockquote>
      </div>

      <p className="max-w-[60ch] text-[15px] leading-relaxed text-[#6b7280]">
        Platzhalter-Seite — hier kommen später der volle Film-Kontext, der
        Ablauf und die Ergebnisse. Der Link aus der Homepage-Sektion führt
        bereits hierher.
      </p>
    </main>
  );
}
