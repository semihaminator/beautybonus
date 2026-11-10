import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getRules } from "@/lib/rules";
import { BBNav } from "@/components/SiteChrome";
import { PreviewNote } from "@/components/PreviewNote";
import { requireSection } from "@/lib/sections";
import { getSite } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: getDict(await getLocale()).meta.rulesTitle };
}

export default async function RulesPage() {
  const { preview } = await requireSection("beautyBonus");
  const locale = await getLocale();
  const r = getRules(locale);
  return (
    <>
    {preview && <PreviewNote />}
    <BBNav s={getSite(locale)} current="rules" />
    <article className="rules">
      <img src="/img/beauty-bonus-script.webp" alt="Beauty Bonus" className="page-script" />
      <h1 className="page-title">{r.title}</h1>
      <p className="muted center">{r.intro}</p>

      <section className="rules-block">
        <div className="bb-prize-block">
          <div>
            <h2 className="rules-h">{r.prizeTitle}</h2>
            <p>{r.prizeText}</p>
          </div>
          <strong>{r.prize}</strong>
        </div>
      </section>

      <section className="rules-block">
        <h2 className="rules-h">{r.cycleTitle}</h2>
        <ol className="cycle">
          {r.cycle.map((c) => (
            <li key={c.day} className="cycle-step">
              <span className="cycle-day">{c.day}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rules-block">
        <h2 className="rules-h">{r.startTitle}</h2>
        <div className="start-rows">
          {r.start.map((s, i) => (
            <div key={i} className="start-row">
              <span className="start-when">{s.when}</span>
              <span className="start-arrow" aria-hidden="true">→</span>
              <span className="start-then">{s.then}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rules-block">
        <h2 className="rules-h">{r.reqTitle}</h2>
        <div className="reqs">
          {r.reqs.map((q) => (
            <div key={q.label} className="req">
              <span className="req-big">{q.big}</span>
              <span className="req-label">{q.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rules-block">
        <h2 className="rules-h">{r.tiersTitle}</h2>
        <div className="tiers">
          {r.tiers.map((t) => (
            <div key={t.kind} className={`tier ${t.kind}`}>
              <span className="tier-icon" aria-hidden="true">
                {{ bad: "✕", warn: "!", ok: "✓", top: "★" }[t.kind]}
              </span>
              <div>
                <h3>{t.range}</h3>
                <p>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rules-block two">
        <div className="panel">
          <h2 className="rules-h">{r.remindersTitle}</h2>
          <ul className="bullets">
            {r.reminders.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="panel">
          <h2 className="rules-h">{r.qualityTitle}</h2>
          <ul className="bullets">
            {r.quality.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="rules-block">
        <div className="panel fines">
          <div className="fines-head">
            <h2 className="rules-h">{r.finesTitle}</h2>
            <div className="fine-amount">
              <span>{r.finesAmountLabel}</span>
              <strong>{r.finesAmount}</strong>
            </div>
          </div>
          <p>{r.finesIntro}</p>
          <p className="fines-when">{r.finesWhen}</p>
          <ul className="bullets">
            {r.fines.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          <p className="muted small">{r.finesNote}</p>
        </div>
      </section>

      <section className="rules-cta">
        <h2 className="section-title">{r.ctaTitle}</h2>
        <a href="/beauty-bonus#apply" className="btn">{r.cta}</a>
      </section>
    </article>
    </>
  );
}
