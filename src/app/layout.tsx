import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import "./card-flip-lab/card-flip-lab.css";
import "./comic/comic.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// Headlines: a grotesk with a little character, set in sentence case.
const display = Bricolage_Grotesque({
  variable: "--font-card-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Body copy shares Inter with the rest of the site.
const sans = Inter({
  variable: "--font-card-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Trend Media. Komplexes. Einfach erklärt.",
  description:
    "Digital Trend Media macht Erklärfilme, die eure Zielgruppe von eurem Angebot begeistern. Denn Menschen kaufen nur, was sie auch verstehen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${inter.variable} ${interTight.variable} ${display.variable} ${sans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
