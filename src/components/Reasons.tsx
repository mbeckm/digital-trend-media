import { SectionHeader } from "@/components/SectionHeader";
import { ReasonsGrid } from "@/components/reasons/ReasonsGrid";

export function Reasons() {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] md:gap-10 lg:gap-14">
        <div className="md:sticky md:top-24 md:self-start lg:top-28">
          <SectionHeader
            title="Warum bleiben Anfragen aus?"
            lead="Die üblichen Verdächtigen sind meistens falsch."
            rest="Genau das glaubt man oft. In den meisten Fällen ist keiner dieser Gründe die eigentliche Ursache."
          />
        </div>
        <ReasonsGrid />
      </div>
    </section>
  );
}
