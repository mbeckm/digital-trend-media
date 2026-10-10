"use client";

import { useState } from "react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const items = [
  {
    q: "Was kostet ein Film?",
    a: "Die Höhe des Investments hängt von Länge, Animationsstil und Deadlines ab. Grundsätzlich könnt ihr mit einem mittleren vierstelligen Betrag rechnen.",
  },
  {
    q: "Wie lange dauert es?",
    a: "Die meisten Produktionen dauern zwischen sechs und zehn Wochen — je nach Umfang, Feedback-Zyklen und gewünschtem Stil.",
  },
  {
    q: "Kann ich ein Skript vorgeben?",
    a: "Ja. Wir können mit eurem Briefing starten oder das Drehbuch gemeinsam mit unseren Werbetextern entwickeln.",
  },
  {
    q: "Kann ich mir selbst Figuren ausdenken?",
    a: "Absolut. Wir gestalten Charaktere passend zu eurer Marke — inklusive eigener Figuren, wenn ihr sie mitbringt.",
  },
  {
    q: "Kriege ich mein Geld zurück wenn es mir nicht gefällt?",
    a: "Wir arbeiten in klaren Phasen mit Freigaben. So bleibt das Ergebnis planbar — und Korrekturen sind unbegrenzt inklusive.",
  },
  {
    q: "Habe ich einen direkten Ansprechpartner?",
    a: "Ja. Ihr habt durchgehend eine feste Projektleitung als direkten Draht zu Konzept, Design und Produktion.",
  },
] as const;

export function ComicFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[var(--comic-white)] py-[clamp(4rem,8vw,7.5rem)]">
      <div className="comic-shell flex flex-col items-center gap-12 md:gap-16">
        <ComicSectionIntro
          title="Häufige Fragen"
          lead="Die wichtigsten, wiederkehrenden Fragen auf einen Blick beantwortet"
        />

        <div className="flex w-full flex-col gap-3">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="comic-faq-item">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <Chevron open={open} />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[56ch] px-2 pb-5 text-[clamp(1rem,1.4vw,1.25rem)] font-medium leading-[1.45] tracking-[-0.02em] text-[var(--comic-muted)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 46 25"
      width="28"
      height="16"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M0 0L23 25L46 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
