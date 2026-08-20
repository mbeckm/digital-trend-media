import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process lab · Digital Trend Media",
  description: "Comic-style drafts of the production process section.",
  robots: { index: false, follow: false },
};

export default function ProcessLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
