import CallCalculator from "@/components/guide/CallCalculator";
import GuideTabs from "@/components/guide/GuideTabs";
import { Bullets, Callout, Feat, GIcon, GuideHero, Ico, LinkButton, Rich, SecHead, Steps } from "@/components/guide/parts";
import { PreviewNote } from "@/components/PreviewNote";
import { STREAMER_GUIDE } from "@/lib/content/streamerGuide";
import { getLocale } from "@/lib/locale";
import { requireSection } from "@/lib/sections";

export const dynamic = "force-dynamic";

const IDS = ["about", "start", "verify", "formats", "earnings", "bonuses", "withdraw"];
const TAB_ICONS = ["sparkle", "rocket", "idcard", "live", "coin", "gift", "wallet"];
const SALARY = [[312000, 480], [208000, 320], [182000, 280], [130000, 200], [78000, 120], [39000, 60], [26000, 40], [19500, 30, "min"], [9750, 15, "first"], [650, 1]];

export async function generateMetadata() {
  const t = STREAMER_GUIDE[await getLocale()] || STREAMER_GUIDE.en;
  return { title: t.htmlTitle };
}

export default async function StreamerGuidePage() {
  const { settings, preview } = await requireSection("guide");
  const locale = await getLocale();
  const t = STREAMER_GUIDE[locale] || STREAMER_GUIDE.en;
  const { s1, s2, s3, s4, s5, s6, s7 } = t;
  const L = settings.links;
  const nf = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-US");
  const tabs = IDS.map((id, i) => ({ id, label: t.tabs[i], icon: TAB_ICONS[i] }));

  return (
    <div className="guide">
      {preview && <PreviewNote />}
      <GuideTabs items={tabs} />
      <div className="g-wrap">
        <GuideHero eyebrow={t.eyebrow} title={t.heroTitle} lead={t.heroLead} badgeTop={t.badgeTop} badgeSub={t.badgeSub} img="/img/guide-hero.webp" chips={tabs} />

        <section className="g-sec" id="about">
          <SecHead n={1} kicker={s1.kicker} title={s1.title} lead={s1.lead} />
          <div className="g-grid g3">{s1.about.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <h3 className="g-sub">{s1.whyTitle}</h3>
          <div className="g-grid g3">{s1.why.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <Callout icon="heart" title={s1.joinTitle} text={s1.join}>
            <div className="g-actions"><LinkButton href={L.startStreaming} icon="rocket">{s1.joinCta}</LinkButton></div>
          </Callout>
        </section>

        <section className="g-sec" id="start">
          <SecHead n={2} kicker={s2.kicker} title={s2.title} />
          <h3 className="g-sub">{s2.reqTitle}</h3>
          <div className="g-reqs">
            {s2.reqs.map(([ic, b, l]) => (
              <div key={b} className="g-req"><Ico name={ic} /><strong>{b}</strong><p>{l}</p></div>
            ))}
          </div>
          <p className="g-foot">{s2.reqFoot}</p>
          <h3 className="g-sub">{s2.stepsTitle}</h3>
          <Steps items={s2.steps.map(([title, text, pills]) => ({ title, text, pills }))} />
        </section>

        <section className="g-sec" id="verify">
          <SecHead n={3} kicker={s3.kicker} title={s3.title} lead={s3.lead} />
          <Steps items={s3.steps.map(([title, text]) => ({ title, text }))} />
          <Callout icon="lock" title={s3.safeTitle} text={s3.safe} />
        </section>

        <section className="g-sec" id="formats">
          <SecHead n={4} kicker={s4.kicker} title={s4.title} lead={s4.lead} />
          <div className="g-grid g2">
            {s4.formats.map((f) => (
              <Feat key={f.title} icon={f.icon} title={f.title} text={f.text}>
                {f.split && (
                  <div className="g-split">{f.split.map(([b, p]) => <div key={b}><b>{b}</b><p>{p}</p></div>)}</div>
                )}
                <div className="g-meta">
                  <div className="g-meta-row"><span>{s4.good}</span><p>{f.good}</p></div>
                  {f.tip && <div className="g-meta-row tip"><span>{s4.tip}</span><p>{f.tip}</p></div>}
                </div>
              </Feat>
            ))}
          </div>
        </section>

        <section className="g-sec" id="earnings">
          <SecHead n={5} kicker={s5.kicker} title={s5.title} />
          <div className="g-rate"><span className="g-rate-big">1 $ = 650 <small>{s5.coins}</small></span><p>{s5.rate}</p></div>

          <h3 className="g-sub">{s5.callsTitle}</h3>
          <div className="g-grid g2">
            {s5.calls.map(([n, p]) => (
              <div key={n} className="g-price"><div className="g-price-n"><strong>{n}</strong><span>{s5.unit}</span></div><p>{p}</p></div>
            ))}
          </div>
          <Callout icon="up" text={s5.longer} />

          <h3 className="g-sub">{s5.raiseTitle}</h3>
          <div className="g-grid g2 top">
            <div className="g-card">
              <p>{s5.raise}</p>
              <div className="g-rate-pills"><span className="base">120</span><span>240</span><span>360</span><span>480</span></div>
              <h3>{s5.raiseRulesTitle}</h3>
              <Bullets items={s5.raiseRules} />
            </div>
            <CallCalculator t={s5} locale={locale} />
          </div>

          <h3 className="g-sub">{s5.salaryTitle}</h3>
          <div className="g-grid g2 top">
            <div className="g-table-wrap">
              <table className="g-table">
                <thead><tr><th>{s5.salaryHead[0]}</th><th className="num">{s5.salaryHead[1]}</th></tr></thead>
                <tbody>
                  {SALARY.map(([c, d, m]) => (
                    <tr key={c} className={m ? "mark" : ""}>
                      <td>
                        {nf.format(c)}
                        {m === "min" && <span className="g-tag">{s5.tagMin}</span>}
                        {m === "first" && <span className="g-tag first">{s5.tagFirst}</span>}
                      </td>
                      <td className="num">${d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="g-stack">
              <h3>{s5.minTitle}</h3>
              <div className="g-min">
                {s5.min.map(([a, c, p]) => (
                  <div key={a} className="g-min-item"><strong>{a}</strong><span className="coins">{c}</span><p>{p}</p></div>
                ))}
              </div>
              <p className="g-muted g-small">{s5.minNote}</p>
              <p className="g-foot">{s5.salaryFoot}</p>
            </div>
          </div>

          <h3 className="g-sub">{s5.howTitle}</h3>
          <div className="g-grid g2">{s5.how.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
        </section>

        <section className="g-sec" id="bonuses">
          <SecHead n={6} kicker={s6.kicker} title={s6.title} />
          <h3 className="g-sub">{s6.regularTitle}</h3>
          <div className="g-grid g3">{s6.regular.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <div className="g-beauty">
            <div>
              <h3>Beauty Bonus</h3>
              <p>{s6.beautyText}</p>
              <span className="g-threshold"><GIcon name="check" size={18} />{s6.beautyThreshold}</span>
              <p>{s6.beautyApply}</p>
              {settings.sections.beautyBonus && <div className="g-actions"><LinkButton href="/beauty-bonus/rules" ghost>Beauty Bonus →</LinkButton></div>}
            </div>
            <div className="g-prize"><strong>{s6.prize}</strong><span>{s6.prizeSub}</span></div>
          </div>

          <h3 className="g-sub">{s6.featuresTitle}</h3>
          <div className="g-grid g2">
            {s6.features.map(([ic, ti, p, list]) => (
              <Feat key={ti} icon={ic} title={ti} text={p}>{list.length > 0 && <Bullets items={list} />}</Feat>
            ))}
          </div>
          <Callout icon="gift" title={s6.giftsTitle} text={s6.gifts} />

          <h3 className="g-sub">{s6.refTitle}</h3>
          <div className="g-grid g2 top">
            <div>
              <p className="g-muted" style={{ marginBottom: 14 }}>{s6.refLead}</p>
              <Steps compact items={s6.ref.map(([title, text]) => ({ title, text }))} />
            </div>
            <div className="g-stack">
              <Feat icon="users" title={s6.trackTitle} text={s6.track}>
                <div className="g-status"><span className="on">{s6.trackOn}</span><span className="ok">{s6.trackOk}</span></div>
              </Feat>
              <Feat icon="crown" title={s6.extraTitle} text={s6.extra}>
                <div className="g-pairs">
                  {s6.extraRows.map(([a, b]) => <div key={a} className="g-pair"><span>{a}</span><strong>{b}</strong></div>)}
                </div>
              </Feat>
            </div>
          </div>
          <Callout icon="alert" tone="warn" text={s6.extraWarn} />
        </section>

        <section className="g-sec" id="withdraw">
          <SecHead n={7} kicker={s7.kicker} title={s7.title} />
          <Steps compact items={s7.steps.map((text) => ({ title: text }))} />
          <span className="g-done"><GIcon name="check" size={22} />{s7.done}</span>
        </section>

        <section className="g-end">
          <h2>{t.endTitle}</h2>
          <p className="g-muted"><Rich text={t.endText} /></p>
          <div className="g-actions center">
            <LinkButton href={L.startStreaming} icon="rocket">{t.endStart}</LinkButton>
            <LinkButton href={L.support} ghost icon="support">{t.endSupport}</LinkButton>
          </div>
        </section>
      </div>
    </div>
  );
}
