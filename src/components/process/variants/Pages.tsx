"use client";

import { useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ComicProcessSection } from "@/components/process/ComicProcessSection";
import { ComicScene } from "@/components/process/ComicScenes";
import { PROCESS_STEPS, type ProcessStep } from "@/components/process/data";

export function PagesProcess() {
  return (
    <ComicProcessSection>
      <RevealGroup className="comic-process-pages" stagger={0.08}>
        {PROCESS_STEPS.map((step) => (
          <RevealItem key={step.kind}>
            <PagePanel step={step} />
          </RevealItem>
        ))}
      </RevealGroup>
    </ComicProcessSection>
  );
}

function PagePanel({ step }: { step: ProcessStep }) {
  const ref = useRef<HTMLElement>(null);
  const onScreen = useInView(ref, { margin: "-12% 0px -12% 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <article
      ref={ref}
      data-in-view={onScreen}
      className="comic-process-page"
      style={
        {
          "--page-tilt": reduceMotion ? "0deg" : `${step.tilt}deg`,
        } satisfies CSSProperties & { "--page-tilt": string }
      }
    >
      <div className="comic-process-page__head">
        <span className="comic-process-n comic-process-page__n">{step.n}</span>
        <span className="comic-process-chip">{step.meta}</span>
      </div>
      <ComicScene kind={step.kind} />
      <h3 className="comic-process-page__title">{step.title}</h3>
      <p className="comic-process-page__body">{step.body}</p>
    </article>
  );
}
