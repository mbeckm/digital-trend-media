import { YouTubeFacade } from "@/components/YouTubeEmbed";

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
      className={`relative flex flex-1 flex-col justify-end overflow-hidden rounded-lg border border-[#c8d4e4] ${
        tall ? "min-h-[360px] lg:min-h-[560px]" : "min-h-[260px] lg:min-h-[380px]"
      }`}
    >
      <YouTubeFacade
        title={name}
        sizes={tall ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
      />
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
      className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14"
    >
      <div className="flex w-full flex-col items-start gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Geschichten unserer Kunden
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.2] text-black">
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
