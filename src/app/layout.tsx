import type { Metadata } from "next";
import { Anton_SC, Heebo, Inter, Inter_Tight } from "next/font/google";
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

const anton = Anton_SC({
  weight: "400",
  variable: "--font-card-display",
  subsets: ["latin"],
});

const heebo = Heebo({
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
        className={`${inter.variable} ${interTight.variable} ${anton.variable} ${heebo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
