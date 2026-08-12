import {
  Clapperboard,
  Palette,
  RefreshCw,
  Rocket,
  Target,
  type LucideIcon,
} from "lucide-react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const rows: {
  label: string;
  Icon: LucideIcon;
  us: string;
  them: string;
}[] = [
  {
    label: "Korrekturschleifen",
    Icon: RefreshCw,
    us: "Unbegrenzte Korrekturschleifen inklusive",
    them: "1–2 Schleifen pro Phase. Danach wird es teuer",
  },
  {
    label: "Design",
    Icon: Palette,
    us: "Individuell auf euer Unternehmen zugeschnitten",
    them: "Templates und Figuren von der Stange",
  },
  {
    label: "Drehbuch",
    Icon: Clapperboard,
    us: "Entwickelt von professionellen Werbetextern und Drehbuchautoren",
    them: "Die Story schreibt häufig der Animator gleich mit",
  },
  {
    label: "Ergebnis",
    Icon: Target,
    us: "Konzipiert für eure Marketing- und Vertriebsziele",
    them: "Hauptsache fertig und ausgeliefert",
  },
  {
    label: "Nach der Produktion",
    Icon: Rocket,
    us: "Wir zeigen euch, wo und wie der Film die größte Wirkung erzielt",
    them: "Film fertig, Datei verschickt. Was danach passiert, ist euer Problem",
  },
];

export function ComicCompare() {
  return (
    <section className="comic-compare">
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
            <div
              className="comic-compare-table__cell comic-compare-table__cell--corner"
              role="columnheader"
            />
            <div
              className="comic-compare-table__cell comic-compare-table__cell--col comic-compare-table__cell--col-us"
              role="columnheader"
            >
              Digital Trend Media
            </div>
            <div
              className="comic-compare-table__cell comic-compare-table__cell--col comic-compare-table__cell--col-them"
              role="columnheader"
            >
              Andere Agenturen
            </div>
          </div>

          {rows.map(({ label, Icon, us, them }) => (
            <div key={label} className="comic-compare-table__row" role="row">
              <div
                className="comic-compare-table__cell comic-compare-table__cell--label"
                role="rowheader"
              >
                <Icon
                  aria-hidden
                  className="comic-compare-table__icon"
                  strokeWidth={2.25}
                />
                <span>{label}</span>
              </div>
              <div
                className="comic-compare-table__cell comic-compare-table__cell--us"
                role="cell"
              >
                <span className="comic-compare-table__mobile-label comic-compare-table__mobile-label--us">
                  Digital Trend Media
                </span>
                <p className="comic-compare-table__value">{us}</p>
              </div>
              <div
                className="comic-compare-table__cell comic-compare-table__cell--them"
                role="cell"
              >
                <span className="comic-compare-table__mobile-label">
                  Andere Agenturen
                </span>
                <p className="comic-compare-table__value">{them}</p>
              </div>
            </div>
          ))}
        </div>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}
