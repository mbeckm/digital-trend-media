import {
  Archivo,
  Bricolage_Grotesque,
  Inter,
  Inter_Tight,
  Quicksand,
} from "next/font/google";
import localFont from "next/font/local";

/*
 * Every typeface the landing page can use. Each one only defines its own
 * CSS variable; `comic.css` maps the active pairing (see `fontPairings`)
 * onto --font-card-display / --font-card-sans.
 */

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const bricolage = Bricolage_Grotesque({
  variable: "--ff-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Fontshare typefaces, self-hosted (ITF Free Font License).
export const switzer = localFont({
  variable: "--ff-switzer",
  preload: false,
  src: [
    { path: "../fonts/switzer-400.woff2", weight: "400" },
    { path: "../fonts/switzer-500.woff2", weight: "500" },
    { path: "../fonts/switzer-600.woff2", weight: "600" },
    { path: "../fonts/switzer-700.woff2", weight: "700" },
  ],
});

export const generalSans = localFont({
  variable: "--ff-general-sans",
  preload: false,
  src: [{ path: "../fonts/general-sans-500.woff2", weight: "500" }],
});

export const clashDisplay = localFont({
  variable: "--ff-clash-display",
  preload: false,
  src: [{ path: "../fonts/clash-display-600.woff2", weight: "600" }],
});

export const quicksand = Quicksand({
  variable: "--ff-quicksand",
  subsets: ["latin"],
  preload: false,
});

export const archivo = Archivo({
  variable: "--ff-archivo",
  subsets: ["latin"],
  preload: false,
});

export const fontVariables = [
  inter,
  interTight,
  bricolage,
  switzer,
  generalSans,
  clashDisplay,
  quicksand,
  archivo,
]
  .map((font) => font.variable)
  .join(" ");
