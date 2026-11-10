import AgencyForm from "@/components/AgencyForm";
import GuideTabs from "@/components/guide/GuideTabs";
import { Bullets, Callout, Feat, GIcon, GuideHero, Ico, LinkButton, Rich, SecHead, Steps } from "@/components/guide/parts";
import ContestCards from "@/components/ContestCards";
import { PreviewNote } from "@/components/PreviewNote";
import { getLiveContests } from "@/lib/contests";
import { getSite } from "@/lib/site";
import { AGENCY_GUIDE, AGENCY_TABLES } from "@/lib/content/agencyGuide";
import { getLocale } from "@/lib/locale";
import { requireSection } from "@/lib/sections";

export const dynamic = "force-dynamic";

const IDS = ["about", "become", "add", "panel", "earnings", "payouts", "apply"];
const TAB_ICONS = ["sparkle", "building", "users", "panel", "coin", "wallet", "form"];

export async function generateMetadata() {
  const t = AGENCY_GUIDE[await getLocale()] || AGENCY_GUIDE.en;
  return { title: t.htmlTitle };
}

export default async function AgencyGuidePage() {
  const { settings, preview } = await requireSection("agency");
  const locale = await getLocale();
  const liveContests = await getLiveContests("agencies");
  const site = getSite(locale);
  const t = AGENCY_GUIDE[locale] || AGENCY_GUIDE.en;
  const { s1, s2, s3, s4, s5, s6, form } = t;
  const L = settings.links;
  const nf = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-US");
  const tabs = IDS.map((id, i) => ({ id, label: t.tabs[i], icon: TAB_ICONS[i] }));
  const range = ([from, to]) => (to ? `${nf.format(from)} – ${nf.format(to)}` : `${nf.format(from)} ${s5.andMore}`);

  return (
    <div className="guide">
      {preview && <PreviewNote />}
      <GuideTabs items={tabs} />
      <div className="g-wrap">
        <GuideHero eyebrow={t.eyebrow} title={t.heroTitle} lead={t.heroLead} badgeTop={t.badgeTop} badgeSub={t.badgeSub} img="/img/agency-3d.webp" imgW={760} imgH={444} chips={tabs} />
        <ContestCards contests={liveContests} locale={locale} s={site} title={site.contests.guideTitle} compact />

        <section className="g-sec" id="about">
          <SecHead n={1} kicker={s1.kicker} title={s1.title} lead={s1.lead} />
          <p className="g-text">{s1.text}</p>
          <h3 className="g-sub">{t.glossaryTitle}</h3>
          <dl className="g-glossary">
            {t.glossary.map(([ic, term, def]) => (
              <div key={term} className="g-term">
                <dt><Ico name={ic} /><span>{term}</span></dt>
                <dd>{def}</dd>
              </div>
            ))}
          </dl>
          <h3 className="g-sub">{s1.formatsTitle}</h3>
          <div className="g-grid g3">{s1.formats.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <h3 className="g-sub">{s1.advTitle}</h3>
          <div className="g-grid g3">{s1.adv.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <p className="g-tagline">{s1.tagline}</p>
        </section>

        <section className="g-sec" id="become">
          <SecHead n={2} kicker={s2.kicker} title={s2.title} />
          <h3 className="g-sub first">{s2.reqTitle}</h3>
          <p className="g-text">{s2.reqLead}</p>
          <div className="g-reqs">
            {s2.reqs.map(([ic, b, l]) => (
              <div key={b} className="g-req"><Ico name={ic} /><strong>{b}</strong><p>{l}</p></div>
            ))}
          </div>
          <p className="g-foot">{s2.reqFoot}</p>
          <div className="g-beauty promo">
            <div>
              <h3>{s2.promoTitle}</h3>
              <p>{s2.promoText}</p>
              <span className="g-threshold"><GIcon name="gift" size={18} />{s2.promoCalc}</span>
              <p className="g-small g-muted"><Rich text={s2.promoNote} /></p>
            </div>
            <div className="g-prize"><strong>$950</strong><span>{s2.promoCalc}</span></div>
          </div>
          <Callout icon="panel" text={s2.reqAfter} />

          <div className="g-grid g2 top" style={{ marginTop: 34 }}>
            <div className="g-card">
              <h3>{s2.dataTitle}</h3>
              <ul className="g-checks">{s2.data.map((d) => <li key={d}><GIcon name="check" size={18} />{d}</li>)}</ul>
              <p className="g-muted g-small"><Rich text={s2.idHint} /></p>
            </div>
            <div className="g-card g-card-accent">
              <Ico name="send" />
              <h3>{s2.sendTitle}</h3>
              <p>{s2.send}</p>
              <div className="g-actions">
                <LinkButton href="#apply" icon="form">{s2.sendForm}</LinkButton>
                <LinkButton href={L.agencyManager} ghost icon="support" track="agency-manager">{s2.sendWhatsapp}</LinkButton>
              </div>
            </div>
          </div>

          <h3 className="g-sub">{s2.afterTitle}</h3>
          <Steps items={s2.after.map(([title, text, pills]) => ({ title, text, pills }))} />
        </section>

        <section className="g-sec" id="add">
          <SecHead n={3} kicker={s3.kicker} title={s3.title} />
          <h3 className="g-sub first">{s3.refTitle}</h3>
          <Callout icon="alert" tone="warn" text={s3.refWarn} />
          <div style={{ marginTop: 22 }}>
            <Steps compact items={s3.refSteps.map((title) => ({ title }))} />
          </div>
          <div className="g-actions"><LinkButton href={L.agencyPanel} icon="panel" track="agency-panel">{s3.panelCta}</LinkButton></div>

          <h3 className="g-sub">{s3.alreadyTitle}</h3>
          <div className="g-grid g2">{s3.already.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>

          <h3 className="g-sub">{s3.androidTitle}</h3>
          <div className="g-grid g2 top">
            <Feat icon="android" title="Cafe" text={s3.android}>
              {L.cafeApp && <div className="g-actions"><LinkButton href={L.cafeApp} ghost icon="android" track="cafe-app">{s3.androidCta}</LinkButton></div>}
            </Feat>
            <Callout icon="alert" tone="warn" title={s3.notesTitle}>
              <Bullets items={s3.notes} />
            </Callout>
          </div>
        </section>

        <section className="g-sec" id="panel">
          <SecHead n={4} kicker={s4.kicker} title={s4.title} lead={s4.lead} />
          <div className="g-actions" style={{ marginTop: -8, marginBottom: 8 }}>
            <LinkButton href={L.agencyPanel} ghost icon="panel" track="agency-panel">{L.agencyPanel.replace(/^https?:\/\//, "").replace(/\/$/, "")}</LinkButton>
          </div>
          <h3 className="g-sub">{s4.sectionsTitle}</h3>
          <div className="g-grid g3">{s4.sections.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <h3 className="g-sub">{s4.canTitle}</h3>
          <Bullets items={s4.can} />
          <Callout icon="sparkle" title={s4.tipLabel} text={s4.tip} />
        </section>

        <section className="g-sec" id="earnings">
          <SecHead n={5} kicker={s5.kicker} title={s5.title} lead={s5.lead} />
          <div className="g-grid g2 top">
            <div className="g-card">
              <div className="g-card-row"><Ico name="calendar" /><div><h3>{s5.payTitle}</h3></div></div>
              <Bullets items={s5.pay} />
            </div>
            <div className="g-card">
              <div className="g-card-row"><Ico name="wallet" /><div><h3>{s5.withdrawTitle}</h3></div></div>
              <ul className="g-pills">{s5.withdraw.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
          </div>

          <h3 className="g-sub">{s5.commTitle}</h3>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th>{s5.commHead[0]} ({s5.coins})</th><th className="num">{s5.commHead[1]}</th></tr></thead>
              <tbody>
                {AGENCY_TABLES.commission.map((row, i) => (
                  <tr key={row[0]} className={i === AGENCY_TABLES.commission.length - 1 ? "top" : ""}>
                    <td>{range(row)}</td>
                    <td className="num">${row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="g-foot">{s5.commNote}</p>

          <div className="g-beauty">
            <div>
              <h3>{s5.topTitle}</h3>
              <p>{s5.top}</p>
            </div>
            <div className="g-prize"><strong>{s5.topAmount}</strong><span>{s5.topSub}</span></div>
          </div>

          <h3 className="g-sub">{s5.newTitle}</h3>
          <Callout icon="bolt" tone="ok" text={s5.newAuto} />
          <p className="g-text" style={{ marginTop: 18 }}>{s5.newLead}</p>
          <div className="g-grid g2 top" style={{ marginTop: 14 }}>
            <div className="g-table-wrap">
              <table className="g-table">
                <thead><tr><th>{s5.newHead[0]}</th><th className="num">{s5.newHead[1]}</th></tr></thead>
                <tbody>
                  {s5.newRows.map((label, i) => (
                    <tr key={label}><td>{label}</td><td className="num">${AGENCY_TABLES.newStreamerBonus[i]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Callout icon="alert" tone="warn" text={s5.newWarn} />
          </div>

          <div className="g-beauty">
            <div>
              <h3>{s5.monthTitle}</h3>
              <p>{s5.month}</p>
            </div>
            <div className="g-prize"><strong>{s5.monthAmount}</strong><span>10 × 9 750</span></div>
          </div>
          <div className="g-grid g2 top" style={{ marginTop: 14 }}>
            <div className="g-card">
              <h3>{s5.monthCondTitle}</h3>
              <Bullets items={s5.monthCond} />
            </div>
            <div className="g-stack">
              <h3>{s5.inviteTitle}</h3>
              <Steps compact items={s5.invite.map((title) => ({ title }))} />
            </div>
          </div>
          <Callout icon="alert" tone="warn" text={s5.inviteWarn} />
        </section>

        <section className="g-sec" id="payouts">
          <SecHead n={6} kicker={s6.kicker} title={s6.title} lead={s6.lead} />
          <div className="g-grid g2">{s6.options.map(([ic, ti, p]) => <Feat key={ti} icon={ic} title={ti} text={p} />)}</div>
          <Callout icon="alert" tone="warn" text={s6.warn} />
          <h3 className="g-sub">{s6.summaryTitle}</h3>
          <div className="g-card"><Bullets items={s6.summary} /></div>
        </section>

        <section className="g-sec" id="apply">
          <SecHead n={7} kicker={form.kicker} title={form.title} lead={form.lead} />
          <Callout icon="gift" title={s2.promoTitle} text={s2.promoText} />
          <div className="apply-card wide-card" style={{ marginTop: 18 }}>
            <AgencyForm t={form} locale={locale} whatsapp={L.agencyManager} />
          </div>
        </section>
      </div>
    </div>
  );
}
