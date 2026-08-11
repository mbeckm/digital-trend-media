export function ComicFooter() {
  return (
    <footer className="comic-footer">
      <p className="max-w-[10ch] text-[clamp(2.5rem,6vw,5rem)] font-black tracking-[-0.05em] leading-[1.15] text-[var(--comic-white)]">
        Digital Trend Media
      </p>

      <div className="flex flex-wrap gap-8 md:gap-10">
        <div className="flex flex-col gap-5 md:gap-8">
          <a href="#impressum">Impressum</a>
          <a href="#datenschutz">Datenschutzerklärung</a>
          <a href="#agb">AGB</a>
        </div>
        <div className="comic-footer__contact flex flex-col gap-5 md:gap-8">
          <a href="mailto:hallo@digitaltrendmedia.de">
            hallo@digitaltrendmedia.de
          </a>
          <a href="tel:+4915788954581">+49 15788954581</a>
        </div>
      </div>
    </footer>
  );
}
