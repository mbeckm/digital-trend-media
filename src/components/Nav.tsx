const links = [
  { href: "#prozess", label: "Produktionsprozess" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#kunden", label: "Fallstudien" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="w-full px-6 py-6 md:px-10 lg:px-12">
      <div className="mx-auto flex h-10 w-full max-w-[1280px] items-center justify-between gap-4">
        <a
          href="#top"
          className="font-[family-name:var(--font-inter-tight)] text-base font-bold leading-5 text-black"
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
          href="#kontakt"
          className="inline-flex h-10 items-center rounded-full border-2 border-[#d9d9d9] px-4 text-base font-semibold leading-5 text-black transition-[border-color,transform] hover:border-[#2b6ecb] active:scale-[0.98]"
        >
          Termin vereinbaren
        </a>
      </div>
    </header>
  );
}
