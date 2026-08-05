import Image from "next/image";

const quotes = Array.from({ length: 4 }, () => ({
  quote: '"Digital Trend Media ist einfach super, ich liebe es."',
  name: "Christoph Busch",
  role: "Leiter Einkauf",
  company: "Apple",
}));

export function MoreTestimonials() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-10 md:gap-10 md:py-14">
      <div className="flex w-full flex-col gap-3 md:gap-4">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Weitere Kundenstimmen
        </h2>
        <p className="max-w-[62ch] font-[family-name:var(--font-inter-tight)] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] text-black">
          Der Grund für ausbleibende Anfragen ist nicht ihr Angebot. In den
          meisten Fällen liegt es an der Art und Weise, wie sie Ihr
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2">
        {quotes.map((item, i) => (
          <article
            key={i}
            className="relative flex min-h-[280px] items-center overflow-hidden rounded-lg border-2 border-white p-4 lg:min-h-[320px]"
          >
            <Image
              src="/images/flowers.webp"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex flex-col justify-center gap-6 rounded-2xl border border-[#e8e8e8] bg-black/25 p-4">
              <p className="text-[clamp(1.125rem,1.6vw,1.5rem)] font-semibold leading-[1.35] text-white">
                {item.quote}
              </p>
              <div className="flex flex-col gap-1">
                <p className="font-[family-name:var(--font-inter-tight)] text-[clamp(1.125rem,1.4vw,1.375rem)] font-semibold leading-7 text-white">
                  {item.name}
                </p>
                <p className="text-[clamp(1.125rem,1.4vw,1.375rem)] leading-7 text-white">
                  {item.role}
                </p>
                <p className="-mt-1 text-[clamp(1.125rem,1.4vw,1.375rem)] leading-7 text-white">
                  {item.company}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
