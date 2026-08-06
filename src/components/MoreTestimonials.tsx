"use client";

import Image from "next/image";

import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/SectionHeader";

const quotes = [
  {
    quote:
      "Unser Erklärfilm hat die Anfragen deutlich gesteigert. Komplexe Leistungen werden endlich in wenigen Minuten verständlich.",
    name: "Laura Hoffmann",
    role: "Head of Marketing",
    company: "Nova Finance",
    image: "/images/testimonials/office-1.jpg",
    seed: 0.0,
  },
  {
    quote:
      "Vom Kick-off bis zum fertigen Film alles klar strukturiert. Der Film läuft jetzt auf der Website und in unserem Vertrieb.",
    name: "Thomas Berger",
    role: "Geschäftsführer",
    company: "Berger Technik",
    image: "/images/testimonials/office-2.jpg",
    seed: 2.7,
  },
  {
    quote:
      "Wir nutzen den Film in Ads und im Onboarding. Die Conversion ist spürbar besser, und das Team spart Erklärzeit.",
    name: "Sarah Klein",
    role: "Growth Lead",
    company: "Klarpath Software",
    image: "/images/testimonials/office-3.jpg",
    seed: 5.1,
  },
  {
    quote:
      "Endlich eine Botschaft, die unsere Zielgruppe sofort versteht. Professionell, schnell und ohne Abstimmungs-Chaos.",
    name: "Michael Richter",
    role: "Vertriebsleiter",
    company: "Helio Systems",
    image: "/images/testimonials/office-4.jpg",
    seed: 8.4,
  },
];

export function MoreTestimonials() {
  return (
    <section className="flex w-full flex-col gap-8 py-10 md:gap-10 md:py-14">
      <SectionHeader
        title="Weitere Kundenstimmen"
        lead="Was passiert, wenn der Film live geht?"
        rest="Verständlichere Gespräche, greifbarere Angebote, mehr Anfragen im Alltag. Stimmen aus Marketing, Vertrieb und Geschäftsführung."
      />

      <div className="flex w-full flex-col gap-6">
        {quotes.map((item, index) => (
          <Reveal key={item.name} soft delay={Math.min(index * 0.05, 0.15)}>
            <article className="flex w-full flex-col overflow-hidden rounded-2xl bg-white smooth-shadow-ring-md shadow-[#0c1a3a] md:min-h-[440px] md:flex-row lg:min-h-[520px]">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden outline outline-1 outline-black/10 -outline-offset-1 md:aspect-auto md:w-[58%] lg:w-[62%]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 62vw"
                />
              </div>
              <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
                <CloudsVolumetric
                  variant="subtle"
                  seed={item.seed}
                  className="pointer-events-none absolute inset-0 z-0"
                />
                <div className="relative z-10 flex flex-1 flex-col gap-8 p-6 md:gap-10 md:p-9 lg:p-12">
                  <p className="text-pretty font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.28] tracking-[-0.025em] text-black">
                    „{item.quote}“
                  </p>
                  <div className="mt-auto flex flex-col gap-3 border-t border-black/[0.08] pt-6">
                    <p className="font-[family-name:var(--font-inter-tight)] text-lg font-semibold leading-6 tracking-[-0.01em] text-black">
                      {item.name}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-base leading-6 text-[var(--color-card-meta)]">
                        {item.role}
                      </p>
                      <p className="text-base leading-6 text-[var(--color-card-meta)]">
                        {item.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
