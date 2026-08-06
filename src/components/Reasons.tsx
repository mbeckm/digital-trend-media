import { ReasonsGrid } from "@/components/reasons/ReasonsGrid";
import { SectionDek } from "@/components/SectionDek";

export function Reasons() {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] md:gap-10 lg:gap-14">
        <div className="flex flex-col gap-4 md:sticky md:top-24 md:gap-5 lg:top-28 md:self-start">
          <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
            Warum bleiben Anfragen aus?
          </h2>
          <SectionDek
            lead="Die üblichen Verdächtigen sind meistens falsch."
            rest="Genau das glaubt man oft. In den meisten Fällen ist keiner dieser Gründe die eigentliche Ursache."
          />
        </div>
        <ReasonsGrid />
      </div>
    </section>
  );
}
