import Image from "next/image";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";

const logos = [
  { src: "/images/logos/stripe.svg", alt: "Stripe" },
  { src: "/images/logos/shopify.svg", alt: "Shopify" },
  { src: "/images/logos/slack.svg", alt: "Slack" },
  { src: "/images/logos/airbnb.svg", alt: "Airbnb" },
  { src: "/images/logos/spotify.svg", alt: "Spotify" },
  { src: "/images/logos/dropbox.svg", alt: "Dropbox" },
  { src: "/images/logos/github.svg", alt: "GitHub" },
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
  { src: "/images/logos/figma.svg", alt: "Figma" },
] as const;

export function ComicCustomers() {
  return (
    <section className="comic-customers">
      <div className="comic-shell relative z-10 flex flex-col items-center gap-12 md:gap-16">
        <ComicSectionIntro
          title="So viele zufriedene Kunden!"
          lead="Unsere Kunden nutzen unsere Erklärfilme in Marketing und Vertrieb, online und auf Messen."
        />

        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 md:grid-cols-5 md:gap-x-10 md:gap-y-10">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex h-12 items-center justify-center md:h-14"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={40}
                className="max-h-10 w-auto object-contain opacity-70 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 md:max-h-12"
              />
            </div>
          ))}
        </div>

        <ComicCta className="!mt-0" />
      </div>
    </section>
  );
}
