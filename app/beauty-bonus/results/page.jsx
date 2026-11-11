import ResultsBoard from "@/components/ResultsBoard";
import Link from "next/link";
import { getStatuses, listRounds, ROUND_RE } from "@/lib/db";
import { monthLabel } from "@/lib/months";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BBNav } from "@/components/SiteChrome";
import { PreviewNote } from "@/components/PreviewNote";
import { requireSection } from "@/lib/sections";
import { getSite } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: getDict(await getLocale()).meta.resultsTitle };
}

export default async function ResultsPage({ searchParams }) {
  const { preview } = await requireSection("beautyBonus");
  const locale = await getLocale();
  const t = getDict(locale).results;
  let statuses = {};
  let rounds = [];
  let round = "";
  let failed = false;
  try {
    rounds = await listRounds(); // newest first
    const asked = String((await searchParams)?.round || "");
    round = ROUND_RE.test(asked) && rounds.includes(asked) ? asked : rounds[0] || "";
    statuses = round ? await getStatuses(round) : {};
  } catch (err) {
    console.error(err);
    failed = true;
  }
  const groups = { accepted: [], conditional: [], rejected: [] };
  for (const [id, s] of Object.entries(statuses)) groups[s]?.push(id);
  for (const k in groups) groups[k].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <>
    {preview && <PreviewNote />}
    <BBNav s={getSite(locale)} current="results" />
    <section className="results-section">
      <img src="/img/beauty-bonus-script.webp" alt="Beauty Bonus" className="page-script" />
      <h1 className="page-title">{t.title}</h1>
      <p className="muted center">{t.intro}</p>
      {failed ? (
        <p className="form-error center">{t.unavailable}</p>
      ) : !round ? (
        <p className="lookup none">{t.noRounds}</p>
      ) : (
        <>
          <div className="round-picker">
            <span>{t.roundLabel}</span>
            <nav className="subnav rounds" aria-label={t.roundLabel}>
              {rounds.map((m) => (
                <Link key={m} href={`/beauty-bonus/results?round=${m}`} className={m === round ? "on" : ""} aria-current={m === round ? "page" : undefined}>
                  {monthLabel(m, locale)}
                </Link>
              ))}
            </nav>
          </div>
          <ResultsBoard key={round} groups={groups} t={t} />
        </>
      )}
    </section>
    </>
  );
}
