"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/lib/i18n";

const KEYS = ["accepted", "conditional", "rejected"];

export default function ResultsBoard({ groups, t }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const found = useMemo(() => {
    if (!query) return null;
    return KEYS.find((k) => groups[k].some((id) => id.toLowerCase() === query)) || false;
  }, [query, groups]);

  const id = q.trim();

  return (
    <>
      <div className="search">
        <input type="search" placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.search} />
      </div>
      {query && (
        <div className={`lookup ${found || "none"}`} role="status">
          {found ? (
            <>
              <strong>{id}</strong> — {t[found].title}. {t[found].note}
            </>
          ) : (
            fmt(t.notFound, { id })
          )}
        </div>
      )}
      <div className="columns">
        {KEYS.map((k) => {
          const ids = query ? groups[k].filter((x) => x.toLowerCase().includes(query)) : groups[k];
          return (
            <div key={k} className={`col ${k}`}>
              <div className="col-head">
                <h2>{t[k].title}</h2>
                <span className="count">{groups[k].length}</span>
              </div>
              {ids.length ? (
                <ul className="chips">
                  {ids.map((x) => (
                    <li key={x} className={query && x.toLowerCase() === query ? "chip hit" : "chip"}>{x}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty">{query ? t.noMatch : t.noIds}</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
