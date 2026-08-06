import { CauseStage, type CauseVariantId } from "@/components/cause/CauseStage";
import { SectionDek } from "@/components/SectionDek";

export function Cause({
  variant = "decision-paralysis",
}: {
  variant?: CauseVariantId;
}) {
  return (
    <section className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col items-start gap-4 md:gap-5">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Die Ursache
        </h2>
        <SectionDek
          lead="Zu viele Botschaften. Keine klare Aussage."
          rest="Website, Vertrieb, Ads, Social: überall andere Signale. Am Ende kommuniziert nichts wirklich auf den Punkt, was euer Angebot ist."
        />
      </div>
      <CauseStage variant={variant} />
    </section>
  );
}
