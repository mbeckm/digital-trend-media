import { CauseStage, type CauseVariantId } from "@/components/cause/CauseStage";
import { SectionHeader } from "@/components/SectionHeader";

export function Cause({
  variant = "decision-paralysis",
}: {
  variant?: CauseVariantId;
}) {
  return (
    <section className="flex w-full flex-col items-stretch gap-8 py-10 md:gap-10 md:py-14">
      <SectionHeader
        title="Die Ursache"
        lead="Zu viele Botschaften. Keine klare Aussage."
        rest="Website, Vertrieb, Ads, Social: überall andere Signale. Am Ende kommuniziert nichts wirklich auf den Punkt, was euer Angebot ist."
      />
      <CauseStage variant={variant} />
    </section>
  );
}
