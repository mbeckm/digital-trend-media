import { Handshake, MessageCircle, Zap, type LucideIcon } from "lucide-react";

import { ScrollFlipCard } from "@/components/card-flip/ScrollFlipCard";
import { ComicBenefit } from "@/components/comic/ComicBenefit";
import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const benefits: {
  title: string;
  tilt: number;
  wiggleDelay: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Mehr Anfragen",
    tilt: -1.4,
    wiggleDelay: "0s",
    Icon: MessageCircle,
  },
  {
    title: "Bessere Abstimmung",
    tilt: 0.5,
    wiggleDelay: "0.45s",
    Icon: Handshake,
  },
  {
    title: "Schnellerer Vertrieb",
    tilt: 2.4,
    wiggleDelay: "0.9s",
    Icon: Zap,
  },
];

export function ComicHelp() {
  return (
    <section className="comic-help" id="prozess">
      <div className="comic-shell comic-help__intro">
        <ComicSectionIntro
          light
          title="Wie ein Erklärvideo dir hilft"
          lead="Niemand nimmt sich eine halbe Stunde um deine Website zu studieren. Sie ist eine anonyme, unpersönliche, nichtssagende Ansammlung von Bild und Text."
        />
      </div>

      <ScrollFlipCard />

      <div className="comic-shell comic-help__after flex flex-col items-center">
        <h3 className="comic-help__payoff">
          Erklärfilme verbessern dein Geschäft
        </h3>

        <div className="comic-help__benefits">
          {benefits.map(({ title, tilt, wiggleDelay, Icon }) => (
            <ComicBenefit
              key={title}
              title={title}
              icon={
                <Icon
                  size={36}
                  strokeWidth={2.25}
                  absoluteStrokeWidth
                  aria-hidden
                />
              }
              tilt={tilt}
              wiggleDelay={wiggleDelay}
            />
          ))}
        </div>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}
