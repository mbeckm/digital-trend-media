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
    <main className="mx-auto flex w-full max-w-[1512px] flex-col items-center gap-20 px-4 pb-20 pt-0 sm:px-8 lg:px-[120px]">
      <Nav />
      <Hero />
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
      <Footer />
    </main>
  );
}
