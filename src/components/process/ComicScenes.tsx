import Image from "next/image";

import type { ProcessStepKind } from "@/components/process/data";

const kickFaces = [
  "/images/comic/character-happy.png",
  "/images/comic/character-enthusiastic.png",
  "/images/comic/character-confused.png",
  "/images/comic/character-relieved.png",
] as const;

const boardShots = [
  "/images/comic/character-happy.png",
  "/images/comic/character-enthusiastic.png",
  "/images/comic/character-relieved.png",
] as const;

export function ComicScene({ kind }: { kind: ProcessStepKind }) {
  return (
    <div className="comic-scene" data-kind={kind} aria-hidden>
      <div className="comic-scene__stage">{artFor(kind)}</div>
    </div>
  );
}

function artFor(kind: ProcessStepKind) {
  switch (kind) {
    case "kickoff":
      return <KickoffArt />;
    case "script":
      return <ScriptArt />;
    case "storyboard":
      return <BoardArt />;
    case "reel":
      return <ReelArt />;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function KickoffArt() {
  return (
    <div className="scene-kick">
      {kickFaces.map((src, index) => (
        <div
          key={src}
          className={["scene-kick__tile", index % 2 === 0 ? "is-accent" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <Image src={src} alt="" width={180} height={270} sizes="90px" />
        </div>
      ))}
    </div>
  );
}

function ScriptArt() {
  return (
    <div className="scene-script">
      <span className="scene-script__margin" />
      <span className="scene-script__row" />
      <span className="scene-script__row" />
      <span className="scene-script__row" />
      <span className="scene-script__row scene-script__row--hot" />
      <span className="scene-script__dogear" />
    </div>
  );
}

function BoardArt() {
  return (
    <div className="scene-board">
      {boardShots.map((src, index) => (
        <div key={src} className="scene-board__frame">
          <span className="scene-board__n">{index + 1}</span>
          <Image src={src} alt="" width={160} height={240} sizes="80px" />
        </div>
      ))}
    </div>
  );
}

function ReelArt() {
  return (
    <div className="scene-reel">
      <span className="scene-reel__sprocket scene-reel__sprocket--top" />
      <span className="scene-reel__play" />
      <span className="scene-reel__sprocket scene-reel__sprocket--bot" />
    </div>
  );
}
