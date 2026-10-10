import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import "./card-flip-lab/card-flip-lab.css";
import "./comic/comic.css";

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
        className={`${fontVariables} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
