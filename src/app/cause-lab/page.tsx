"use client";

import { useState } from "react";

import { Cause } from "@/components/Cause";
import {
  CAUSE_VARIANTS,
  type CauseVariantId,
} from "@/components/cause/CauseStage";

export default function CauseLabPage() {
  const [active, setActive] = useState<CauseVariantId>("decision-paralysis");

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-8 md:px-12">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold tracking-[0.08em] text-[#7a879e] uppercase">
          Cause lab
        </p>
        <h1 className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.025em] text-black">
          Drafts for „Die Ursache“
        </h1>
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-[#3c3d3e]">
          Homepage uses C · Unclear picture. Flip between drafts to compare.
        </p>
      </div>

      <div className="sticky top-4 z-50 flex flex-wrap gap-1 rounded-full border border-[#dfe4f6] bg-white/90 p-1 shadow-[0_8px_24px_-16px_rgba(12,26,58,0.35)] backdrop-blur">
        {CAUSE_VARIANTS.map((variant) => (
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

      <Cause variant={active} />
    </main>
  );
}
