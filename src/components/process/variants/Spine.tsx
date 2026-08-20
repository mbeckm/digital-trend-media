"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { easeOut } from "@/components/motion/reveal";
import { ComicProcessSection } from "@/components/process/ComicProcessSection";
import { ComicScene } from "@/components/process/ComicScenes";
import { PROCESS_STEPS, type ProcessStep } from "@/components/process/data";

const softTween = { duration: 0.7, ease: easeOut };

export function SpineProcess() {
  return (
    <ComicProcessSection>
      <ol className="comic-spine__steps comic-spine">
        {PROCESS_STEPS.map((step, index) => (
          <SpineRow key={step.kind} step={step} index={index} />
        ))}
      </ol>
    </ComicProcessSection>
  );
}

function SpineRow({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const onScreen = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const flip = index % 2 === 1;

  return (
    <li
      ref={ref}
      data-in-view={onScreen}
      className={["comic-spine__step", flip ? "is-flip" : ""].filter(Boolean).join(" ")}
    >
      <motion.div
        className="comic-spine__copy"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ ...softTween, delay: 0.04 }}
      >
        <span className="comic-process-chip">{step.meta}</span>
        <h3 className="comic-spine__title">{step.title}</h3>
        <p className="comic-spine__body">{step.body}</p>
      </motion.div>

      <motion.span
        className="comic-process-n comic-spine__node"
        aria-hidden
        initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ type: "spring", duration: 0.55, bounce: 0.1 }}
      >
        {step.n}
      </motion.span>

      <motion.div
        className="comic-spine__media"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ ...softTween, delay: 0.08 }}
      >
        <ComicScene kind={step.kind} />
      </motion.div>
    </li>
  );
}
