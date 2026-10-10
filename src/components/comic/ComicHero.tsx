import Image from "next/image";
import { Lightbulb, Phone, Timer, type LucideIcon } from "lucide-react";

import { ComicCta } from "@/components/comic/ComicUi";
import { PRIMARY_VIDEO, VimeoFacade } from "@/components/VimeoEmbed";

export function ComicNav() {
  const links = [
    { href: "#prozess", label: "Produktionsprozess" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#kunden", label: "Fallstudien" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="border-b border-[var(--comic-line)] bg-[var(--comic-white)]">
      <div className="comic-shell flex items-center justify-between gap-4 py-3.5 md:py-4">
        <a
          href="#top"
          className="shrink-0 text-[clamp(1rem,1.5vw,1.35rem)] comic-display text-[var(--comic-ink)]"
        >
          Digital Trend Media
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Hauptnavigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.95rem] font-medium tracking-[-0.01em] text-[var(--comic-ink)] transition-opacity hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/** Focused hero: one message, one action, the showreel. */
export function ComicHero() {
  return (
    <section id="top" className="comic-hero">
      <div className="comic-hero__layout">
        <div className="comic-hero__copy">
          <h1 className="comic-hero__title">
            Erklärvideos, die verständlich machen, was du verkaufst
          </h1>
          <p className="comic-hero__subtitle">
            …denn Menschen kaufen nur, was sie auch verstehen.
          </p>
          <ComicCta className="comic-hero__cta" />
        </div>

        <div className="comic-hero__player">
          <VimeoFacade
            video={PRIMARY_VIDEO}
            title="Digital Trend Media Showreel"
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </div>
      </div>
    </section>
  );
}

// Placeholder headshots — swap for real customer portraits.
const proofAvatars = [
  "/images/comic/avatar-2.png",
  "/images/comic/avatar-1.png",
  "/images/comic/avatar-4.png",
  "/images/testimonials/portrait-2.jpg",
  "/images/comic/avatar-3.png",
] as const;

const benefits: { label: string; Icon: LucideIcon }[] = [
  { label: "Mehr Anfragen", Icon: Phone },
  { label: "Komplexes einfach erklärt", Icon: Lightbulb },
  { label: "Kürzere Vertriebszyklen", Icon: Timer },
];

/** One quiet row under the hero: social proof + the three outcomes. */
export function ComicProofBar() {
  return (
    <div className="comic-proofbar">
      <div className="comic-shell comic-proofbar__inner">
        <div className="comic-proofbar__proof">
          <div className="comic-proofbar__avatars" aria-hidden>
            {proofAvatars.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={80}
                height={80}
                className="comic-proofbar__avatar"
              />
            ))}
          </div>
          <p className="comic-proofbar__text">
            Über <strong>200 Unternehmen</strong> vertrauen bereits Digital
            Trend Media
          </p>
        </div>

        <ul className="comic-proofbar__benefits">
          {benefits.map(({ label, Icon }) => (
            <li key={label}>
              <Icon aria-hidden size={18} strokeWidth={2} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
