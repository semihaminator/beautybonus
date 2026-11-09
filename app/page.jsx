import Link from "next/link";
import ContestCards from "@/components/ContestCards";
import { getLiveContests } from "@/lib/contests";
import { getLocale } from "@/lib/locale";
import { getSettings } from "@/lib/settings";
import { getSite } from "@/lib/site";

export const dynamic = "force-dynamic";

const CARDS = [
  { key: "guide", href: "/guide", img: "/img/guide-card.webp", pos: "center" },
  { key: "agency", href: "/agency", img: "/img/agency-card.webp", pos: "center" },
  { key: "beautyBonus", href: "/beauty-bonus", img: "/img/bb-card.webp", pos: "center" },
];

export default async function Home() {
  const [locale, settings, contests] = await Promise.all([getLocale(), getSettings(), getLiveContests()]);
  const site = getSite(locale);
  const h = site.hub;
  const cards = CARDS.filter((c) => settings.sections[c.key]);
  return (
    <>
      <section className="hub-hero">
        <div className="hub-copy">
          <span className="eyebrow">{h.eyebrow}</span>
          <h1 className="hub-title">{h.title}</h1>
          <p className="lead">{h.lead}</p>
          <div className="hero-actions left">
            {settings.links.startStreaming && (
              <a href={settings.links.startStreaming} className="btn" target="_blank" rel="noopener noreferrer">{h.start}</a>
            )}
            {settings.links.support && (
              <a href={settings.links.support} className="btn ghost" target="_blank" rel="noopener noreferrer">{h.support}</a>
            )}
          </div>
        </div>
        <div className="hub-3d" aria-hidden="true">
          <img src="/img/hero-s-3d.webp" alt="" width="760" height="845" />
        </div>
      </section>

      {contests.length > 0 && (
        <div className="hub-contests">
          <ContestCards contests={contests} locale={locale} s={site} title={site.contests.title} />
        </div>
      )}

      <section className="hub-cards" aria-label={h.eyebrow}>
        {cards.map((c) => {
          const t = h.cards[c.key];
          return (
            <Link key={c.key} href={c.href} className="hub-card">
              <span className="hub-card-img" style={{ backgroundImage: `url(${c.img})`, backgroundPosition: c.pos }} aria-hidden="true" />
              <span className="hub-card-body">
                <span className="hub-tag">{t.tag}</span>
                <span className="hub-card-title">{t.title}</span>
                <span className="hub-card-text">{t.text}</span>
                <span className="hub-card-cta">{t.cta} →</span>
              </span>
            </Link>
          );
        })}
      </section>

      <section className="hub-facts" aria-label={h.factsTitle}>
        {h.facts.map(([big, small]) => (
          <div key={big} className="hub-fact">
            <strong>{big}</strong>
            <span>{small}</span>
          </div>
        ))}
      </section>
    </>
  );
}
