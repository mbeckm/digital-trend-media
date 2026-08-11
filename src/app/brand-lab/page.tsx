import { BrandHero } from "@/components/brand-lab/BrandHero";
import { BrandLabBanner } from "@/components/brand-lab/BrandLabBanner";
import { BrandNav } from "@/components/brand-lab/BrandNav";
import { BrandProof } from "@/components/brand-lab/BrandProof";
import { BrandWork } from "@/components/brand-lab/BrandWork";

export default function BrandLabPage() {
  return (
    <div className="brand-lab">
      <main className="flex w-full flex-col pb-24">
        <BrandLabBanner active="playful" />
        <BrandNav />
        <BrandHero />
        <BrandWork />
        <BrandProof />

        <div className="mx-auto mt-8 w-full max-w-[var(--bl-container)] px-[var(--bl-gutter)]">
          <div className="rounded-[var(--bl-radius-lg)] border-[2.5px] border-dashed border-[var(--bl-border)] bg-[var(--bl-surface-soft)] px-6 py-10 text-center md:px-10">
            <p className="bl-display text-lg font-bold tracking-[-0.02em] text-[var(--bl-ink)]">
              Rest der Seite folgt nach Freigabe der Richtung
            </p>
            <p className="mx-auto mt-2 max-w-[40ch] text-sm leading-relaxed text-[var(--bl-muted)]">
              Benefits, Logos, Prozess, Vergleich, FAQ und Footer bleiben bewusst
              aus — erst die Persönlichkeit dieser vier Blöcke bewerten.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
