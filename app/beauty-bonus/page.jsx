import ApplyForm from "@/components/ApplyForm";
import { BBNav, Socials } from "@/components/SiteChrome";
import { PreviewNote } from "@/components/PreviewNote";
import { requireSection } from "@/lib/sections";
import { getSite } from "@/lib/site";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { upcomingMonths } from "@/lib/months";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: getDict(await getLocale()).meta.title };
}

export default async function BeautyBonusPage() {
  const { settings, preview } = await requireSection("beautyBonus");
  const locale = await getLocale();
  const site = getSite(locale);
  const t = getDict(locale);
  const months = upcomingMonths(new Date(), 6, locale);
  return (
    <>
      {preview && <PreviewNote />}
      <BBNav s={site} current="apply" />
      <section className="hero">
        <img src="/img/hero.webp" alt="Salsa Beauty Bonus" className="hero-img" width="1672" height="941" />
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="visually-hidden">Salsa Beauty Bonus</h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="bb-prize"><strong>{t.hero.prize}</strong><span>{t.hero.prizeSub}</span></div>
          <div className="hero-actions">
            <a href="#apply" className="btn">{t.hero.apply}</a>
            <a href="/beauty-bonus/results" className="btn ghost">{t.hero.check}</a>
          </div>
        </div>
      </section>

      <div className="disclaimer" role="note">
        <span className="disclaimer-day">13</span>
        <div className="disclaimer-text">
          <p dangerouslySetInnerHTML={{ __html: t.disclaimer }} />
          <a href="/beauty-bonus/rules" className="disclaimer-link">{t.rulesLink} →</a>
        </div>
      </div>

      <section id="apply" className="apply-section">
        <div className="apply-card">
          <img src="/img/beauty-bonus-script.webp" alt="Beauty Bonus" className="card-script" />
          <h2 className="card-title">{t.form.title}</h2>
          <ApplyForm months={months} t={t.form} locale={locale} />
        </div>
      </section>

      <section className="community">
        <h2 className="section-title">{t.community.title}</h2>
        <p className="muted">{t.community.text}</p>
        <Socials settings={settings} />
      </section>
    </>
  );
}
