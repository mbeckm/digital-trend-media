"use client";

import { useState } from "react";

import { CloudsFlow } from "@/components/clouds/CloudsFlow";
import { CloudsParallax } from "@/components/clouds/CloudsParallax";
import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";

const variants = [
  { id: "volumetric", label: "A · Volumetric", Clouds: CloudsVolumetric },
  { id: "flow", label: "B · Flow", Clouds: CloudsFlow },
  { id: "parallax", label: "C · Parallax", Clouds: CloudsParallax },
] as const;

export default function CloudLabPage() {
  const [active, setActive] = useState<(typeof variants)[number]["id"]>(
    "volumetric",
  );
  const { Clouds } = variants.find((v) => v.id === active) ?? variants[0];

  return (
    <main className="flex min-h-dvh w-full flex-col">
      <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-[#dfe4f6] bg-white/80 p-1 backdrop-blur">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => setActive(variant.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === variant.id
                ? "bg-[#0048a8] text-white"
                : "text-[#132c55] hover:bg-[#eaf3ff]"
            }`}
          >
            {variant.label}
          </button>
        ))}
      </div>

      <section
        className="relative isolate flex min-h-dvh w-full flex-col items-center gap-8 overflow-hidden py-24"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <Clouds key={active} className="-z-10" />

        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-6 text-center md:px-12">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.025em] text-black">
            Komplexes.
          </h1>
          <p
            className="-mt-8 bg-clip-text font-[family-name:var(--font-inter-tight)] text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.025em] text-transparent"
            style={{ backgroundImage: "var(--gradient-blue-text)" }}
          >
            Einfach erklärt.
          </p>
          <p className="max-w-[46rem] text-[clamp(1.0625rem,1.5vw,1.375rem)] font-semibold leading-[1.35] text-black">
            Digital Trend Media macht Erklärfilme, die eure Zielgruppe von eurem
            Angebot begeistern.
          </p>
          <span
            className="inline-flex min-h-[64px] min-w-[280px] items-center justify-center rounded-full border-[3px] border-[#e5f0ff] px-12 text-[18px] font-semibold text-white md:min-w-[420px]"
            style={{
              backgroundImage: "var(--gradient-blue)",
              boxShadow: "var(--shadow-cta)",
            }}
          >
            Kostenloses Erstgespräch
          </span>
          <div className="mt-4 h-[300px] w-[70%] rounded-[36px] bg-[#0b1a2b]/85" />
        </div>
      </section>
    </main>
  );
}
