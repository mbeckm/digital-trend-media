import type { VimeoVideo } from "@/components/VimeoEmbed";

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
  video: VimeoVideo;
  duration?: string;
};

/** Customer testimonial films from the client brief. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "alpha-standards",
    name: "Kundenstimme",
    role: "Testimonial",
    company: "Alpha Standards GmbH",
    industry: "Industrie",
    headline: "Wie Alpha Standards komplexe Standards greifbar macht",
    quote:
      "Der Film hat unsere Sales-Gespräche verändert. Interessenten verstehen das Angebot, bevor der Call beginnt.",
    metric: "3×",
    metricLabel: "mehr qualifizierte Demo-Anfragen",
    video: { id: "950730751", hash: "36874f3d4f" },
  },
  {
    slug: "best-preis-optik",
    name: "Kundenstimme",
    role: "Testimonial",
    company: "Best Preis Optik",
    industry: "Retail",
    headline: "Vom Angebot zum verständlichen Markenauftritt",
    quote:
      "Endlich eine Botschaft, die unsere Zielgruppe sofort greift — ohne Technik-Kauderwelsch.",
    metric: "+41%",
    metricLabel: "höhere Abschlussquote im Vertrieb",
    video: { id: "874486407", hash: "938c252c9d" },
  },
  {
    slug: "finxp",
    name: "Kundenstimme",
    role: "Testimonial",
    company: "FinXP",
    industry: "Fintech",
    headline: "Erklärfilm, der Anfragen steigert und Onboarding verkürzt",
    quote:
      "Komplexe Leistungen werden endlich in wenigen Minuten verständlich — und das sieht man an den Zahlen.",
    metric: "2,4×",
    metricLabel: "mehr Website-Anfragen",
    video: { id: "804897963", hash: "a2edfd8bb8" },
  },
  {
    slug: "bcm",
    name: "Kundenstimme",
    role: "Testimonial",
    company: "BCM GmbH",
    industry: "Dienstleistung",
    headline: "Customer Management, das Interessenten sofort verstehen",
    quote:
      "Vom Kick-off bis zum fertigen Film alles klar strukturiert. Der Film läuft jetzt auf der Website und im Vertrieb.",
    metric: "2×",
    metricLabel: "schnellere Angebots-Gespräche",
    video: { id: "804898591", hash: "44504bb3ab" },
  },
  {
    slug: "cash-to-code",
    name: "Kundenstimme",
    role: "Testimonial",
    company: "Cash to Code",
    industry: "Fintech",
    headline: "Payment-Flows, die man in 90 Sekunden versteht",
    quote:
      "Wir nutzen den Film in Ads und im Onboarding. Die Conversion ist spürbar besser.",
    metric: "+38%",
    metricLabel: "höhere Ad-Conversion",
    video: { id: "804899489", hash: "1a255a5a26" },
  },
  {
    slug: "tempmate",
    name: "Kundenstimme",
    role: "Testimonial",
    company: "tempmate GmbH",
    industry: "Hardware",
    headline: "Produktverständnis, das den Vertrieb entlastet",
    quote:
      "Professionell, schnell und ohne Abstimmungs-Chaos — unsere Zielgruppe versteht das Produkt sofort.",
    metric: "90 Sek.",
    metricLabel: "bis zum Aha-Moment",
    video: { id: "827619536", hash: "b64ee76cb3" },
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function caseStudyHref(slug: string) {
  return `/kunden/${slug}`;
}
