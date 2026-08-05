"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

/** Placeholder reels used until real customer films are available. */
export const DEMO_VIDEO_ID = "IfjM4Gy1OLA";
export const PORTFOLIO_VIDEO_ID = "MlLw7KdEyA8";

const EMBED_BASE = "https://www.youtube-nocookie.com/embed";

function embedSrc(videoId: string, params: Record<string, string>) {
  return `${EMBED_BASE}/${videoId}?${new URLSearchParams(params).toString()}`;
}

export function youTubePoster(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export function PlayIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden>
      <path
        fillRule="evenodd"
        d="M34.41 22.709L9.59 5.641L9.59 38.923L34.41 22.709Z"
        fill="#5A5A5A"
      />
    </svg>
  );
}

/** Full player with controls, mounted only once the viewer asks for it. */
export function YouTubePlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <div className="video-cover">
      <iframe
        src={embedSrc(videoId, {
          autoplay: "1",
          rel: "0",
          modestbranding: "1",
          playsinline: "1",
        })}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

/**
 * Muted, looping video used as ambient art direction. Not interactive — it sits
 * behind or beside real content, so it stays out of the tab order.
 */
export function YouTubeBackground({
  videoId = DEMO_VIDEO_ID,
  title,
}: {
  videoId?: string;
  title: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // cc_load_policy=0 is ignored when the viewer has captions on by default, so
  // the caption module is unloaded via the player API once it reports ready.
  const hideCaptions = useCallback(() => {
    const send = () => {
      const player = frameRef.current?.contentWindow;
      if (!player) return;
      for (const captionModule of ["captions", "cc"]) {
        player.postMessage(
          JSON.stringify({
            event: "command",
            func: "unloadModule",
            args: [captionModule],
          }),
          "*",
        );
      }
    };
    [0, 500, 1500, 3000].forEach((delay) => window.setTimeout(send, delay));
  }, []);

  return (
    <div className="video-cover video-cover--bleed pointer-events-none select-none">
      <iframe
        ref={frameRef}
        onLoad={hideCaptions}
        src={embedSrc(videoId, {
          autoplay: "1",
          mute: "1",
          loop: "1",
          playlist: videoId,
          controls: "0",
          modestbranding: "1",
          rel: "0",
          playsinline: "1",
          disablekb: "1",
          iv_load_policy: "3",
          cc_load_policy: "0",
          enablejsapi: "1",
        })}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}

/**
 * Click-to-play thumbnail. The iframe is only mounted after interaction so a
 * page full of case studies doesn't load a player per card.
 */
export function YouTubeFacade({
  videoId = DEMO_VIDEO_ID,
  title,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  videoId?: string;
  title: string;
  sizes?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <YouTubePlayer videoId={videoId} title={title} />;
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Video abspielen: ${title}`}
      className="group absolute inset-0 block h-full w-full cursor-pointer"
    >
      <Image
        src={youTubePoster(videoId)}
        alt=""
        fill
        className="object-cover"
        sizes={sizes}
      />
      <span className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_6px_24px_#00142e4d] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        <PlayIcon />
      </span>
    </button>
  );
}
