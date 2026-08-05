"use client";

import Image from "next/image";
import { useState } from "react";

import {
  PlayIcon,
  PORTFOLIO_VIDEO_ID,
  YouTubePlayer,
  youTubePoster,
} from "@/components/YouTubeEmbed";

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
      className={`rounded-full border px-4 py-2 text-[13px] transition-[background-color,color,transform] active:scale-[0.97] ${
        active
          ? "border-[#1c59b6] bg-[#1c59b6] text-white"
          : "border-[#1c59b6] text-[#132c55] hover:bg-[#eaf2ff]"
      }`}
    >
      {label}
    </button>
  );
}

function FilmCard({
  film,
}: {
  film: { name: string; role: string; company: string };
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl lg:min-h-[380px]">
      {playing ? (
        <YouTubePlayer
          videoId={PORTFOLIO_VIDEO_ID}
          title={`${film.name}, ${film.company}`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Film abspielen: ${film.name}, ${film.company}`}
          className="group absolute inset-0 flex cursor-pointer items-center justify-center gap-6 px-6 text-left"
        >
          <Image
            src={youTubePoster(PORTFOLIO_VIDEO_ID)}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute inset-0 bg-black/60 transition-colors duration-300 group-hover:bg-black/50" />
          <span className="relative z-10 flex size-[64px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_24px_#00142e4d] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <PlayIcon size={30} />
          </span>
          <span className="relative z-10 flex flex-col gap-3 text-white">
            <span className="text-base font-semibold">{film.name}</span>
            <span className="flex flex-col gap-1 text-base">
              <span>{film.role}</span>
              <span>{film.company}</span>
            </span>
          </span>
        </button>
      )}
    </article>
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
      className="flex w-full flex-col items-start gap-8 rounded-[48px] px-6 py-10 md:gap-10 md:px-10 md:py-14"
      style={{
        backgroundImage:
          "linear-gradient(180deg in oklab, oklab(99.1% 0.0001 -0.004) 0%, oklab(100% 0 0) 100%)",
      }}
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Von Hä? zu Aha!
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
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
          <h3 className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.125rem,1.6vw,1.5rem)] font-semibold text-black">
            {selectedCount} passende Filme gefunden
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {films.map((film) => (
              <FilmCard key={film.name} film={film} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
