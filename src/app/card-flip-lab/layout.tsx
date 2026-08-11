import { Anton_SC, Heebo } from "next/font/google";
import type { Metadata } from "next";

import "./card-flip-lab.css";

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
  title: "Card flip lab · Digital Trend Media",
  description: "Scroll-driven card flip experiment from Figma.",
  robots: { index: false, follow: false },
};

export default function CardFlipLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${anton.variable} ${heebo.variable}`}>{children}</div>
  );
}
