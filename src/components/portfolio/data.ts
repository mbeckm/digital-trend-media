import {
  DEMO_VIDEO_ID,
  PORTFOLIO_VIDEO_ID,
} from "@/components/YouTubeEmbed";

export const filterGroups = {
  Branche: [
    "Finanzindustrie",
    "Produktvorstellungen",
    "Produzierendes Gewerbe",
    "Solar",
    "Dienstleistung",
    "Software",
  ],
  Stil: ["2D-Flat", "Isometrisch", "Icon", "Whiteboard"],
  Videoart: [
    "Produktvorstellung",
    "Anleitung",
    "Unterweisung",
    "Kundengewinnung",
  ],
} as const;

export type FilterGroup = keyof typeof filterGroups;
export type FilterState = Record<FilterGroup, string | null>;

export type Film = {
  id: string;
  title: string;
  story: string;
  summary: string;
  highlights: string[];
  client: string;
  branche: (typeof filterGroups.Branche)[number];
  stil: (typeof filterGroups.Stil)[number];
  videoart: (typeof filterGroups.Videoart)[number];
  videoId: string;
  caseHref: string;
  featured?: boolean;
};

type FilmSeed = {
  id: string;
  client: string;
  title: string;
  branche: Film["branche"];
  stil: Film["stil"];
  videoart: Film["videoart"];
  featured?: boolean;
};

const PLACEHOLDER_IDS = [PORTFOLIO_VIDEO_ID, DEMO_VIDEO_ID] as const;

