import Link from "next/link";

export function BrandLabBanner({
  active,
}: {
  active: "playful" | "clouds";
}) {
  return (
    <div className="border-b-[2.5px] border-[var(--bl-ink)] bg-[var(--bl-yellow)] px-[var(--bl-gutter)] py-2.5">
      <div className="mx-auto flex w-full max-w-[var(--bl-container)] flex-wrap items-center justify-between gap-3 text-sm font-semibold">
        <p className="bl-display tracking-[-0.01em]">
          Art-direction preview · Nav · Hero · Work · Proof
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <nav
            aria-label="Richtungs-Varianten"
            className="flex items-center gap-1 rounded-[var(--bl-radius-sm)] border-[2px] border-[var(--bl-ink)] bg-white/70 p-0.5"
          >
            <Link
              href="/brand-lab"
              className={`rounded-[7px] px-2.5 py-1 text-xs font-bold transition-colors ${
                active === "playful"
                  ? "bg-[var(--bl-ink)] text-white"
                  : "text-[var(--bl-ink)] hover:bg-black/5"
              }`}
            >
              Playful
            </Link>
            <Link
              href="/brand-lab/clouds"
              className={`rounded-[7px] px-2.5 py-1 text-xs font-bold transition-colors ${
                active === "clouds"
                  ? "bg-[var(--bl-ink)] text-white"
                  : "text-[var(--bl-ink)] hover:bg-black/5"
              }`}
            >
              Clouds + Cast
            </Link>
          </nav>
          <Link
            href="/"
            className="underline decoration-2 underline-offset-2 hover:text-[var(--bl-blue)]"
          >
            ← Zur aktuellen Site
          </Link>
        </div>
      </div>
    </div>
  );
}
