import { CinemaStories } from "@/components/stories/variants/Cinema";
import { ResultGridStories } from "@/components/stories/variants/ResultGrid";
import { SpotlightStories } from "@/components/stories/variants/Spotlight";

export const STORY_VARIANTS = [
  {
    id: "cinema",
    label: "B · Cinema",
    blurb: "Horizontal video strip with story CTAs — Paraform / Deel / Ramp",
    Scene: CinemaStories,
  },
  {
    id: "spotlight",
    label: "A · Spotlight",
    blurb: "Featured split + two supporting films — Vanta / Dovetail / Harvest",
    Scene: SpotlightStories,
  },
  {
    id: "results",
    label: "C · Result Grid",
    blurb: "Equal cards led by a hard metric — Rox / Webflow / Patreon",
    Scene: ResultGridStories,
  },
] as const;

export type StoryVariantId = (typeof STORY_VARIANTS)[number]["id"];

export function StoriesStage({
  variant = "cinema",
}: {
  variant?: StoryVariantId;
}) {
  const active =
    STORY_VARIANTS.find((item) => item.id === variant) ?? STORY_VARIANTS[0];
  const { Scene } = active;
  return <Scene key={active.id} />;
}
