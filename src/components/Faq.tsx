"use client";

import { useState } from "react";

const items = [
  {
    q: "Wie teuer ist eine Produktion?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Wie lange dauert ein Projekt?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Brauchen wir eigenes Briefing-Material?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Wie viele Korrekturschleifen sind inklusive?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Für welche Branchen eignet sich ein Erklärfilm?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Können wir eigene Markenassets einbringen?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Was passiert nach der Fertigstellung?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Gibt es ein kostenloses Erstgespräch?",
    a: "Die Höhe des Investments hängt von drei Faktoren ab: Länge, Animationsstil und Deadlines. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
];

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`relative flex size-9 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-[0.96] ${
        open
          ? "bg-[var(--color-footer)] text-white"
          : "bg-[#eaf1fd] text-[var(--color-footer)]"
      }`}
      aria-hidden
    >
      <span
        className={`absolute h-[1.5px] w-3.5 rounded-full bg-current transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "rotate-45" : ""
        }`}
      />
      <span
        className={`absolute h-[1.5px] w-3.5 rounded-full bg-current transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "-rotate-45" : "rotate-90"
        }`}
      />
    </span>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14"
    >
      <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
        Häufige Fragen
      </h2>

      <div className="flex w-full flex-col">
        {items.map((item, i) => {
          const open = openIndex === i;
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <div
              key={item.q}
              className="border-b border-[var(--color-border)] first:border-t"
            >
              <button
                id={buttonId}
                type="button"
                className="group flex w-full items-center justify-between gap-4 py-5 text-left md:py-6"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : i)}
              >
                <span className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.4vw,1.25rem)] font-semibold leading-snug tracking-[-0.015em] text-black">
                  {item.q}
                </span>
                <PlusIcon open={open} />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  open
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[62ch] pb-5 text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-pretty text-[var(--color-muted)] md:pb-6 md:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
