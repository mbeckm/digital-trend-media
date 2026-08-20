export const PROCESS_STEPS = [
  {
    kind: "kickoff",
    n: "01",
    title: "Kick Off",
    meta: "30 Min",
    body: "Gemeinsam entwickeln wir Ideen für die Story. Erzählt unserem Creative-Director von eurer Geschichte, euren Zielsetzungen und USPs.",
    tilt: -1.4,
  },
  {
    kind: "script",
    n: "02",
    title: "Drehbuch",
    meta: "60 Min",
    body: "Die besten Drehbuchautoren Deutschlands schreiben das Drehbuch auf dem Gerüst unserer Conversion-Strategie.",
    tilt: 1.15,
  },
  {
    kind: "storyboard",
    n: "03",
    title: "Storyboard",
    meta: "30 Min",
    body: "Aus Wörtern werden Bilder. Am Storyboard seht ihr Stil und Bildsprache, bevor wir animieren.",
    tilt: 0.8,
  },
  {
    kind: "reel",
    n: "04",
    title: "Animation",
    meta: "30 Min",
    body: "Sind alle Freigaben da, folgen Animation, Voice Over, Sound Design und Musik.",
    tilt: -1.1,
  },
] as const;

export type ProcessStep = (typeof PROCESS_STEPS)[number];
export type ProcessStepKind = ProcessStep["kind"];

export const PROCESS_COPY = {
  title: "So läuft die Zusammenarbeit ab",
  lead: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
} as const;
