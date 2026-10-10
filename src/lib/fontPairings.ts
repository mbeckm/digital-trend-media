/** Headline + body pairings the client can compare via the font switcher. */
export const fontPairings = [
  { id: "bricolage", label: "Bricolage Grotesque + Inter" },
  { id: "switzer", label: "Switzer Bold + Switzer Regular" },
  { id: "general", label: "General Sans Medium + Quicksand Medium" },
  { id: "clash", label: "Clash Display Semibold + Archivo Regular" },
] as const;

export type FontPairingId = (typeof fontPairings)[number]["id"];

export const DEFAULT_FONT_PAIRING: FontPairingId = "bricolage";
