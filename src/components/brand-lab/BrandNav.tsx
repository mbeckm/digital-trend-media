import { CALENDLY_URL } from "@/lib/calendly";

const links = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#kunden", label: "Kunden" },
  { href: "#prozess", label: "Prozess" },
  { href: "#faq", label: "FAQ" },
];

export function BrandNav() {
  return (
    <header className="relative z-40 w-full px-[var(--bl-gutter)] pt-5 md:pt-6">
      <div className="mx-auto flex w-full max-w-[var(--bl-container)] items-center justify-between gap-4">
        <a
          href="#top"
          className="bl-display group relative min-w-0 shrink text-[1.05rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--bl-ink)] md:text-[1.2rem]"
        >
          Digital Trend Media
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-[5px] w-[42%] rounded-full bg-[var(--bl-yellow)] transition-[width] duration-300 group-hover:w-full"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.9375rem] font-semibold text-[var(--bl-ink)] transition-colors hover:text-[var(--bl-blue)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bl-btn bl-btn--ghost shrink-0 !min-h-10 !px-3.5 !text-sm md:!px-4 md:!text-[0.9375rem]"
        >
          Termin vereinbaren
        </a>
      </div>
    </header>
  );
}
