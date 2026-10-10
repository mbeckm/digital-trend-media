import { CALENDLY_URL } from "@/lib/calendly";

export function ComicCta({
  href = CALENDLY_URL,
  label = "Kostenloses Erstgespräch",
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`comic-cta ${className}`.trim()}
    >
      <span className="comic-cta__face">{label}</span>
    </a>
  );
}

export function ComicSectionIntro({
  title,
  lead,
  eyebrow,
  light = false,
}: {
  title: string;
  lead: string;
  /** Scene-style mono label above the title */
  eyebrow?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[68rem] flex-col items-center gap-6 px-2 text-center md:gap-8">
      {eyebrow ? (
        <p className={`comic-eyebrow ${light ? "comic-eyebrow--light" : ""}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`comic-section-title ${light ? "text-[var(--comic-white)]" : "text-[var(--comic-ink)]"}`}
      >
        {title}
      </h2>
      <p
        className={`comic-section-lead ${light ? "text-[var(--comic-white)]" : "text-[var(--comic-ink)]"}`}
      >
        {lead}
      </p>
    </div>
  );
}
