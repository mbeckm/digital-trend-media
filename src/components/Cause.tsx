export function Cause() {
  return (
    <section className="flex w-full flex-col items-center gap-12 p-6 md:p-12">
      <div className="flex flex-col items-center gap-6 text-left">
        <h2 className="w-full font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Die Ursache
        </h2>
        <p className="w-full font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
          Eure Zielgruppe versteht den Mehrwert eures Angebots nicht schnell
          genug.
        </p>
      </div>
      <div
        className="h-[320px] w-full shrink-0 overflow-hidden rounded-3xl sm:h-[480px] lg:h-[800px]"
        style={{ backgroundImage: "var(--gradient-cause)" }}
        aria-hidden
      />
    </section>
  );
}
