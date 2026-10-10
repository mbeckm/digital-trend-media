"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const symptoms = [
  {
    image: "/images/card-flip/card-3-front.png",
    title: "Geringe Aufmerksamkeitsspanne",
    note: "Im Schnitt bleiben Besucher nur 7 Sekunden",
  },
  {
    image: "/images/card-flip/card-1-front.png",
    title: "Zu viel Text",
    note: "Überfordert, statt zu überzeugen",
  },
  {
    image: "/images/card-flip/card-2-front.png",
    title: "Offene Rückfragen",
    note: "Wer zweifelt, klickt weg",
  },
] as const;

const outcomes = [
  {
    image: "/images/card-flip/card-1-back.png",
    title: "In 90 Sekunden verstanden",
  },
  {
    image: "/images/card-flip/card-2-back.png",
    title: "Persönlich statt anonym",
  },
  {
    image: "/images/card-flip/card-3-back.png",
    title: "Einwände vorab beantwortet",
  },
] as const;

/**
 * Symptom → Diagnose → Lösung, staged like three scenes on an edit
 * timeline. The pink playhead on the rail follows scroll progress.
 */
export function ComicDiagnosis() {
  const scenesRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scenesRef,
    offset: ["start 0.7", "end 0.6"],
  });

  return (
    <section id="diagnose" className="comic-diagnosis">
      <div className="comic-shell flex flex-col items-center gap-14 md:gap-20">
        <ComicSectionIntro
          light
          eyebrow="Kennst du das?"
          title="Starkes Angebot. Trotzdem zu wenige Anfragen."
          lead="Woran das liegt – und wie ein Erklärfilm genau dort ansetzt."
        />

        <ol ref={scenesRef} className="comic-diagnosis__scenes">
          <span className="comic-diagnosis__rail" aria-hidden>
            <motion.span
              className="comic-diagnosis__playhead"
              style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
            />
          </span>

          <Scene
            n="01"
            timecode="00:00:00"
            label="Symptom"
            title="Besucher kommen und gehen wieder."
            body="Dein Angebot ist fantastisch. Trotzdem melden sich zu wenige Interessenten. Die typischen Anzeichen:"
          >
            <ul className="comic-diagnosis__symptoms">
              {symptoms.map((item) => (
                <li key={item.title} className="comic-diagnosis__symptom">
                  <Image
                    src={item.image}
                    alt=""
                    width={224}
                    height={140}
                    className="comic-diagnosis__thumb"
                  />
                  <div>
                    <p className="comic-diagnosis__symptom-title">
                      {item.title}
                    </p>
                    <p className="comic-diagnosis__symptom-note">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Scene>

          <Scene
            n="02"
            timecode="00:00:30"
            label="Diagnose"
            title="Im Gespräch überzeugst du. Online fehlt die Zeit."
            body="Sprichst du mit Interessenten, werden sie fast immer zu Kunden – weil du Zeit hast, den Mehrwert deines Angebots zu erklären. Deine Website bekommt diese Zeit nicht."
          >
            <div className="comic-diagnosis__edit" aria-label="Vergleich: Gespräch 30 Minuten, Website 7 Sekunden">
              <div className="comic-diagnosis__ruler" aria-hidden>
                <span>00:00</span>
                <span>10:00</span>
                <span>20:00</span>
                <span>30:00</span>
              </div>
              <Track label="Persönliches Gespräch">
                <span className="comic-diagnosis__clip comic-diagnosis__clip--talk">
                  30:00 · Mehrwert erklärt
                </span>
              </Track>
              <Track label="Deine Website">
                <span className="comic-diagnosis__clip comic-diagnosis__clip--web" />
                <span className="comic-diagnosis__clip-note">00:07 · weggeklickt</span>
              </Track>
            </div>
          </Scene>

          <Scene
            n="03"
            timecode="00:01:00"
            label="Lösung"
            title="Ein animierter Erklärfilm von Digital Trend Media."
            body="Er erklärt dein Angebot in 90 Sekunden so, wie du es im Gespräch tun würdest – für jeden Besucher, rund um die Uhr."
          >
            <ul className="comic-diagnosis__outcomes">
              {outcomes.map((item, index) => (
                <li key={item.title} className="comic-diagnosis__outcome">
                  <Image
                    src={item.image}
                    alt=""
                    width={320}
                    height={200}
                    className="comic-diagnosis__outcome-media"
                  />
                  <span className="comic-diagnosis__clip-id">
                    Clip {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="comic-diagnosis__outcome-title">{item.title}</p>
                </li>
              ))}
            </ul>
          </Scene>
        </ol>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}

function Scene({
  n,
  timecode,
  label,
  title,
  body,
  children,
}: {
  n: string;
  timecode: string;
  label: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <li className="comic-diagnosis__scene">
      <span className="comic-diagnosis__keyframe" aria-hidden />
      <div className="comic-diagnosis__copy">
        <p className="comic-diagnosis__meta">
          <span>Szene {n}</span>
          <span aria-hidden>·</span>
          <span>{timecode}</span>
        </p>
        <p className="comic-diagnosis__label">{label}</p>
        <h3 className="comic-diagnosis__title">{title}</h3>
        <p className="comic-diagnosis__body">{body}</p>
      </div>
      <div className="comic-diagnosis__visual">{children}</div>
    </li>
  );
}

function Track({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="comic-diagnosis__track">
      <span className="comic-diagnosis__track-label">{label}</span>
      <div className="comic-diagnosis__lane">{children}</div>
    </div>
  );
}