const seeds: FilmSeed[] = [
  {
    id: "axa-vertrauen",
    client: "AXA",
    title: "Vertrauen in 90 Sekunden",
    branche: "Finanzindustrie",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    featured: true,
  },
  {
    id: "lekkerland-sortiment",
    client: "Lekkerland",
    title: "Sortiment, das sich selbst erklärt",
    branche: "Produktvorstellungen",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
  },
  {
    id: "solar-montage",
    client: "SolarWatt",
    title: "Montage ohne Reibung",
    branche: "Solar",
    stil: "Icon",
    videoart: "Anleitung",
    featured: true,
  },
  {
    id: "software-onboarding",
    client: "Personio",
    title: "Onboarding, das nicht nervt",
    branche: "Software",
    stil: "2D-Flat",
    videoart: "Unterweisung",
  },
  {
    id: "industrie-sicherheit",
    client: "Bosch",
    title: "Sicherheit greifbar gemacht",
    branche: "Produzierendes Gewerbe",
    stil: "Whiteboard",
    videoart: "Unterweisung",
  },
  {
    id: "dienstleistung-pitch",
    client: "McKinsey",
    title: "Der Pitch, der sitzt",
    branche: "Dienstleistung",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
  },
  {
    id: "fintech-produkt",
    client: "N26",
    title: "Fintech ohne Fachchinesisch",
    branche: "Finanzindustrie",
    stil: "Icon",
    videoart: "Produktvorstellung",
  },
  {
    id: "software-feature",
    client: "SAP",
    title: "Feature-Launch mit Klarheit",
    branche: "Software",
    stil: "Whiteboard",
    videoart: "Produktvorstellung",
  },
  {
    id: "allianz-vorsorge",
    client: "Allianz",
    title: "Vorsorge ohne Formular-Angst",
    branche: "Finanzindustrie",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
  },
  {
    id: "siemens-wartung",
    client: "Siemens",
    title: "Wartung in drei Schritten",
    branche: "Produzierendes Gewerbe",
    stil: "Icon",
    videoart: "Anleitung",
    featured: true,
  },
  {
    id: "enbw-wechsel",
    client: "EnBW",
    title: "Energiewechsel leicht erklärt",
    branche: "Solar",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
  },
  {
    id: "datev-buchhaltung",
    client: "DATEV",
    title: "Buchhaltung ohne Dramen",
    branche: "Software",
    stil: "2D-Flat",
    videoart: "Produktvorstellung",
  },
  {
    id: "telekom-setup",
    client: "Telekom",
    title: "Setup, das jeder schafft",
    branche: "Dienstleistung",
    stil: "Icon",
    videoart: "Anleitung",
  },
  {
    id: "bmw-ladung",
    client: "BMW",
    title: "Laden ohne Rätselraten",
    branche: "Produktvorstellungen",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
  },
  {
    id: "zalando-retouren",
    client: "Zalando",
    title: "Retouren, die man versteht",
    branche: "Dienstleistung",
    stil: "2D-Flat",
    videoart: "Unterweisung",
  },
  {
    id: "commerzbank-konto",
    client: "Commerzbank",
    title: "Konto eröffnen in Klartext",
    branche: "Finanzindustrie",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
  },
  {
    id: "trumpf-maschine",
    client: "TRUMPF",
    title: "Maschine, Nutzen, Kaufgrund",
    branche: "Produzierendes Gewerbe",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
    featured: true,
  },
  {
    id: "sonnen-speicher",
    client: "sonnen",
    title: "Speicher, der sich rechnet",
    branche: "Solar",
    stil: "2D-Flat",
    videoart: "Produktvorstellung",
  },
  {
    id: "hubspot-crm",
    client: "HubSpot",
    title: "CRM ohne Schulungsmarathon",
    branche: "Software",
    stil: "Icon",
    videoart: "Unterweisung",
  },
  {
    id: "otto-lieferkette",
    client: "OTTO",
    title: "Lieferkette greifbar gemacht",
    branche: "Produktvorstellungen",
    stil: "Whiteboard",
    videoart: "Anleitung",
  },
  {
    id: "deloitte-transform",
    client: "Deloitte",
    title: "Transformation ohne Buzzwords",
    branche: "Dienstleistung",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
  },
  {
    id: "vw-werkstatt",
    client: "Volkswagen",
    title: "Werkstatt-Check in 60 Sekunden",
    branche: "Produzierendes Gewerbe",
    stil: "Icon",
    videoart: "Unterweisung",
  },
  {
    id: "ing-sparen",
    client: "ING",
    title: "Sparen, das sich anfühlt",
    branche: "Finanzindustrie",
    stil: "2D-Flat",
    videoart: "Produktvorstellung",
  },
  {
    id: "ikea-montage",
    client: "IKEA",
    title: "Montage ohne Fluch",
    branche: "Produktvorstellungen",
    stil: "Icon",
    videoart: "Anleitung",
  },
  {
    id: "salesforce-pipeline",
    client: "Salesforce",
    title: "Pipeline, die Vertrieb mag",
    branche: "Software",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
  },
  {
    id: "rwe-park",
    client: "RWE",
    title: "Parkplanung für Entscheider",
    branche: "Solar",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
  },
  {
    id: "db-sicherheit",
    client: "Deutsche Bahn",
    title: "Sicherheit auf dem Gleis",
    branche: "Dienstleistung",
    stil: "2D-Flat",
    videoart: "Unterweisung",
  },
  {
    id: "adidas-launch",
    client: "adidas",
    title: "Launch, der sofort sitzt",
    branche: "Produktvorstellungen",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
    featured: true,
  },
  {
    id: "kaercher-leistung",
    client: "Kärcher",
    title: "Leistung, die man sieht",
    branche: "Produzierendes Gewerbe",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
  },
  {
    id: "check24-vergleich",
    client: "CHECK24",
    title: "Vergleich ohne Tabellenchaos",
    branche: "Finanzindustrie",
    stil: "Icon",
    videoart: "Kundengewinnung",
  },
];

export const films: Film[] = seeds.map((seed, index) => ({
  ...seed,
  story: `${seed.client}: ${seed.title}. Komplexes Angebot, klar erzählt.`,
  summary: `${seed.client} brauchte einen Erklärfilm, der ${seed.title.toLowerCase()} greifbar macht. Ohne Fachjargon, mit klarer Handlung.`,
  highlights: [
    "Conversion-fokussiertes Drehbuch",
    `${seed.stil}-Stil, markenkonform`,
    "Einsetzbar auf Website, Ads und im Vertrieb",
  ],
  videoId: PLACEHOLDER_IDS[index % PLACEHOLDER_IDS.length],
  caseHref: "#kunden",
}));

export const emptyFilters: FilterState = {
  Branche: null,
  Stil: null,
  Videoart: null,
};

export function filterFilms(active: FilterState): Film[] {
  return films.filter((film) => {
    if (active.Branche && film.branche !== active.Branche) return false;
    if (active.Stil && film.stil !== active.Stil) return false;
    if (active.Videoart && film.videoart !== active.Videoart) return false;
    return true;
  });
}
