"use client";

import { SectionDek } from "@/components/SectionDek";
import { EditorialSpine } from "@/components/process/EditorialSpine";
import {
  AnalysisScene,
  CalendarScene,
  PathScene,
} from "@/components/process/scenes";

const steps = [
  {
    n: "01",
    title: "Termin buchen",
    meta: "2 Min",
    body: "Beantwortet uns einige kurze Fragen zu eurem Unternehmen und wählt einen passenden Termin.",
    Scene: CalendarScene,
  },
  {
    n: "02",
    title: "Potenzial analysieren",
    meta: "30 Min",
    body: "Gemeinsam schauen wir uns euer Angebot, eure Zielgruppe und eure aktuellen Herausforderungen an.",
    Scene: AnalysisScene,
  },
  {
    n: "03",
    title: "Strategie entwickeln",
    meta: "im Call",
    body: "Gemeinsam finden wir heraus, mit welcher Botschaft und an welchen Stellen euer Film am meisten bewirken kann.",
    Scene: PathScene,
  },
];

export function StartProcess() {
  return (
    <section className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col gap-4 md:gap-5">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          So könnt ihr mit uns starten
        </h2>
        <SectionDek
          lead="So einfach wie ein Termin."
          rest="Drei kurze Schritte zum kostenlosen Erstgespräch. Ohne Briefing, ohne Aufwand."
        />
      </div>
      <EditorialSpine
        steps={steps}
        footer={
          <a href="#kontakt" className="hero-cta">
            Termin buchen
          </a>
        }
      />
    </section>
  );
}
