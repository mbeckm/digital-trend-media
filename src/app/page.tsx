import { ComicCaseStudies } from "@/components/comic/ComicCaseStudies";
import { ComicCompare } from "@/components/comic/ComicCompare";
import { ComicCustomers } from "@/components/comic/ComicCustomers";
import { ComicDiagnosis } from "@/components/comic/ComicDiagnosis";
import { ComicFaq } from "@/components/comic/ComicFaq";
import { ComicFooter } from "@/components/comic/ComicFooter";
import {
  ComicHero,
  ComicNav,
  ComicProofBar,
} from "@/components/comic/ComicHero";
import { ComicTestimonials } from "@/components/comic/ComicTestimonials";
import { FontSwitcher } from "@/components/comic/FontSwitcher";
import { Portfolio } from "@/components/Portfolio";
import { FocusProcess } from "@/components/process/variants/Focus";

export default function Home() {
  return (
    <div className="comic">
      <ComicNav />
      <main>
        <ComicHero />
        <ComicProofBar />
        <ComicDiagnosis />
        <ComicCaseStudies />
        <ComicCustomers />
        <Portfolio variant="comic" />
        <ComicTestimonials />
        <FocusProcess />
        <ComicCompare />
        <ComicFaq />
      </main>
      <ComicFooter />
      <FontSwitcher />
    </div>
  );
}
