import Image from "next/image";

const steps = [
  {
    n: "1",
    title: "Termin buchen",
    body: "Beantwortet uns einige kurze Fragen zu eurem Unternehmen und wählt einen passenden Termin.",
  },
  {
    n: "2",
    title: "Potenzial analysieren",
    body: "Gemeinsam schauen wir uns euer Angebot, eure Zielgruppe und eure aktuellen Herausforderungen an.",
  },
  {
    n: "3",
    title: "Strategie entwickeln",
    body: "Gemeinsam finden wir heraus mit welcher Botschaft und an welchen Stellen euer Film am meisten bewirken kann.",
  },
];

export function StartProcess() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          So könnt ihr mit uns starten
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
          Nicht jedes Angebot eignet sich für einen Erklärfilm. In einem
          kostenlosen Erstgespräch finden wir gemeinsam heraus, ob ein
          Erklärvideo auch für euch sinnvoll sein kann.
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="flex flex-1 overflow-hidden rounded-lg border-[3px] border-[#e7ecf4] p-4 outline outline-[0.5px] outline-[#a6adb5]"
            style={{ backgroundImage: "var(--gradient-card-dark)" }}
          >
            <div className="flex flex-1 flex-col justify-center gap-6">
              <div className="relative h-[160px] shrink-0 overflow-hidden rounded-md border border-[#eaeaea] sm:h-[190px]">
                <Image
                  src="/images/flowers.webp"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute left-3 top-2.5 flex size-8 items-center justify-center rounded-md bg-[#9e9e9e]">
                  <span className="text-sm text-white">{step.n}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.125rem,1.4vw,1.375rem)] font-semibold leading-7 text-white">
                  {step.title}
                </h3>
                <p className="text-base leading-5 text-white">{step.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
