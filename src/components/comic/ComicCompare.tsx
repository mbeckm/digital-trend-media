import Image from "next/image";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const rows = [
  {
    label: "Korrekturschleifen",
    us: "Unbegrenzte Korrekturschleifen inklusive",
    them: "1-2 Schleifen pro Phase. Danach wird es teuer",
  },
  {
    label: "Design",
    us: "Individuell auf euer Unternehmen zugeschnitten",
    them: "Templates und Figuren von der Stange",
  },
  {
    label: "Drehbuch",
    us: "Entwickelt von professionellen Werbetextern und Drehbuchautoren",
    them: "Die Story schreibt häufig der Animator gleich mit",
  },
  {
    label: "Ergebnis",
    us: "Konzipiert für eure Marketing- und Vertriebsziele",
    them: "Hauptsache fertig und ausgeliefert",
  },
  {
    label: "Nach der Produktion",
    us: "Wir zeigen euch, wo und wie der Film die größte Wirkung erzielt",
    them: "Film fertig, Datei verschickt. Was danach passiert, ist euer Problem",
  },
] as const;

export function ComicCompare() {
  return (
    <section className="comic-compare">
      <Image
        src="/images/comic/character-happy.png"
        alt=""
        width={238}
        height={357}
        className="comic-compare__character"
      />

      <div className="comic-shell relative z-10 flex flex-col items-center gap-12 md:gap-16">
        <ComicSectionIntro
          title="Wir vs. Die Anderen"
          lead="Mehr Freiraum in der Produktion. Mehr Wirkung im Vertrieb — statt Dateien ohne Ergebnis."
        />

        <div
          className="comic-compare-table"
          role="table"
          aria-label="Vergleich Digital Trend Media und andere Agenturen"
        >
          <div className="comic-compare-table__head" role="row">
            <div className="comic-compare-table__cell" role="columnheader" />
            <div className="comic-compare-table__cell font-semibold" role="columnheader">
              Digital Trend Media
            </div>
            <div className="comic-compare-table__cell font-semibold" role="columnheader">
              Andere Agenturen
            </div>
          </div>

          {rows.map((row) => (
            <div key={row.label} className="comic-compare-table__row" role="row">
              <div
                className="comic-compare-table__cell font-semibold"
                role="rowheader"
              >
                {row.label}
              </div>
              <div
                className="comic-compare-table__cell comic-compare-table__cell--us"
                role="cell"
              >
                <span className="md:hidden font-semibold text-[var(--comic-purple)]">
                  Digital Trend Media ·{" "}
                </span>
                {row.us}
              </div>
              <div className="comic-compare-table__cell" role="cell">
                <span className="md:hidden font-semibold opacity-60">
                  Andere ·{" "}
                </span>
                {row.them}
              </div>
            </div>
          ))}
        </div>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}
