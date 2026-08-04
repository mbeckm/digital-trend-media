import Image from "next/image";

const quotes = Array.from({ length: 4 }, () => ({
  quote: '"Digital Trend Media ist einfach super, ich liebe es."',
  name: "Christoph Busch",
  role: "Leiter Einkauf",
  company: "Apple",
}));

export function MoreTestimonials() {
  return (
    <section className="flex w-full flex-col items-center gap-12 rounded-[48px] p-6 md:p-12">
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-black">
          Weitere Kundenstimmen
        </h2>
        <p className="max-w-5xl font-[family-name:var(--font-inter-tight)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.35] text-black">
          Der Grund für ausbleibende Anfragen ist nicht ihr Angebot. In den
          meisten Fällen liegt es an der Art und Weise, wie sie Ihr
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2">
        {quotes.map((item, i) => (
          <article
            key={i}
            className="relative flex min-h-[320px] items-center overflow-hidden rounded-lg border-2 border-white p-4 lg:min-h-[378px]"
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
              <p className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.35] text-white">
                {item.quote}
              </p>
              <div className="flex flex-col gap-1">
                <p className="font-[family-name:var(--font-inter-tight)] text-[22px] font-semibold leading-7 text-white">
                  {item.name}
                </p>
                <p className="text-[22px] leading-7 text-white">{item.role}</p>
                <p className="-mt-1 text-[22px] leading-7 text-white">
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
