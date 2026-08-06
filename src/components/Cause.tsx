import { CauseStage, type CauseVariantId } from "@/components/cause/CauseStage";

export function Cause({
  variant = "decision-paralysis",
}: {
  variant?: CauseVariantId;
}) {
  return (
    <section className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col items-start gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Die Ursache
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
          Eure Zielgruppe versteht den Mehrwert eures Angebots nicht schnell
          genug.
        </p>
      </div>
      <CauseStage variant={variant} />
    </section>
  );
}
