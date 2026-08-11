import { BrandLabBanner } from "@/components/brand-lab/BrandLabBanner";
import { BrandNav } from "@/components/brand-lab/BrandNav";
import { BrandProof } from "@/components/brand-lab/BrandProof";
import { BrandWork } from "@/components/brand-lab/BrandWork";
import { CloudsHero } from "@/components/brand-lab/CloudsHero";

export default function BrandLabCloudsPage() {
  return (
    <div className="brand-lab brand-lab--clouds">
      <main className="flex w-full flex-col pb-24">
        <BrandLabBanner active="clouds" />
        <BrandNav />
        <CloudsHero />
        <BrandWork />
        <BrandProof />

        <div className="mx-auto mt-8 w-full max-w-[var(--bl-container)] px-[var(--bl-gutter)]">
          <div className="rounded-[var(--bl-radius-lg)] border-[2.5px] border-dashed border-[var(--bl-border)] bg-[var(--bl-surface-soft)] px-6 py-10 text-center md:px-10">
            <p className="bl-display text-lg font-bold tracking-[-0.02em] text-[var(--bl-ink)]">
              Clouds + Cast · Rest folgt nach Freigabe
            </p>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-[var(--bl-muted)]">
              Palette und Figuren aus dem Canva-Entwurf / den Filmen. Playful
              Struktur bleibt — Farben und Cast sind die Client-DNA.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
