import { FocusProcess } from "@/components/process/variants/Focus";
import { PagesProcess } from "@/components/process/variants/Pages";
import { SpineProcess } from "@/components/process/variants/Spine";

export const PROCESS_VARIANTS = [
  {
    id: "pages",
    label: "A · Pages",
    blurb: "Vier Panels auf einer Comic-Seite. Der Prozess als Strip, auf einen Blick.",
    Scene: PagesProcess,
  },
  {
    id: "focus",
    label: "B · Focus",
    blurb: "Ein Schritt nach dem anderen. Links die Stempel, rechts die große Tafel.",
    Scene: FocusProcess,
  },
  {
    id: "spine",
    label: "C · Spine",
    blurb: "Die alte Zickzack-Linie, neu gezeichnet. Abwechselnd Text und Bild.",
    Scene: SpineProcess,
  },
] as const;

export type ProcessVariantId = (typeof PROCESS_VARIANTS)[number]["id"];

export function ProcessStage({
  variant = "pages",
}: {
  variant?: ProcessVariantId;
}) {
  const active =
    PROCESS_VARIANTS.find((item) => item.id === variant) ?? PROCESS_VARIANTS[0];
  const { Scene } = active;
  return <Scene key={active.id} />;
}
