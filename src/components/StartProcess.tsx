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
    <section className="flex w-full flex-col items-center gap-12 rounded-[48px] p-6 md:p-12">
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          So könnt ihr mit uns starten
        </h2>
        <p className="max-w-5xl font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
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
              <div className="relative h-[180px] shrink-0 overflow-hidden rounded-md border border-[#eaeaea] sm:h-[219px]">
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
                <h3 className="font-[family-name:var(--font-inter-tight)] text-[22px] font-semibold leading-7 text-white">
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
