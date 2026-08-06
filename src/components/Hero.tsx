"use client";

import { useEffect, useRef } from "react";

import { CloudsVolumetric } from "@/components/clouds/CloudsVolumetric";
import { YouTubeBackground } from "@/components/YouTubeEmbed";

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    // Feature-detect CSS scroll-driven animations. If supported, CSS handles it.
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: scroll()");

    if (supportsScrollTimeline) {
      media.classList.add("hero-media--css-scroll");
      return;
    }

    // JS fallback for browsers without scroll-driven animations.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      if (reduceMotion.matches) {
        media.style.setProperty("--hero-p", "1");
        return;
      }
      const distance = Math.max(window.innerHeight * 0.4, 260);
      const p = Math.min(1, Math.max(0, window.scrollY / distance));
      media.style.setProperty("--hero-p", p.toFixed(4));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative isolate flex w-full flex-col items-center gap-8 overflow-hidden py-10 md:gap-10 md:py-14"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <CloudsVolumetric className="-z-10" />

      <div className="w-full px-6 md:px-12">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-[family-name:var(--font-inter-tight)] text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.025em] text-black">
              Komplexes.
            </h1>
            <p
              className="-mt-2 bg-clip-text font-[family-name:var(--font-inter-tight)] text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.025em] text-transparent"
              style={{ backgroundImage: "var(--gradient-blue-text)" }}
            >
              Einfach erklärt.
            </p>
          </div>
          <p className="mx-auto max-w-[40rem] text-pretty text-center font-[family-name:var(--font-inter-tight)] text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.015em] text-black">
            Menschen kaufen nur, was sie auch verstehen. Wir machen Erklärfilme,
            die eure Zielgruppe begeistern und aus Interesse Anfragen machen.
          </p>
        </div>
      </div>

      <a id="kontakt" href="#kontakt" className="hero-cta">
        Kostenloses Erstgespräch
      </a>

      <div className="flex w-full justify-center">
        <div ref={mediaRef} className="hero-media relative overflow-hidden">
          <YouTubeBackground title="Digital Trend Media Showreel" />
        </div>
      </div>
    </section>
  );
}
