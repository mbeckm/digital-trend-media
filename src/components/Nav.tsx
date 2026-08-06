import { CALENDLY_URL } from "@/lib/calendly";

const links = [
  { href: "#prozess", label: "Produktionsprozess" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#kunden", label: "Fallstudien" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="w-full px-5 py-5 md:px-10 md:py-6 lg:px-12">
      <div className="mx-auto flex h-10 w-full max-w-[1280px] items-center justify-between gap-3 md:gap-4">
        <a
          href="#top"
          className="min-w-0 shrink font-[family-name:var(--font-inter-tight)] text-[0.9375rem] font-bold leading-5 text-black md:text-base"
        >
          Digital Trend Media
        </a>
        <nav className="hidden items-center gap-12 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium leading-5 text-black transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 items-center rounded-full border-2 border-[#d9d9d9] px-3 text-sm font-semibold leading-5 text-black transition-[border-color,transform] hover:border-[#2b6ecb] active:scale-[0.98] md:h-10 md:px-4 md:text-base"
        >
          Termin vereinbaren
        </a>
      </div>
    </header>
  );
}
