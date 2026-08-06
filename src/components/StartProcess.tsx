"use client";

import { SectionHeader } from "@/components/SectionHeader";
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
      <SectionHeader
        title="So könnt ihr mit uns starten"
        lead="Drei kurze Schritte zum kostenlosen Erstgespräch. Ohne Briefing, ohne Aufwand."
      />
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
