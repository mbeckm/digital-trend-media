"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { EditorialSpine } from "@/components/process/EditorialSpine";
import {
  KickoffScene,
  ReelScene,
  ScriptScene,
  StoryboardScene,
} from "@/components/process/scenes";

const steps = [
  {
    n: "01",
    title: "Kick Off",
    meta: "30 Min",
    body: "Gemeinsam entwickeln wir Ideen für die Story. Erzählt unserem Creative-Director von eurer Geschichte, euren Zielsetzungen und USPs.",
    Scene: KickoffScene,
  },
  {
    n: "02",
    title: "Drehbuch",
    meta: "60 Min",
    body: "Die besten Drehbuchautoren Deutschlands schreiben das Drehbuch auf dem Gerüst unserer Conversion-Strategie.",
    Scene: ScriptScene,
  },
  {
    n: "03",
    title: "Storyboard",
    meta: "30 Min",
    body: "Aus Wörtern werden Bilder. Am Storyboard seht ihr Stil und Bildsprache, bevor wir animieren.",
    Scene: StoryboardScene,
  },
  {
    n: "04",
    title: "Animation",
    meta: "30 Min",
    body: "Sind alle Freigaben da, folgen Animation, Voice Over, Sound Design und Musik.",
    Scene: ReelScene,
  },
];

export function Collaboration() {
  return (
    <section
      id="prozess"
      className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14"
    >
      <SectionHeader
        title="So läuft die Zusammenarbeit ab"
        lead="Vier klare Schritte."
        rest="Weniger als drei Stunden eurer Zeit. Ihr bringt das Wissen, wir übersetzen es in Story, Bilder und Bewegung."
      />
      <EditorialSpine
        steps={steps}
        footer={
          <p className="max-w-[40rem] text-balance text-center font-[family-name:var(--font-inter-tight)] text-[clamp(1.25rem,2.2vw,1.625rem)] font-medium leading-[1.55] tracking-[-0.015em] text-black">
            Lasst uns starten.{" "}
            <a
              href="#kontakt"
              className="mx-0.5 inline-flex items-center rounded-full bg-[var(--color-footer)] px-3.5 py-1 align-middle text-[0.78em] font-semibold leading-none text-white no-underline transition-[transform,opacity] hover:opacity-90 active:scale-[0.98]"
            >
              Projekt beantragen
            </a>{" "}
            <span className="text-[#8a8d92]">
              Erstgespräch sofort kostenlos buchen
            </span>
          </p>
        }
      />
    </section>
  );
}
