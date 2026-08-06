"use client";

import Image from "next/image";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const logos = [
  { src: "/images/logos/stripe.svg", alt: "Stripe" },
  { src: "/images/logos/shopify.svg", alt: "Shopify" },
  { src: "/images/logos/slack.svg", alt: "Slack" },
  { src: "/images/logos/airbnb.svg", alt: "Airbnb" },
  { src: "/images/logos/spotify.svg", alt: "Spotify" },
  { src: "/images/logos/dropbox.svg", alt: "Dropbox" },
  { src: "/images/logos/github.svg", alt: "GitHub" },
  { src: "/images/logos/figma.svg", alt: "Figma" },
  { src: "/images/logos/vercel.svg", alt: "Vercel" },
  { src: "/images/logos/asana.svg", alt: "Asana" },
  { src: "/images/logos/hubspot.svg", alt: "HubSpot" },
  { src: "/images/logos/zapier.svg", alt: "Zapier" },
  { src: "/images/logos/intercom.svg", alt: "Intercom" },
  { src: "/images/logos/webflow.svg", alt: "Webflow" },
  { src: "/images/logos/discord.svg", alt: "Discord" },
  { src: "/images/logos/netflix.svg", alt: "Netflix" },
  { src: "/images/logos/amazon.svg", alt: "Amazon" },
  { src: "/images/logos/google.svg", alt: "Google" },
  { src: "/images/logos/microsoft.svg", alt: "Microsoft" },
  { src: "/images/logos/salesforce.svg", alt: "Salesforce" },
] as const;

export function Logos() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-8 md:gap-10 md:py-12">
      <RevealGroup className="flex w-full flex-col items-center gap-8 md:gap-10">
        <RevealItem
          as="h2"
          soft
          className="text-center text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-[1.35] text-black"
        >
          Mehr als 120 Unternehmen nutzen unsere Erklärfilme
        </RevealItem>
        <RevealItem soft className="w-full">
          <div className="grid w-full grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-8 md:grid-cols-5 md:gap-x-12 md:gap-y-10">
            {logos.map((logo) => (
              <div
                key={logo.src}
                className="flex h-10 items-center justify-center md:h-12"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="h-8 w-auto max-w-[7.5rem] object-contain opacity-70 grayscale transition-[opacity,filter] duration-200 hover:opacity-100 hover:grayscale-0 md:h-9 md:max-w-[8.5rem]"
                />
              </div>
            ))}
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
