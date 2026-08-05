const rows = [
  {
    label: "Korrekturschleifen",
    us: "Unbegrenzte Korrekturschleifen inklusive",
    them: "1-2 Schleifen pro Phase. Danach wird es teuer.",
  },
  {
    label: "Design",
    us: "Individuell auf euer Unternehmen zugeschnitten.",
    them: "Templates und Figuren von der Stange.",
  },
  {
    label: "Drehbuch",
    us: "Entwickelt von professionellen Werbetextern und Drehbuchautoren.",
    them: "Die Story schreibt häufig der Animator gleich mit.",
  },
  {
    label: "Ergebnis",
    us: "Konzipiert für eure Marketing- und Vertriebsziele.",
    them: "Hauptsache fertig und ausgeliefert.",
  },
  {
    label: "Nach der Produktion",
    us: "Wir zeigen euch, wo und wie der Film die größte Wirkung erzielt.",
    them: "Film fertig, Datei verschickt. Was danach passiert, ist euer Problem.",
  },
];

export function Comparison() {
  return (
    <section className="flex w-full flex-col items-start gap-8 rounded-[48px] border-[7px] border-[#fcfcfd] bg-[#fbfcfe] px-6 py-10 outline outline-[3px] outline-[#edeef3] md:gap-10 md:px-10 md:py-14">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Digital Trend Media im Vergleich
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
          Das unterscheidet uns von anderen Anbietern.
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-[#dfe4f6] bg-white p-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-3 gap-6 rounded-xl bg-white p-4 md:p-5">
            <div className="text-base font-medium text-transparent">Vergleich</div>
            <div className="text-base font-bold text-black">Digital Trend Media</div>
            <div className="text-base font-bold text-black">Andere Agenturen</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 gap-6 rounded-xl p-4 md:p-5 ${
                i % 2 === 0 ? "bg-[#f7f9fd]" : "bg-white"
              }`}
            >
              <div className="text-base font-semibold text-black">{row.label}</div>
              <div className="text-base font-medium text-black">{row.us}</div>
              <div className="text-base font-medium text-black">{row.them}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
