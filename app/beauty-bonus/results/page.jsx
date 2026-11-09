import ResultsBoard from "@/components/ResultsBoard";
import { getStatuses } from "@/lib/db";
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

export default async function ResultsPage() {
  const { preview } = await requireSection("beautyBonus");
  const locale = await getLocale();
  const t = getDict(locale).results;
  let statuses = {};
  let failed = false;
  try {
    statuses = await getStatuses();
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
      {failed ? <p className="form-error center">{t.unavailable}</p> : <ResultsBoard groups={groups} t={t} />}
    </section>
    </>
  );
}
