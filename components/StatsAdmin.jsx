"use client";

import { useState } from "react";

const PERIODS = [["today", "Today"], ["week", "Last 7 days"], ["month", "Last 30 days"], ["all", "All time"]];
const PAGE_NAMES = {
  "/": "Home page",
  "/guide": "Streamer guide",
  "/agency": "Agency guide",
  "/beauty-bonus": "Beauty Bonus — apply",
  "/beauty-bonus/rules": "Beauty Bonus — rules",
  "/beauty-bonus/results": "Beauty Bonus — results",
};
const CLICK_NAMES = {
  "start-streaming": "“Start streaming” buttons",
  support: "Support buttons",
  "agency-manager": "Agency guide → message manager (WhatsApp)",
  "agency-panel": "Agency guide → agency panel",
  "cafe-app": "Agency guide → Cafe app",
  telegram: "Footer → Telegram",
  instagram: "Footer → Instagram",
  tiktok: "Footer → TikTok",
  "card:guide": "Home card → Streamer guide",
  "card:agency": "Home card → Agency guide",
  "card:beautybonus": "Home card → Beauty Bonus",
  "bb-apply": "Beauty Bonus → “Apply now”",
  "bb-check-status": "Beauty Bonus → “Check your status”",
};
const clickName = (k) => {
  if (CLICK_NAMES[k]) return CLICK_NAMES[k];
  if (k.startsWith("hot:")) return `HOT! button → ${k.slice(4)} contest`;
  if (k.startsWith("contest:")) return `Contest card → ${k.slice(8)} contest`;
  if (k.startsWith("link:")) return `Other link → ${k.slice(5)}`;
  return k;
};

function Table({ title, rows, empty }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <section className="set-card">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="muted small">{empty}</p>
      ) : (
        <div className="stat-rows">
          {rows.map(([label, n]) => (
            <div key={label} className="stat-row">
              <span className="stat-label">{label}</span>
              <span className="stat-bar" aria-hidden="true"><span style={{ width: `${(n / max) * 100}%` }} /></span>
              <strong>{n.toLocaleString("en-US")}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function StatsAdmin({ data, daily, apps }) {
  const [period, setPeriod] = useState("week");
  const d = data[period] || {};
  const views = Object.entries(d).filter(([k]) => k.startsWith("view:")).map(([k, v]) => [PAGE_NAMES[k.slice(5)] || k.slice(5), v]).sort((a, b) => b[1] - a[1]);
  const clicks = Object.entries(d).filter(([k]) => k.startsWith("click:")).map(([k, v]) => [clickName(k.slice(6)), v]).sort((a, b) => b[1] - a[1]);
  const totalViews = views.reduce((a, [, v]) => a + v, 0);
  const max = Math.max(1, ...daily.map((x) => x.visitors));

  return (
    <div className="admin-section settings">
      <div className="admin-sub-top">
        <p className="muted">Visits and button clicks on the public site (admin pages aren't counted). Updates live.</p>
        <div className="tabs period-tabs" role="tablist">
          {PERIODS.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={period === k} className={period === k ? "on" : ""} onClick={() => setPeriod(k)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="stats">
        <div className="stat"><span>{(d.visitors || 0).toLocaleString("en-US")}</span>Visitors</div>
        <div className="stat"><span>{totalViews.toLocaleString("en-US")}</span>Page views</div>
        <div className="stat accepted"><span>{(d["click:start-streaming"] || 0).toLocaleString("en-US")}</span>“Start streaming” clicks</div>
        <div className="stat pending"><span>{apps[period].bb}</span>Beauty Bonus applications</div>
        <div className="stat conditional"><span>{apps[period].agency}</span>Agency applications</div>
      </div>

      <section className="set-card">
        <h2>Visitors per day · last 30 days</h2>
        <div className="day-chart" role="img" aria-label="Visitors per day for the last 30 days">
          {daily.map((x) => (
            <div key={x.day} className="day-col" title={`${x.day}: ${x.visitors} visitors, ${x.views} page views`}>
              <span className="day-bar" style={{ height: `${Math.max(2, (x.visitors / max) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="day-axis"><span>{daily[0]?.day}</span><span>{daily[daily.length - 1]?.day}</span></div>
      </section>

      <div className="stats-two">
        <Table title="Pages opened" rows={views} empty="No visits in this period yet." />
        <Table title="Buttons clicked" rows={clicks} empty="No clicks in this period yet." />
      </div>
      <p className="hint">A visitor is counted once per day per device. Clicks are counted every time a button is pressed.</p>
    </div>
  );
}
