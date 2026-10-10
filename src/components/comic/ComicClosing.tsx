import Image from "next/image";

import { ComicCta } from "@/components/comic/ComicUi";

/** Last call to action before the footer, set in the recording studio. */
export function ComicClosing() {
  return (
    <section className="comic-closing">
      <Image
        src="/images/studio/studio-recording.webp"
        alt=""
        fill
        sizes="100vw"
        className="comic-closing__bg"
      />
      <div className="comic-shell comic-closing__inner">
        <h2 className="comic-closing__title">
          Lass uns dein Angebot verständlich machen.
        </h2>
        <p className="comic-closing__lead">
          30 Minuten, unverbindlich. Wir hören zu und sagen dir ehrlich, ob ein
          Erklärfilm für dich Sinn ergibt.
        </p>
        <ComicCta className="!mt-2" />
      </div>
    </section>
  );
}
