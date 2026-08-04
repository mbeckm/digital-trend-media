const links = [
  { href: "#prozess", label: "Produktionsprozess" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#kunden", label: "Fallstudien" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="flex w-full items-center justify-between gap-4 px-1 py-6">
      <a
        href="#top"
        className="font-[family-name:var(--font-inter-tight)] text-base font-bold text-black"
      >
        Digital Trend Media
      </a>
      <nav className="hidden items-start gap-12 md:flex">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-base font-medium text-black transition-opacity hover:opacity-60"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="#kontakt"
        className="rounded-full border-2 border-[#d9d9d9] px-4 py-2 text-base font-semibold text-black transition-[border-color,transform] hover:border-[#2b6ecb] active:scale-[0.98]"
      >
        Termin vereinbaren
      </a>
    </header>
  );
}
