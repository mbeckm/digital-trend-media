"use client";

import { useState } from "react";

import {
  STORY_VARIANTS,
  StoriesStage,
  type StoryVariantId,
} from "@/components/stories/StoriesStage";

export default function StoriesLabPage() {
  const [active, setActive] = useState<StoryVariantId>("cinema");
  const current =
    STORY_VARIANTS.find((item) => item.id === active) ?? STORY_VARIANTS[0];

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-8 md:px-12">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold tracking-[0.08em] text-[#7a879e] uppercase">
          Stories lab
        </p>
        <h1 className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.025em] text-black">
          Drafts for „Geschichten unserer Kunden“
        </h1>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-[#3c3d3e]">
          Three Mobbin-inspired layouts for video case studies that link to
          dedicated pages. Homepage currently uses B · Cinema.
        </p>
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-[#7a879e]">
          {current.blurb}
        </p>
      </div>

      <div className="sticky top-4 z-50 flex flex-wrap gap-1 rounded-full bg-white/90 p-1 smooth-shadow-ring-md shadow-[#0c1a3a] backdrop-blur">
        {STORY_VARIANTS.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => setActive(variant.id)}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              active === variant.id
                ? "bg-[#0048a8] text-white"
                : "text-[#132c55] hover:bg-[#eaf3ff]"
            }`}
          >
            {variant.label}
          </button>
        ))}
      </div>

      <StoriesStage variant={active} />
    </main>
  );
}
