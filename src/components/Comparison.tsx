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
    <section className="flex w-full flex-col items-start gap-12 rounded-[48px] border-[7px] border-[#fcfcfd] bg-[#fbfcfe] p-6 outline outline-[3px] outline-[#edeef3] md:p-12">
      <div className="flex flex-col gap-6">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Digital Trend Media im Vergleich
        </h2>
        <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
          Das unterscheidet uns von anderen Anbietern.
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-[#dfe4f6] bg-white p-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-3 gap-8 rounded-xl bg-white p-6">
            <div className="text-lg font-medium text-transparent">Vergleich</div>
            <div className="text-lg font-bold text-black">Digital Trend Media</div>
            <div className="text-lg font-bold text-black">Andere Agenturen</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 gap-8 rounded-xl p-6 ${
                i % 2 === 0 ? "bg-[#f7f9fd]" : "bg-white"
              }`}
            >
              <div className="text-lg font-semibold text-black">{row.label}</div>
              <div className="text-lg font-medium text-black">{row.us}</div>
              <div className="text-lg font-medium text-black">{row.them}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
