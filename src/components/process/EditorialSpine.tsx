"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ComponentType, type ReactNode } from "react";

import "./process.css";

export type SpineStep = {
  n: string;
  title: string;
  meta: string;
  body: string;
  Scene: ComponentType;
};

type EditorialSpineProps = {
  steps: SpineStep[];
  footer?: ReactNode;
};

const spring = { type: "spring" as const, duration: 0.55, bounce: 0.1 };

export function EditorialSpine({ steps, footer }: EditorialSpineProps) {
  return (
    <div className="spine">
      <div className="spine__track">
        <ol className="spine__steps">
          {steps.map((step, index) => (
            <SpineStepRow key={step.title} step={step} index={index} />
          ))}
        </ol>
      </div>
      {footer ? (
        <div className="mt-10 flex justify-center md:mt-12">{footer}</div>
      ) : null}
    </div>
  );
}

function SpineStepRow({ step, index }: { step: SpineStep; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const onScreen = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const flip = index % 2 === 1;
  const fromX = flip ? -28 : 28;

  return (
    <li
      ref={ref}
      data-in-view={onScreen}
      className={["spine__step", flip ? "spine__step--flip" : ""].join(" ")}
    >
      <motion.div
        className="spine__copy"
        initial={
          reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ ...spring, delay: 0.04 }}
      >
        <span className="spine__meta">{step.meta}</span>
        <h3 className="spine__title">{step.title}</h3>
        <p className="spine__body">{step.body}</p>
      </motion.div>

      <motion.span
        className="spine__node"
        aria-hidden
        initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={spring}
      >
        {step.n}
      </motion.span>

      <motion.div
        className="spine__media"
        initial={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 0, x: fromX, filter: "blur(4px)" }
        }
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ ...spring, delay: 0.08 }}
      >
        <step.Scene />
      </motion.div>
    </li>
  );
}
