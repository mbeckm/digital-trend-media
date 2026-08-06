import { DEMO_VIDEO_ID } from "@/components/YouTubeEmbed";

export type CaseStudy = {
  slug: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  headline: string;
  quote: string;
  metric: string;
  metricLabel: string;
  videoId: string;
  duration: string;
};

/** Placeholder stories until real customer films ship. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "google-anna-mueller",
    name: "Anna Müller",
    role: "Marketing Lead",
    company: "Google",
    industry: "Tech",
    headline: "Wie Google komplexe Cloud-Leistungen in drei Minuten greifbar macht",
    quote:
      "Der Film hat unsere Sales-Gespräche verändert. Interessenten verstehen das Angebot, bevor der Call beginnt.",
    metric: "3×",
    metricLabel: "mehr qualifizierte Demo-Anfragen",
    videoId: DEMO_VIDEO_ID,
    duration: "2:48",
  },
  {
    slug: "gloeckler-harald",
    name: "Harald Glöckler",
    role: "CEO",
    company: "Glöckler Industries",
    industry: "Industrie",
    headline: "Vom Maschinenbauer zum Markenauftritt, den Einkäufer sofort verstehen",
    quote:
      "Endlich eine Botschaft, die unsere Zielgruppe sofort greift — ohne Technik-Kauderwelsch.",
    metric: "+41%",
    metricLabel: "höhere Abschlussquote im Vertrieb",
    videoId: DEMO_VIDEO_ID,
    duration: "3:12",
  },
  {
    slug: "nova-laura-hoffmann",
    name: "Laura Hoffmann",
    role: "Head of Marketing",
    company: "Nova Finance",
    industry: "Fintech",
    headline: "Erklärfilm, der Anfragen steigert und Onboarding verkürzt",
    quote:
      "Komplexe Leistungen werden endlich in wenigen Minuten verständlich — und das sieht man an den Zahlen.",
    metric: "2,4×",
    metricLabel: "mehr Website-Anfragen",
    videoId: DEMO_VIDEO_ID,
    duration: "2:21",
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function caseStudyHref(slug: string) {
  return `/kunden/${slug}`;
}
