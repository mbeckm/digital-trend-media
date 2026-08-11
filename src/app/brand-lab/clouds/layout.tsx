import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand direction · Clouds + Cast · Digital Trend Media",
  description:
    "Art-direction preview with client cloud palette and explainer characters.",
  robots: { index: false, follow: false },
};

export default function CloudsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Theme class lives on the page wrapper; keep layout thin for metadata only.
  return children;
}
