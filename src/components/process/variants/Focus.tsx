"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ComicProcessSection } from "@/components/process/ComicProcessSection";
import { ComicScene } from "@/components/process/ComicScenes";
import { PROCESS_STEPS } from "@/components/process/data";

export function FocusProcess() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const skipFocus = useRef(true);

  useEffect(() => {
    if (skipFocus.current) {
      skipFocus.current = false;
      return;
    }
    tabRefs.current[active]?.focus();
  }, [active]);

  const moveTo = (index: number) => {
    const count = PROCESS_STEPS.length;
    setActive(((index % count) + count) % count);
  };

  return (
    <ComicProcessSection>
      <div className="comic-process-focus">
        <div
          className="comic-process-focus__tabs"
          role="tablist"
          aria-label="Produktionsschritte"
        >
          {PROCESS_STEPS.map((step, index) => {
            const selected = index === active;
            return (
              <button
                key={step.kind}
                type="button"
                role="tab"
                id={`process-tab-${step.kind}`}
                aria-selected={selected}
                aria-controls={`process-panel-${step.kind}`}
                tabIndex={selected ? 0 : -1}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                className={["comic-process-focus__tab", selected ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    event.preventDefault();
                    moveTo(index + 1);
                  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    moveTo(index - 1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    moveTo(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    moveTo(PROCESS_STEPS.length - 1);
                  }
                }}
              >
                <span className="comic-process-focus__tab-top">
                  <span className="comic-process-n">{step.n}</span>
                  <span className="comic-process-chip">{step.meta}</span>
                </span>
                <span className="comic-process-focus__tab-title">{step.title}</span>
              </button>
            );
          })}
        </div>

        <div className="comic-process-focus__stage">
          <div className="comic-process-focus__sizer" aria-hidden>
            {PROCESS_STEPS.map((step) => (
              <div key={step.kind} className="comic-process-focus__body-stack">
                <FocusBody step={step} />
              </div>
            ))}
          </div>
          {PROCESS_STEPS.map((step, index) => {
            const selected = index === active;
            return (
              <motion.div
                key={step.kind}
                role="tabpanel"
                id={`process-panel-${step.kind}`}
                aria-labelledby={`process-tab-${step.kind}`}
                aria-hidden={!selected}
                className={[
                  "comic-process-focus__layer",
                  selected ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                initial={false}
                animate={
                  reduceMotion
                    ? { opacity: selected ? 1 : 0 }
                    : { opacity: selected ? 1 : 0, y: selected ? 0 : 14 }
                }
                transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                style={{ pointerEvents: selected ? "auto" : "none" }}
              >
                <div className="comic-process-focus__body-stack">
                  <FocusBody step={step} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ComicProcessSection>
  );
}

function FocusBody({ step }: { step: (typeof PROCESS_STEPS)[number] }) {
  return (
    <>
      <ComicScene kind={step.kind} />
      <div className="comic-process-focus__copy">
        <div className="comic-process-focus__copy-top">
          <span className="comic-process-n">{step.n}</span>
          <span className="comic-process-chip">{step.meta}</span>
        </div>
        <h3 className="comic-process-focus__title">{step.title}</h3>
        <p className="comic-process-focus__body">{step.body}</p>
      </div>
    </>
  );
}
