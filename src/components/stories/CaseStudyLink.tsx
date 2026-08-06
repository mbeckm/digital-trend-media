import Link from "next/link";
import type { ReactNode } from "react";

import { caseStudyHref } from "@/components/stories/data";

type CaseStudyLinkProps = {
  slug: string;
  children: ReactNode;
  className?: string;
  tone?: "text" | "solid";
};

export function CaseStudyLink({
  slug,
  children,
  className = "",
  tone = "text",
}: CaseStudyLinkProps) {
  const base =
    tone === "solid"
      ? "inline-flex items-center gap-1.5 rounded-full bg-[#0c1a3a] px-4 py-2.5 text-sm font-semibold text-white transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.96]"
      : "group/link inline-flex items-center gap-1.5 font-semibold text-[#1f4e8e] transition-[opacity,transform] duration-200 ease-out hover:opacity-70 active:scale-[0.96]";

  return (
    <Link href={caseStudyHref(slug)} className={`${base} ${className}`}>
      {children}
      <span
        aria-hidden
        className={
          tone === "solid"
            ? undefined
            : "translate-x-0 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
        }
      >
        →
      </span>
    </Link>
  );
}
