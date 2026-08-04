import Image from "next/image";

const benefits = [
  "Komplexes einfach erklärt",
  "Mehr Anfragen",
  "Kürzere Vertriebszyklen",
];

export function Hero() {
  return (
    <section
      id="top"
      className="animate-fade-up flex w-full flex-col items-center gap-12 rounded-[48px] p-6 outline outline-4 outline-[#f3f4f7] md:p-12"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.025em] text-black">
            Komplexes.
          </h1>
          <p
            className="-mt-2 bg-clip-text font-[family-name:var(--font-inter-tight)] text-[clamp(3rem,10vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.025em] text-transparent"
            style={{ backgroundImage: "var(--gradient-blue-text)" }}
          >
            Einfach erklärt.
          </p>
        </div>
        <p className="max-w-[52rem] text-center text-[clamp(1.125rem,2vw,1.75rem)] font-semibold leading-[1.35] text-black">
          Digital Trend Media macht Erklärfilme, die eure Zielgruppe von eurem
          Angebot begeistern.
          <br className="hidden sm:block" />
          Denn Menschen kaufen nur, was sie auch verstehen.
        </p>
      </div>

      <div className="animate-fade-up delay-2 relative h-[240px] w-full overflow-hidden rounded-3xl sm:h-[360px] lg:h-[476px]">
        <Image
          src="/images/flowers.webp"
          alt="Gelbe Blumen vor hellem Himmel"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1176px"
        />
      </div>

      <a
        id="kontakt"
        href="#kontakt"
        className="animate-fade-up delay-3 inline-flex min-h-[82px] min-w-[240px] items-center justify-center rounded-full border-[3px] border-[#e5f0ff] px-12 py-6 text-[22px] font-semibold text-white outline outline-[0.3px] outline-[#cbcfd7] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_0_28px_#00142e55] active:translate-y-0 active:scale-[0.98] md:min-w-[381px]"
        style={{
          backgroundImage: "var(--gradient-blue)",
          boxShadow: "var(--shadow-cta)",
        }}
      >
        Kostenloses Erstgespräch
      </a>

      <div className="animate-fade-up delay-4 flex w-full flex-col items-center justify-between gap-4 px-0 sm:flex-row sm:gap-4 sm:px-8 lg:px-20">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2">
            <div className="relative size-[50px] shrink-0 overflow-hidden rounded-md">
              <Image
                src="/images/flowers.webp"
                alt=""
                fill
                className="object-cover"
                sizes="50px"
              />
            </div>
            <span className="text-center text-[22px] font-semibold leading-7 text-black">
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
