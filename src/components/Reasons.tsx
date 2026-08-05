import { ReasonsGrid } from "@/components/reasons/ReasonsGrid";

export function Reasons() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
            Warum bleiben Anfragen aus?
          </h2>
          <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
            Der Grund für ausbleibende Anfragen ist nicht ihr Angebot. In den
            meisten Fällen liegt es an der Art und Weise, wie sie Ihr Angebot
            präsentieren.
          </p>
        </div>
        <ReasonsGrid />
      </div>
    </section>
  );
}
