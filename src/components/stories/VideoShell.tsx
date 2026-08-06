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
 * Fade/duration only sit on the poster — never over the live control bar.
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
      <VimeoFacade
        video={video}
        title={title}
        sizes={sizes}
        fade={fade}
        duration={duration}
      />
    </div>
  );
}
