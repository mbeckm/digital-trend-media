import Image from "next/image";

const quotes = [
  {
    quote:
      "Unser Erklärfilm hat die Anfragen deutlich gesteigert. Komplexe Leistungen werden endlich in wenigen Minuten verständlich.",
    name: "Laura Hoffmann",
    role: "Head of Marketing",
    company: "Nova Finance",
    image: "/images/testimonials/office-1.jpg",
  },
  {
    quote:
      "Vom Kick-off bis zum fertigen Film alles klar strukturiert. Der Film läuft jetzt auf der Website und in unserem Vertrieb.",
    name: "Thomas Berger",
    role: "Geschäftsführer",
    company: "Berger Technik",
    image: "/images/testimonials/office-2.jpg",
  },
  {
    quote:
      "Wir nutzen den Film in Ads und im Onboarding. Die Conversion ist spürbar besser – und das Team spart Erklärzeit.",
    name: "Sarah Klein",
    role: "Growth Lead",
    company: "Klarpath Software",
    image: "/images/testimonials/office-3.jpg",
  },
  {
    quote:
      "Endlich eine Botschaft, die unsere Zielgruppe sofort versteht. Professionell, schnell und ohne Abstimmungs-Chaos.",
    name: "Michael Richter",
    role: "Vertriebsleiter",
    company: "Helio Systems",
    image: "/images/testimonials/office-4.jpg",
  },
];

export function MoreTestimonials() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Weitere Kundenstimmen
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
          Was unsere Kunden nach dem Launch berichten – von mehr Anfragen bis
          zu klareren Gesprächen im Vertrieb.
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2">
        {quotes.map((item) => (
          <article
            key={item.name}
            className="flex flex-col rounded-2xl border border-[#e3e8f4] bg-white p-2 shadow-[0_1px_2px_rgba(12,26,58,0.04),0_10px_28px_-16px_rgba(12,26,58,0.14)]"
          >
            <div className="relative h-[180px] overflow-hidden rounded-lg md:h-[200px]">
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 px-2 pb-2 pt-4">
              <p className="text-[clamp(1.0625rem,1.4vw,1.25rem)] font-medium leading-[1.4] tracking-[-0.01em] text-black">
                „{item.quote}“
              </p>
              <div className="mt-auto flex flex-col gap-0.5">
                <p className="font-[family-name:var(--font-inter-tight)] text-base font-semibold leading-6 text-black">
                  {item.name}
                </p>
                <p className="text-base leading-6 text-[var(--color-card-meta)]">
                  {item.role}, {item.company}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
