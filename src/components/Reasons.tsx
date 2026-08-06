import { ReasonsGrid } from "@/components/reasons/ReasonsGrid";
import { SectionDek } from "@/components/SectionDek";

export function Reasons() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-4 md:gap-5">
          <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
            Warum bleiben Anfragen aus?
          </h2>
          <SectionDek
            lead="Die üblichen Verdächtigen sind meistens falsch."
            rest="Website zu alt, Vertrieb zu schwach, Anzeigen wirkungslos, Markt schlecht: genau das glaubt man oft. In den meisten Fällen ist keiner dieser Gründe die eigentliche Ursache."
          />
        </div>
        <ReasonsGrid />
      </div>
    </section>
  );
}
