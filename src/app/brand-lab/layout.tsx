import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

import "./brand-lab.css";

const display = Bricolage_Grotesque({
  variable: "--font-brand-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

const sans = DM_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand direction · Digital Trend Media",
  description:
    "Art-direction preview: approachable, playful, explainer-led brand language.",
  robots: { index: false, follow: false },
};

export default function BrandLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${sans.variable}`}>{children}</div>
  );
}
