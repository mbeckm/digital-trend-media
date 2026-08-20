import { ComicCaseStudies } from "@/components/comic/ComicCaseStudies";
import { ComicCompare } from "@/components/comic/ComicCompare";
import { ComicCustomers } from "@/components/comic/ComicCustomers";
import { ComicFaq } from "@/components/comic/ComicFaq";
import { ComicFooter } from "@/components/comic/ComicFooter";
import { ComicHero, ComicNav } from "@/components/comic/ComicHero";
import { ComicHelp } from "@/components/comic/ComicHelp";
import { ComicLogoStrip } from "@/components/comic/ComicLogoStrip";
import { ComicPortfolio } from "@/components/comic/ComicPortfolio";
import { ComicTestimonials } from "@/components/comic/ComicTestimonials";

export default function Home() {
  return (
    <div className="comic">
      <ComicNav />
      <main>
        <ComicHero />
        <ComicLogoStrip />
        <ComicCaseStudies />
        <ComicCustomers />
        <ComicHelp />
        <ComicPortfolio />
        <ComicTestimonials />
        <ComicCompare />
        <ComicFaq />
      </main>
      <ComicFooter />
    </div>
  );
}
