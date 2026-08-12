import Image from "next/image";

const logos = [
  { src: "/images/logos/stripe.svg", alt: "Stripe" },
  { src: "/images/logos/shopify.svg", alt: "Shopify" },
  { src: "/images/logos/slack.svg", alt: "Slack" },
  { src: "/images/logos/airbnb.svg", alt: "Airbnb" },
  { src: "/images/logos/spotify.svg", alt: "Spotify" },
] as const;

export function ComicLogoStrip() {
  return (
    <div className="comic-logo-strip" aria-label="Kundenlogos">
      {logos.map((logo) => (
        <Image
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          width={200}
          height={56}
        />
      ))}
    </div>
  );
}
