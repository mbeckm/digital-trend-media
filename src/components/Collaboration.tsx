import Image from "next/image";

const steps = [
  {
    n: "1",
    title: "Kick Off",
    body: "Gemeinsam mit euch entwickeln wir Ideen für die Story des Erklärfilms. Erzählt unserem Creative-Director von eurer Geschichte, euren Zielsetzungen und USPs.\n\nEuer Zeitaufwand: ca. 30 min",
  },
  {
    n: "2",
    title: "Drehbuch",
    body: "Die besten Drehbuchautoren Deutschlands schreiben nun das Drehbuch eures zukünftigen Erklärfilms. Als Grundgerüst dient unsere bewährte Conversion-Strategie.\n\nEuer Zeitaufwand: ca. 60 min",
  },
  {
    n: "3",
    title: "Storyboard",
    body: "Nun werden aus Wörtern - Bilder! Durch das Storyboard bekommt ihr einen genauen Eindruck vom Stil des Videos.\n\nEuer Zeitaufwand: ca. 30 min",
  },
  {
    n: "4",
    title: "Animation",
    body: "Seid ihr mit allem zu 100% zufrieden, werden die Bilder animiert. Hinzu kommt ein professionelles Voice Over, erstklassiges Sound Design und Hintergrundmusik.\n\nEuer Zeitaufwand: ca. 30 min",
  },
];

export function Collaboration() {
  return (
    <section
      id="prozess"
      className="flex w-full flex-col items-center gap-12 rounded-[48px] p-6 md:p-12"
    >
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          So läuft die Zusammenarbeit ab
        </h2>
        <p className="max-w-5xl font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
          Nicht jedes Angebot eignet sich für einen Erklärfilm. In einem
          kostenlosen Erstgespräch finden wir gemeinsam heraus, ob ein
          Erklärvideo auch für euch sinnvoll sein kann.
        </p>
      </div>
      <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <article key={step.title} className="flex flex-1 flex-col gap-4">
            <div className="relative h-[180px] shrink-0 overflow-hidden rounded-md sm:h-[219px]">
              <Image
                src="/images/flowers.webp"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute left-3 top-2.5 flex size-8 items-center justify-center rounded-md bg-[#c8c8c8]">
                <span className="text-sm text-white">{step.n}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[22px] leading-7 text-black">{step.title}</h3>
              <p className="whitespace-pre-wrap text-base leading-5 text-black">
                {step.body}
              </p>
            </div>
          </article>
        ))}
      </div>
      <a
        href="#kontakt"
        className="inline-flex min-h-[82px] min-w-[240px] items-center justify-center rounded-full border-[3px] border-[#e5f0ff] px-12 py-6 text-[22px] font-semibold text-white outline outline-[0.3px] outline-[#cbcfd7] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_0_20px_#00142e52] active:scale-[0.98] md:min-w-[381px]"
        style={{
          backgroundImage: "var(--gradient-blue)",
          boxShadow: "0 0 10px #00142e52",
        }}
      >
        Projekt beantragen
      </a>
    </section>
  );
}
