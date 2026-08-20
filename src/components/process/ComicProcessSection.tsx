import type { ReactNode } from "react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";
import { PROCESS_COPY } from "@/components/process/data";
import "./comic-process.css";

export function ComicProcessSection({ children }: { children: ReactNode }) {
  return (
    <section className="comic-process" id="prozess">
      <div className="comic-shell comic-process__inner">
        <ComicSectionIntro title={PROCESS_COPY.title} lead={PROCESS_COPY.lead} />
        {children}
        <div className="comic-process__foot">
          <p className="comic-process__foot-copy">Lasst uns starten.</p>
          <ComicCta className="!mt-0" />
        </div>
      </div>
    </section>
  );
}
