"use client";

import { VimeoFacade, type VimeoVideo } from "@/components/VimeoEmbed";

type VideoShellProps = {
  title: string;
  video: VimeoVideo;
  duration?: string;
  sizes?: string;
  className?: string;
  /** Soft gradient at the bottom so overlays stay readable. */
  fade?: boolean;
};

/**
 * Relative frame for VimeoFacade. Keeps play + poster isolated from
 * surrounding links so cards can link to the case study page.
 */
export function VideoShell({
  title,
  video,
  duration,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  fade = false,
}: VideoShellProps) {
  return (
    <div
      className={`relative isolate overflow-hidden bg-[#0c1a3a] outline outline-1 outline-black/10 ${className}`}
    >
      <VimeoFacade video={video} title={title} sizes={sizes} />
      {fade ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-black/55 to-transparent"
        />
      ) : null}
      {duration ? (
        <span className="pointer-events-none absolute bottom-3 right-3 z-[2] rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white tabular-nums backdrop-blur-sm">
          {duration}
        </span>
      ) : null}
    </div>
  );
}
