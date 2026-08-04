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
    <svg
      viewBox="0 0 30 30"
      width="30"
      height="30"
      className={`shrink-0 transition-transform duration-300 ${
        open ? "rotate-[315deg]" : ""
      }`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M15 26.808L15 3.192"
        fill="none"
        stroke="#979797"
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        d="M3.192 15L26.808 15"
        fill="none"
        stroke="#979797"
        strokeWidth="4"
      />
    </svg>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="flex w-full flex-col items-center gap-6 rounded-2xl bg-[#f8f8f8] p-6 md:p-12"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] text-black">
          Häufige Fragen
        </h2>
        <p className="font-[family-name:var(--font-inter-tight)] text-[22px] leading-7 text-black">
          So läuft eine Zusammenarbeit mit Digital Trend Media ab.
        </p>
      </div>

      <div className="flex w-full flex-col gap-6 rounded-xl border border-[#bebebe] bg-white p-6">
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={item.q}
              className="border-b border-[#e2e2e2] pb-2 pt-1 last:border-b-0"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : i)}
              >
                <span className="text-lg font-medium text-black">{item.q}</span>
                <PlusIcon open={open} />
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="mt-2 max-w-[65%] text-lg font-medium text-[#838383]">
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
