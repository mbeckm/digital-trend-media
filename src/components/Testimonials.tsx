import Image from "next/image";

const featured = {
  name: "Anna Müller, Marketing Lead bei Google",
};

const secondary = [
  "Harald Glöckler, CEO bei Glöckler Industries",
  "Harald Glöckler, CEO bei Glöckler Industries",
];

function CaseCard({
  name,
  tall,
}: {
  name: string;
  tall?: boolean;
}) {
  return (
    <article
      className={`relative flex flex-1 flex-col justify-end overflow-hidden rounded-lg border border-[#c8d4e4] bg-cover bg-center ${
        tall ? "min-h-[420px] lg:min-h-[800px]" : "min-h-[280px] lg:min-h-[480px]"
      }`}
    >
      <Image
        src="/images/flowers.webp"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div
        className={`relative z-10 flex items-start justify-between gap-4 bg-[#f9fcff] ${
          tall ? "p-6" : "p-4"
        }`}
      >
        <p className="shrink-0 text-base font-semibold text-[#3c3d3e]">{name}</p>
        <a
          href="#kunden"
          className="shrink-0 text-base font-semibold text-[#1f4e8e] transition-opacity hover:opacity-70"
        >
          Zur Case Study →
        </a>
      </div>
    </article>
  );
}

export function Testimonials() {
  return (
    <section
      id="kunden"
      className="flex w-full flex-col items-center gap-12 rounded-[48px] p-6 md:p-12"
    >
      <div className="flex w-full flex-col items-start gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Geschichten unserer Kunden
        </h2>
        <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] text-black">
          Unsere Kunden sind glücklich
        </p>
      </div>
      <div className="flex w-full flex-col gap-6">
        <CaseCard name={featured.name} tall />
        <div className="flex flex-col gap-6 md:flex-row">
          {secondary.map((name, i) => (
            <CaseCard key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
