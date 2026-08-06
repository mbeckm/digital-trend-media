"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type VimeoVideo = {
  id: string;
  hash?: string;
};

/** Hero / showreel — last video in the client doc. */
export const PRIMARY_VIDEO: VimeoVideo = {
  id: "558966248",
  hash: "c04f295b02",
};

const EMBED_BASE = "https://player.vimeo.com/video";

export function vimeoPosterSrc(video: VimeoVideo) {
  const params = new URLSearchParams({ id: video.id });
  if (video.hash) params.set("hash", video.hash);
  return `/api/vimeo-poster?${params.toString()}`;
}

function embedSrc(video: VimeoVideo, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  if (video.hash) query.set("h", video.hash);
  return `${EMBED_BASE}/${video.id}?${query.toString()}`;
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

const chromeParams = {
  controls: "1",
  title: "0",
  byline: "0",
  portrait: "0",
  dnt: "1",
} as const;

/** Full player with controls. Fits the frame so the control bar stays visible. */
export function VimeoPlayer({
  video,
  title,
  autoplay = true,
  muted = false,
  loop = false,
}: {
  video: VimeoVideo;
  title: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}) {
  return (
    <div className="video-frame">
      <iframe
        src={embedSrc(video, {
          ...chromeParams,
          autoplay: autoplay ? "1" : "0",
          muted: muted ? "1" : "0",
          loop: loop ? "1" : "0",
          autopause: "0",
        })}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

/**
 * Hero showreel: autoplay muted with real Vimeo controls (play, seek, unmute).
 * Mounts only while near the viewport so decode doesn't stack with WebGL.
 */
export function VimeoHeroPlayer({
  video = PRIMARY_VIDEO,
  title,
}: {
  video?: VimeoVideo;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const play = near && pageVisible;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let leaveTimer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = Boolean(entries[0]?.isIntersecting);
        if (visible) {
          if (leaveTimer) {
            window.clearTimeout(leaveTimer);
            leaveTimer = 0;
          }
          setNear(true);
        } else {
          leaveTimer = window.setTimeout(() => {
            setNear(false);
            leaveTimer = 0;
          }, 600);
        }
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );
    io.observe(host);

    return () => {
      io.disconnect();
      if (leaveTimer) window.clearTimeout(leaveTimer);
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      setPageVisible(document.visibilityState !== "hidden");
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div ref={hostRef} className="video-frame">
      <Image
        src={vimeoPosterSrc(video)}
        alt=""
        fill
        unoptimized
        priority
        className="object-cover"
        sizes="100vw"
      />
      {play ? (
        <iframe
          src={embedSrc(video, {
            ...chromeParams,
            autoplay: "1",
            muted: "1",
            loop: "1",
            autopause: "0",
          })}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : null}
    </div>
  );
}

/**
 * Click-to-play thumbnail. The iframe is only mounted after interaction so a
 * page full of case studies doesn't load a player per card.
 */
export function VimeoFacade({
  video,
  title,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fade = false,
  duration,
}: {
  video: VimeoVideo;
  title: string;
  sizes?: string;
  fade?: boolean;
  duration?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <VimeoPlayer video={video} title={title} />;
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Video abspielen: ${title}`}
      className="group absolute inset-0 block h-full w-full cursor-pointer"
    >
      <Image
        src={vimeoPosterSrc(video)}
        alt=""
        fill
        unoptimized
        className="object-cover"
        sizes={sizes}
      />
      <span className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
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
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white smooth-shadow-lg shadow-[#00142e] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        <PlayIcon />
      </span>
    </button>
  );
}
