import type { VimeoVideo } from "@/components/VimeoEmbed";

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
  video: VimeoVideo;
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
  video: VimeoVideo;
  featured?: boolean;
};

/**
 * Unique Erklärfilme from the client brief.
 * Style section wins for stil; industry section fills branche for the rest.
 * Prefer iframe embed ids when the pasted link disagrees.
 */
const seeds: FilmSeed[] = [
  {
    id: "intalcon",
    client: "Intalcon",
    title: "Finanzprodukte in Klartext",
    branche: "Finanzindustrie",
    stil: "Icon",
    videoart: "Kundengewinnung",
    video: { id: "509597045", hash: "df3537f280" },
    featured: true,
  },
  {
    id: "tempmate",
    client: "tempmate",
    title: "S1 Pro verständlich erklärt",
    branche: "Produktvorstellungen",
    stil: "Icon",
    videoart: "Produktvorstellung",
    video: { id: "807029132", hash: "78d107054a" },
  },
  {
    id: "keyspot",
    client: "KeySpot",
    title: "Access, klar auf den Punkt",
    branche: "Software",
    stil: "Icon",
    videoart: "Kundengewinnung",
    video: { id: "1216233031", hash: "b98497825b" },
    featured: true,
  },
  {
    id: "dein-fach",
    client: "Dein Fach",
    title: "Fachwissen, das ankommt",
    branche: "Dienstleistung",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    video: { id: "1142430717", hash: "0cb977cf0e" },
  },
  {
    id: "water-is-right",
    client: "Water Is Right",
    title: "Wasserqualität greifbar gemacht",
    branche: "Produktvorstellungen",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    video: { id: "1216229179", hash: "30b3b7f6ea" },
  },
  {
    id: "las-schaumstoffeinlagen",
    client: "LAS Oberflächentechnik",
    title: "Schaumstoffeinlagen erklärt",
    branche: "Produzierendes Gewerbe",
    stil: "2D-Flat",
    videoart: "Produktvorstellung",
    video: { id: "1142431267", hash: "c369ba3c72" },
  },
  {
    id: "swarm-analytics",
    client: "Swarm Analytics",
    title: "Analytics ohne Fachchinesisch",
    branche: "Software",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
    video: { id: "807043776", hash: "6d340ad500" },
  },
  {
    id: "frenger",
    client: "Frenger",
    title: "EVO-SD auf den Punkt",
    branche: "Produzierendes Gewerbe",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
    video: { id: "807042256", hash: "452241763c" },
    featured: true,
  },
  {
    id: "auritec-at2000",
    client: "AURITEC",
    title: "AT2000 Produktvorstellung",
    branche: "Produktvorstellungen",
    stil: "Whiteboard",
    videoart: "Produktvorstellung",
    video: { id: "1216226833", hash: "06e1550103" },
  },
  {
    id: "carey-ag",
    client: "Carey AG",
    title: "Leistung, die man versteht",
    branche: "Dienstleistung",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
    video: { id: "808711769", hash: "6c16b02c21" },
  },
  {
    id: "inno-finanz",
    client: "INNO-Finanz",
    title: "Finanzierung ohne Umwege",
    branche: "Finanzindustrie",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
    video: { id: "809738369", hash: "a88dabd72a" },
  },
  {
    id: "finxp",
    client: "FinXP",
    title: "Payment, klar erzählt",
    branche: "Finanzindustrie",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    video: { id: "807057047", hash: "79ed1dc227" },
  },
  {
    id: "whitebox",
    client: "Whitebox",
    title: "Vermögen verständlich gemacht",
    branche: "Finanzindustrie",
    stil: "Icon",
    videoart: "Kundengewinnung",
    video: { id: "807031486", hash: "8b9754c16a" },
  },
  {
    id: "knarr-vario",
    client: "KNARR",
    title: "Vario Produktvorstellung",
    branche: "Produktvorstellungen",
    stil: "2D-Flat",
    videoart: "Produktvorstellung",
    video: { id: "1216229410", hash: "3b26606b42" },
    featured: true,
  },
  {
    id: "korema",
    client: "KOREMA",
    title: "Technik, die sich erklärt",
    branche: "Produktvorstellungen",
    stil: "Isometrisch",
    videoart: "Produktvorstellung",
    video: { id: "933653779", hash: "a01fe70c49" },
  },
  {
    id: "africa-greentec",
    client: "Africa GreenTec",
    title: "Impact Investing erklärt",
    branche: "Finanzindustrie",
    stil: "Icon",
    videoart: "Kundengewinnung",
    video: { id: "509600349", hash: "482f8cdc4e" },
  },
  {
    id: "dagobertinvest",
    client: "Dagobertinvest",
    title: "Investieren ohne Fachjargon",
    branche: "Finanzindustrie",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
    video: { id: "807069555", hash: "a7743ce122" },
  },
  {
    id: "inno-invest",
    client: "INNO-INVEST",
    title: "Investment auf einen Blick",
    branche: "Finanzindustrie",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    video: { id: "807057192", hash: "25ac8e482e" },
  },
  {
    id: "rixius",
    client: "RIXIUS",
    title: "Fertigung, die überzeugt",
    branche: "Produzierendes Gewerbe",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
    video: { id: "807065846", hash: "426d29f01c" },
  },
  {
    id: "klaus-koehler",
    client: "Klaus Köhler",
    title: "Betonfertigteile erklärt",
    branche: "Produzierendes Gewerbe",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    video: { id: "1216228102", hash: "11db70b889" },
  },
  {
    id: "hartmann-electronic",
    client: "Hartmann Electronic",
    title: "Elektronik greifbar gemacht",
    branche: "Produzierendes Gewerbe",
    stil: "Icon",
    videoart: "Produktvorstellung",
    video: { id: "807073430", hash: "99be6c1299" },
  },
  {
    id: "ontour-solar",
    client: "OnTour Solar",
    title: "Solar mobil erklärt",
    branche: "Solar",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
    video: { id: "809738073", hash: "99eb679f71" },
  },
  {
    id: "offgridtec",
    client: "Offgridtec",
    title: "Balkonkraftwerke erklärt",
    branche: "Solar",
    stil: "2D-Flat",
    videoart: "Produktvorstellung",
    video: { id: "807064786", hash: "c2da9d1594" },
    featured: true,
  },
  {
    id: "krause-elektrotechnik",
    client: "Krause Elektrotechnik",
    title: "Solartechnik auf den Punkt",
    branche: "Solar",
    stil: "Icon",
    videoart: "Kundengewinnung",
    video: { id: "933653569", hash: "46a7bab947" },
  },
  {
    id: "bcm",
    client: "BCM",
    title: "Customer Management erklärt",
    branche: "Dienstleistung",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
    video: { id: "807077177", hash: "64592e4584" },
  },
  {
    id: "qmk",
    client: "QMK",
    title: "Qualitätssicherung klar erzählt",
    branche: "Dienstleistung",
    stil: "Whiteboard",
    videoart: "Kundengewinnung",
    video: { id: "807078959", hash: "3415a141af" },
  },
  {
    id: "riser-id",
    client: "RISER ID",
    title: "ReAdress verständlich gemacht",
    branche: "Dienstleistung",
    stil: "Icon",
    videoart: "Kundengewinnung",
    video: { id: "807078539", hash: "2d295a0277" },
  },
  {
    id: "zfabrik",
    client: "ZFabrik",
    title: "Software ohne Schulungsmarathon",
    branche: "Software",
    stil: "Isometrisch",
    videoart: "Kundengewinnung",
    video: { id: "807042447", hash: "725be8a3a8" },
  },
  {
    id: "cobra",
    client: "cobra",
    title: "Event-Modul vorgestellt",
    branche: "Software",
    stil: "Whiteboard",
    videoart: "Produktvorstellung",
    video: { id: "807080991", hash: "04720daf7a" },
  },
  {
    id: "gfos",
    client: "GFOS",
    title: "Prozesse, die man versteht",
    branche: "Software",
    stil: "2D-Flat",
    videoart: "Kundengewinnung",
    video: { id: "807080510", hash: "caf3c5d45a" },
  },
];

export const films: Film[] = seeds.map((seed) => ({
  ...seed,
  story: `${seed.client}: ${seed.title}. Komplexes Angebot, klar erzählt.`,
  summary: `${seed.client} brauchte einen Erklärfilm, der ${seed.title.toLowerCase()} greifbar macht. Ohne Fachjargon, mit klarer Handlung.`,
  highlights: [
    "Conversion-fokussiertes Drehbuch",
    `${seed.stil}-Stil, markenkonform`,
    "Einsetzbar auf Website, Ads und im Vertrieb",
  ],
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
