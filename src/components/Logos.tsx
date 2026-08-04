import Image from "next/image";

const logos = [
  { src: "/images/logo-1.png", alt: "Kundenlogo", w: 141, h: 42 },
  { src: "/images/logo-2.png", alt: "Kundenlogo", w: 150, h: 45 },
  { src: "/images/logo-3.png", alt: "Kundenlogo", w: 219, h: 41 },
  { src: "/images/logo-4.png", alt: "Kundenlogo", w: 140, h: 42 },
];

export function Logos() {
  return (
    <section className="flex w-full flex-col items-center gap-12 rounded-[48px] p-6 md:p-12">
      <h2 className="text-center text-[clamp(1.5rem,3vw,1.75rem)] font-semibold leading-[1.35] text-black">
        Mehr als 120 Unternehmen nutzen unsere Erklärfilme
      </h2>
      <div className="flex w-full flex-col gap-10">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-10"
          >
            {logos.map((logo) => (
              <Image
                key={`${row}-${logo.src}`}
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="h-10 w-auto object-contain opacity-80 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 md:h-11"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
