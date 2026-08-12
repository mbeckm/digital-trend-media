"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import { ComicCta } from "@/components/comic/ComicUi";
import { PRIMARY_VIDEO, VimeoFacade } from "@/components/VimeoEmbed";

export function ComicNav() {
  const links = [
    { href: "#prozess", label: "Produktionsprozess" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#kunden", label: "Fallstudien" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="border-b-[3px] border-[var(--comic-ink)] bg-[var(--comic-white)]">
      <div className="comic-shell flex items-center justify-between gap-4 py-3.5 md:py-4">
        <a
          href="#top"
          className="shrink-0 text-[clamp(1rem,1.5vw,1.35rem)] font-extrabold tracking-[-0.03em] text-[var(--comic-ink)]"
        >
          Digital Trend Media
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Hauptnavigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.95rem] font-semibold tracking-[-0.03em] text-[var(--comic-ink)] transition-opacity hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ComicHeroClouds({
  scrollYProgress,
  reduceMotion,
}: {
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  // Stronger scroll travel so the parallax is obvious while leaving the hero.
  const yBack = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -95]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -40]);

  if (reduceMotion) {
    return (
      <div className="comic-hero__clouds" aria-hidden>
        <div className="comic-hero__cloud-layer comic-hero__cloud-layer--mid" />
      </div>
    );
  }

  return (
    <div className="comic-hero__clouds" aria-hidden>
      <motion.div
        className="comic-hero__cloud-layer comic-hero__cloud-layer--back"
        style={{ y: yBack }}
        animate={{ x: [-36, 36, -36] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="comic-hero__cloud-layer comic-hero__cloud-layer--mid"
        style={{ y: yMid }}
        animate={{ x: [28, -40, 28] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="comic-hero__cloud-layer comic-hero__cloud-layer--front"
        style={{ y: yFront }}
        animate={{ x: [-20, 32, -20] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function ComicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    <section id="top" ref={sectionRef} className="comic-hero">
      <ComicHeroClouds
        scrollYProgress={scrollYProgress}
        reduceMotion={reduceMotion}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[70rem] flex-col items-center gap-0">
        <div className="flex w-full flex-col items-center">
          <h1 className="comic-hero__title">Erklärvideos</h1>
          <p className="comic-hero__subtitle">
            Die verständlich machen, was du verkaufst
          </p>

          <div className="comic-hero__tag">
            ...denn Menschen kaufen nur, was sie auch verstehen
          </div>
        </div>

        <div className="comic-hero__stage">
          <div className="comic-hero__player-wrap">
            <div className="comic-hero__cast" aria-hidden>
              <Image
                src="/images/comic/scribble.png"
                alt=""
                width={1049}
                height={456}
                className="comic-hero__figurines"
                priority
              />
            </div>

            <div className="comic-hero__player">
              <VimeoFacade
                video={PRIMARY_VIDEO}
                title="Digital Trend Media Showreel"
                sizes="(max-width: 1100px) 100vw, 1112px"
              />
            </div>
          </div>
        </div>

        <ComicCta />
      </div>
    </section>
  );
}
