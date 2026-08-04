"use client";

import Image from "next/image";
import { useState } from "react";

const filters = {
  Branche: [
    "Finanzindustrie",
    "Produktvorstellungen",
    "Produzierendes Gewerbe",
    "Solar",
    "Dienstleistung",
    "Software",
  ],
  Stil: ["2D-Flat", "Isometrisch", "Icon", "Whiteboard"],
  Videoart: [
    "Produktvorstellung",
    "Anleitung",
    "Unterweisung",
    "Kundengewinnung",
  ],
};

const films = [
  {
    name: "Nadine Müller",
    role: "Marketing Lead",
    company: "Lekkerland",
  },
  {
    name: "Markus Matic",
    role: "Vertriebsleiter",
    company: "AXA",
  },
];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs transition-[background-color,color,transform] active:scale-[0.97] ${
        active
          ? "border-[#1c59b6] bg-[#1c59b6] text-white"
          : "border-[#1c59b6] text-[#132c55] hover:bg-[#eaf2ff]"
      }`}
    >
      {label}
    </button>
  );
}

export function Portfolio() {
  const [active, setActive] = useState<Record<string, string | null>>({
    Branche: null,
    Stil: null,
    Videoart: null,
  });

  const activeFilters = Object.values(active).filter(Boolean).length;
  const selectedCount = Math.max(2, 8 - activeFilters * 2);

  return (
    <section
      id="portfolio"
      className="flex w-full flex-col items-start gap-12 rounded-[48px] p-6 md:p-12"
      style={{
        backgroundImage:
          "linear-gradient(180deg in oklab, oklab(99.1% 0.0001 -0.004) 0%, oklab(100% 0 0) 100%)",
      }}
    >
      <div className="flex flex-col gap-6">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Von Hä? zu Aha!
        </h2>
        <p className="max-w-5xl font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
          Egal was Ihnen vorschwebt, wir haben bereits einen passenden
          Erklärfilm umgesetzt. Nutzen Sie unser interaktives Tool, um die für
          Ihr Unternehmen passende Referenz zu finden.
        </p>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-6 rounded-2xl border border-[#aeb3b9] p-6">
          {(Object.keys(filters) as Array<keyof typeof filters>).map((group) => (
            <div key={group} className="flex flex-col gap-3">
              <h3 className="font-[family-name:var(--font-inter-tight)] text-lg font-semibold text-black">
                {group}
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters[group].map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    active={active[group] === chip}
                    onClick={() =>
                      setActive((prev) => ({
                        ...prev,
                        [group]: prev[group] === chip ? null : chip,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-6 rounded-2xl border border-[#a7a8a9] p-6">
          <h3 className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.25rem,2vw,1.75rem)] font-semibold text-black">
            {selectedCount} passende Filme gefunden
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {films.map((film) => (
              <article
                key={film.name}
                className="relative flex min-h-[320px] items-center justify-center gap-6 overflow-hidden rounded-2xl lg:min-h-[500px]"
              >
                <Image
                  src="/images/flowers.webp"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative z-10 flex items-center gap-6 px-6">
                  <div className="relative flex size-[78px] shrink-0 items-center justify-center rounded-full bg-white">
                    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden>
                      <path
                        fillRule="evenodd"
                        d="M34.41 22.709L9.59 5.641L9.59 38.923L34.41 22.709Z"
                        fill="#5A5A5A"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3 text-white">
                    <p className="text-base font-semibold">{film.name}</p>
                    <div className="flex flex-col gap-1 text-base">
                      <span>{film.role}</span>
                      <span>{film.company}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
