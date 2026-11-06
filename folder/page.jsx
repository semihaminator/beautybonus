import ApplyForm from "@/components/ApplyForm";
import { Socials } from "@/components/SiteChrome";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { upcomingMonths } from "@/lib/months";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const t = getDict(locale);
  const months = upcomingMonths(new Date(), 6, locale);
  return (
    <>
      <section className="hero">
        <img src="/img/hero.webp" alt="Salsa Beauty Bonus" className="hero-img" width="1672" height="941" />
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="visually-hidden">Salsa Beauty Bonus</h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="hero-actions">
            <a href="#apply" className="btn">{t.hero.apply}</a>
            <a href="/results" className="btn ghost">{t.hero.check}</a>
          </div>
        </div>
      </section>

      <div className="disclaimer" role="note">
        <span className="disclaimer-day">13</span>
        <p dangerouslySetInnerHTML={{ __html: t.disclaimer }} />
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
        <Socials />
      </section>
    </>
  );
}
