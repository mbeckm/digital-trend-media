"use client";

import Image from "next/image";
import { useState } from "react";

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

/** Full player with controls, mounted only once the viewer asks for it. */
export function VimeoPlayer({
  video,
  title,
}: {
  video: VimeoVideo;
  title: string;
}) {
  return (
    <div className="video-cover">
      <iframe
        src={embedSrc(video, {
          autoplay: "1",
          autopause: "0",
          title: "0",
          byline: "0",
          portrait: "0",
          dnt: "1",
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
 * Muted, looping video used as ambient art direction. Not interactive — it sits
 * behind or beside real content, so it stays out of the tab order.
 */
export function VimeoBackground({
  video = PRIMARY_VIDEO,
  title,
}: {
  video?: VimeoVideo;
  title: string;
}) {
  return (
    <div className="video-cover video-cover--bleed pointer-events-none select-none">
      <iframe
        src={embedSrc(video, {
          background: "1",
          autoplay: "1",
          muted: "1",
          loop: "1",
          autopause: "0",
          title: "0",
          byline: "0",
          portrait: "0",
          dnt: "1",
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
export function VimeoFacade({
  video,
  title,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  video: VimeoVideo;
  title: string;
  sizes?: string;
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
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white smooth-shadow-lg shadow-[#00142e] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        <PlayIcon />
      </span>
    </button>
  );
}
