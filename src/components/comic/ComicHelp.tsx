import { Handshake, MessageCircle, Zap, type LucideIcon } from "lucide-react";

import { ScrollFlipCard } from "@/components/card-flip/ScrollFlipCard";
import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const benefits: { title: string; Icon: LucideIcon }[] = [
  { title: "Mehr Anfragen", Icon: MessageCircle },
  { title: "Bessere Abstimmung", Icon: Handshake },
  { title: "Schnellerer Vertrieb", Icon: Zap },
];

export function ComicHelp() {
  return (
    <section className="comic-help">
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

        <ul className="comic-help__benefits">
          {benefits.map(({ title, Icon }) => (
            <li key={title} className="comic-benefit">
              <span className="comic-benefit__icon">
                <Icon size={20} strokeWidth={2} aria-hidden />
              </span>
              <p className="comic-benefit__label">{title}</p>
            </li>
          ))}
        </ul>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}
