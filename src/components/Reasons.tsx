import Image from "next/image";

const reasons = [
  { n: "#1", title: "Website ist zu alt" },
  { n: "#2", title: "Vertrieb muss besser werden" },
  { n: "#3", title: "Werbeanzeigen funktionieren nicht" },
  { n: "#4", title: "Marktlage ist schlecht" },
];

export function Reasons() {
  return (
    <section className="flex w-full flex-col items-center gap-12 rounded-[48px] p-6 md:p-12">
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
            Warum bleiben Anfragen aus?
          </h2>
          <p className="max-w-5xl font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
            Der Grund für ausbleibende Anfragen ist nicht ihr Angebot. In den
            meisten Fällen liegt es an der Art und Weise, wie sie Ihr Angebot
            präsentieren.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="relative flex h-[300px] flex-col justify-between overflow-hidden rounded-xl p-4"
            >
              <Image
                src="/images/flowers.webp"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/40" />
              <span className="relative z-10 text-[22px] leading-7 text-white">
                {reason.n}
              </span>
              <h3 className="relative z-10 text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.35] text-white">
                {reason.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
