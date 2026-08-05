import { Cause } from "@/components/Cause";
import { Collaboration } from "@/components/Collaboration";
import { Comparison } from "@/components/Comparison";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Logos } from "@/components/Logos";
import { MoreTestimonials } from "@/components/MoreTestimonials";
import { Nav } from "@/components/Nav";
import { Portfolio } from "@/components/Portfolio";
import { Reasons } from "@/components/Reasons";
import { StartProcess } from "@/components/StartProcess";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="flex w-full flex-col items-stretch gap-16 pb-0 pt-0 md:gap-20">
      <Nav />
      <Hero />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-stretch gap-14 px-6 md:gap-20 md:px-10 lg:px-12">
        <Logos />
        <Testimonials />
        <Reasons />
        <Cause />
        <Comparison />
        <Portfolio />
        <MoreTestimonials />
        <StartProcess />
        <Collaboration />
        <Faq />
      </div>
      <Footer />
    </main>
  );
}
