"use client";

import Image from "next/image";

import { ComicCta, ComicSectionIntro } from "@/components/comic/ComicUi";
import { CursorImageTrail } from "@/components/unlumen-ui/cursor-image-trail";

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

const characters = [
  {
    src: "/images/comic/character-happy.png",
    alt: "Fröhliche Comic-Figur",
  },
  {
    src: "/images/comic/character-enthusiastic.png",
    alt: "Begeisterte Comic-Figur",
  },
  {
    src: "/images/comic/character-relieved.png",
    alt: "Erleichterte Comic-Figur",
  },
  {
    src: "/images/comic/character-confused.png",
    alt: "Verwirrte Comic-Figur",
  },
  {
    src: "/images/comic/character-sad.png",
    alt: "Traurige Comic-Figur",
  },
  {
    src: "/images/comic/character-angry.png",
    alt: "Verärgerte Comic-Figur",
  },
] as const;

const characterTrailItems = characters.map((character) => (
  // Plain <img> keeps Motion transforms lightweight for the trail.
  // eslint-disable-next-line @next/next/no-img-element
  <img
    key={character.src}
    src={character.src}
    alt=""
    width={128}
    height={192}
    draggable={false}
    className="h-auto w-full"
  />
));

export function ComicCustomers() {
  return (
    <section className="comic-customers">
      <CursorImageTrail
        items={characterTrailItems}
        itemSize={128}
        trailLength={6}
        spawnDistance={110}
        rotationRange={24}
        className="comic-customers__trail"
      >
        <div className="comic-shell flex flex-col items-center gap-16 md:gap-24">
          <ComicSectionIntro
            title="So viele zufriedene Kunden!"
            lead="Unsere Kunden nutzen unsere Erklärfilme in Marketing und Vertrieb, online und auf Messen."
          />

          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 md:grid-cols-5 md:gap-x-12 md:gap-y-14">
            {logos.map((logo) => (
              <div
                key={logo.src}
                className="flex h-16 items-center justify-center md:h-20"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={56}
                  className="max-h-14 w-auto object-contain opacity-70 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 md:max-h-16"
                />
              </div>
            ))}
          </div>

          <ComicCta className="!mt-0" />
        </div>
      </CursorImageTrail>
    </section>
  );
}
