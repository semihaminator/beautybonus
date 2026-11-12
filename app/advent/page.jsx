import AdventCountdown from "@/components/AdventCountdown";
import { PreviewNote } from "@/components/PreviewNote";
import { ADVENT, ADVENT_START } from "@/lib/content/advent";
import { getLocale } from "@/lib/locale";
import { requireSection } from "@/lib/sections";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = ADVENT[await getLocale()] || ADVENT.en;
  return { title: t.metaTitle, description: t.lead };
}

export default async function AdventPage() {
  const { preview } = await requireSection("advent");
  const t = ADVENT[await getLocale()] || ADVENT.en;
  return (
    <div className="advent">
      {preview && <PreviewNote />}
      <img src="/img/advent/garland.webp" alt="" className="adv-garland" aria-hidden="true" />

      <section className="adv-hero">
        <div className="adv-copy">
          <img src="/img/advent/salsa-red.webp" alt="salsa" className="adv-logo" width="900" height="301" />
          <span className="adv-eyebrow">✦ {t.eyebrow} ✦</span>
          <h1 className="adv-title">{t.title}</h1>
          <p className="adv-lead">{t.lead}</p>

          <p className="adv-until">{t.until}</p>
          <AdventCountdown target={ADVENT_START} units={t.units} openText={t.open} />
          <p className="adv-date">{t.opens}</p>
        </div>

        <div className="adv-art">
          <img src="/img/advent/girl-door.webp" alt="" className="adv-girl" width="760" height="1337" />
          <img src="/img/advent/hourglass.webp" alt="" className="adv-deco adv-hourglass" aria-hidden="true" />
          <img src="/img/advent/heart-ornament.webp" alt="" className="adv-deco adv-heart" aria-hidden="true" />
        </div>

        <img src="/img/advent/santa-s.webp" alt="" className="adv-deco adv-santa" aria-hidden="true" />
      </section>

      <section className="adv-follow">
        <img src="/img/advent/snowflakes.webp" alt="" className="adv-flakes" aria-hidden="true" />
        <p>{t.follow}</p>
      </section>
    </div>
  );
}
