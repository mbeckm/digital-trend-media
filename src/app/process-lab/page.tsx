"use client";

import { useState } from "react";

import {
  PROCESS_VARIANTS,
  ProcessStage,
  type ProcessVariantId,
} from "@/components/process/ProcessStage";

export default function ProcessLabPage() {
  const [active, setActive] = useState<ProcessVariantId>("pages");
  const current =
    PROCESS_VARIANTS.find((item) => item.id === active) ?? PROCESS_VARIANTS[0];

  return (
    <div className="comic comic-process-lab">
      <div className="comic-shell comic-process-lab__top">
        <p className="comic-process-lab__kicker">Process lab</p>
        <h1>Produktionsprozess</h1>
        <p>
          Dieselben vier Schritte wie auf der alten Seite, in der Comic-Sprache.
          Drei Layouts zum Vergleichen.
        </p>
        <div className="comic-process-lab__links">
          <a href="/">Homepage</a>
          <a href="/classic#prozess">Alte Version</a>
        </div>
      </div>

      <div className="comic-shell">
        <div className="comic-process-lab__tabs" role="tablist" aria-label="Layout-Varianten">
          {PROCESS_VARIANTS.map((variant) => {
            const selected = variant.id === active;
            return (
              <button
                key={variant.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={["comic-process-lab__tab", selected ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActive(variant.id)}
              >
                {variant.label}
              </button>
            );
          })}
        </div>
        <p className="comic-process-lab__blurb">{current.blurb}</p>
      </div>

      <ProcessStage variant={active} />
    </div>
  );
}
