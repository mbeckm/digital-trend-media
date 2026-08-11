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
  light = false,
}: {
  title: string;
  lead: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[68rem] flex-col items-center gap-6 px-2 text-center md:gap-9">
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
