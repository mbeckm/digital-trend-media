const columns = [
  ["Produktionsprozess", "Portfolio", "Fallstudien", "FAQ", "Kontakt"],
  ["Über uns", "Karriere", "Blog", "Presse", "Partner"],
  ["Impressum", "Datenschutz", "AGB", "LinkedIn", "Instagram"],
];

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-start justify-between gap-10 bg-[#2b6ecb] p-6 md:flex-row md:gap-4">
      <div className="flex flex-col items-start">
        <p className="font-[family-name:var(--font-inter-tight)] text-[22px] font-semibold leading-7 text-[#fafafa]">
          Digital Trend Media
        </p>
      </div>
      {columns.map((col, i) => (
        <div key={i} className="flex flex-col items-start justify-center gap-2">
          {col.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[#fafafa] transition-opacity hover:opacity-70"
            >
              {label}
            </a>
          ))}
        </div>
      ))}
    </footer>
  );
}
