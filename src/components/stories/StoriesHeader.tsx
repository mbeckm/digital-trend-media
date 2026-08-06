import { SectionDek } from "@/components/SectionDek";

export function StoriesHeader({
  align = "start",
}: {
  align?: "start" | "center";
}) {
  return (
    <div
      className={`flex w-full max-w-[48rem] flex-col gap-5 md:gap-6 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-balance text-black">
        Geschichten unserer Kunden
      </h2>
      <SectionDek
        align={align}
        lead="Echte Ergebnisse. Keine leeren Versprechen."
        rest="Wir haben für unsere Kunden aus komplizierten Leistungen greifbare Botschaften gemacht."
      />
    </div>
  );
}
