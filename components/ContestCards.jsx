import { GIcon } from "./guide/parts";

// Cards linking to live contests (via /c/<slug> short links, opened in a new tab).
export default function ContestCards({ contests, locale, s, title, compact = false }) {
  if (!contests.length) return null;
  const pick = (o) => o?.[locale] || o?.en || o?.ru || o?.uk || "";
  return (
    <section className={compact ? "contests compact" : "contests"} aria-label={title}>
      {title && <h2 className="contests-title"><span className="live-dot" aria-hidden="true" />{title}</h2>}
      <div className="contest-grid">
        {contests.map((c) => (
          <a key={c.slug} href={`/c/${c.slug}`} target="_blank" rel="noopener" className="contest-card" data-track={`contest:${c.slug}`}>
            <span className="contest-ico"><GIcon name={c.audience === "agencies" ? "building" : "trophy"} /></span>
            <span className="contest-body">
              <span className="contest-tag">
                <span className="live-dot" aria-hidden="true" />
                {s.contests.live} · {c.audience === "agencies" ? s.contests.forAgencies : c.audience === "streamers" ? s.contests.forStreamers : s.contests.forAll}
              </span>
              <span className="contest-name">{pick(c.title)}</span>
              {pick(c.text) && <span className="contest-text">{pick(c.text)}</span>}
            </span>
            <span className="contest-cta">{s.contests.open} ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
