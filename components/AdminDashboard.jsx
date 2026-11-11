"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { monthLabel, upcomingMonths } from "@/lib/months";

const LABELS = { pending: "Pending", accepted: "Accepted", conditional: "Conditional", rejected: "Rejected" };
const ORDER = ["pending", "accepted", "conditional", "rejected"];

async function post(url, body) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function AdminDashboard({ apps, statuses, error }) {
  // statuses: { "2026-11": { appId: status }, "2026-12": {...} } — results are per round (start month)
  const router = useRouter();
  const [tab, setTab] = useState("applications");
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState("");
  const [toast, setToast] = useState("");
  const [bulk, setBulk] = useState("");
  const [bulkStatus, setBulkStatus] = useState("accepted");
  const [lightbox, setLightbox] = useState("");

  // Rounds the result lists can be edited for: any round with results, any month someone applied for, and the next 3 starts.
  const roundOptions = useMemo(() => {
    const set = new Set([...Object.keys(statuses), ...apps.map((a) => a.startMonth), ...upcomingMonths(new Date(), 3).map((m) => m.value)]);
    return [...set].filter(Boolean).sort().reverse();
  }, [statuses, apps]);
  const [listRound, setListRound] = useState(() => Object.keys(statuses).sort().reverse()[0] || roundOptions[0] || "");

  const flash = (t) => {
    setToast(t);
    setTimeout(() => setToast(""), 2500);
  };

  const statusOf = (a) => statuses[a.startMonth]?.[a.appId] || "pending";
  // This ID's results in other rounds, e.g. [["2026-11", "accepted"]]
  const historyOf = (a) => Object.entries(statuses).filter(([m, h]) => m !== a.startMonth && h[a.appId]).map(([m, h]) => [m, h[a.appId]]).sort();

  const months = useMemo(() => [...new Set(apps.map((a) => a.startMonth))].sort(), [apps]);

  // How many applications each in-app ID has for the same start month (duplicates).
  const idCounts = useMemo(() => {
    const c = {};
    apps.forEach((a) => (c[`${a.startMonth}|${a.appId}`] = (c[`${a.startMonth}|${a.appId}`] || 0) + 1));
    return c;
  }, [apps]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return apps.filter(
      (a) =>
        (!month || a.startMonth === month) &&
        (!statusFilter || statusOf(a) === statusFilter) &&
        (!s || [a.appId, a.email, a.phone].some((v) => String(v).toLowerCase().includes(s)))
    );
  }, [apps, q, month, statusFilter, statuses]);

  const counts = useMemo(() => {
    const list = month ? apps.filter((a) => a.startMonth === month) : apps;
    const c = { total: list.length, pending: 0, accepted: 0, conditional: 0, rejected: 0 };
    list.forEach((a) => c[statusOf(a)]++);
    return c;
  }, [apps, statuses, month]);

  const lists = useMemo(() => {
    const g = { accepted: [], conditional: [], rejected: [] };
    Object.entries(statuses[listRound] || {}).forEach(([id, s]) => g[s]?.push(id));
    Object.values(g).forEach((l) => l.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));
    return g;
  }, [statuses, listRound]);

  async function changeStatus(appId, status, round) {
    setBusyId(`${round}|${appId}`);
    try {
      await post("/api/admin/status", { ids: [appId], status, round });
      flash(`${appId} · ${monthLabel(round)} → ${LABELS[status]}`);
      router.refresh();
    } catch (e) {
      flash(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function remove(app) {
    if (!confirm(`Delete the application from ${app.appId}? This also deletes the photo and can't be undone.`)) return;
    setBusyId(app.id);
    const res = await fetch(`/api/admin/applications/${app.id}`, { method: "DELETE" });
    setBusyId("");
    flash(res.ok ? "Application deleted" : "Could not delete");
    router.refresh();
  }

  async function addBulk(e) {
    e.preventDefault();
    try {
      const { count } = await post("/api/admin/status", { ids: bulk, status: bulkStatus, round: listRound });
      flash(`${count} ID${count === 1 ? "" : "s"} saved as ${LABELS[bulkStatus]} for ${monthLabel(listRound)}`);
      setBulk("");
      router.refresh();
    } catch (err) {
      flash(err.message);
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-sub-top">
        <p className="muted">Beauty Bonus applications and public result lists</p>
        <a className="btn ghost small" href="/api/admin/export">Export CSV</a>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="stats">
        <div className="stat"><span>{counts.total}</span>Applications</div>
        <div className="stat pending"><span>{counts.pending}</span>Pending</div>
        <div className="stat accepted"><span>{counts.accepted}</span>Accepted</div>
        <div className="stat conditional"><span>{counts.conditional}</span>Conditional</div>
        <div className="stat rejected"><span>{counts.rejected}</span>Rejected</div>
      </div>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "applications"} className={tab === "applications" ? "on" : ""} onClick={() => setTab("applications")}>
          Applications
        </button>
        <button role="tab" aria-selected={tab === "lists"} className={tab === "lists" ? "on" : ""} onClick={() => setTab("lists")}>
          Result lists (public)
        </button>
      </div>

      {tab === "applications" ? (
        <>
          <div className="filters">
            <input type="search" placeholder="Search ID, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">All start months</option>
              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {ORDER.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="empty big">{apps.length ? "No applications match these filters." : "No applications yet."}</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Photo</th><th>In-app ID</th><th>Start</th><th>Email</th><th>Phone</th><th>Lang</th><th>Submitted</th><th>Status</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const s = statusOf(a);
                    const past = historyOf(a);
                    return (
                      <tr key={a.id}>
                        <td data-label="Photo">
                          <button className="thumb" onClick={() => setLightbox(`/api/admin/photo/${a.id}`)} aria-label={`View photo for ${a.appId}`}>
                            <img src={`/api/admin/photo/${a.id}`} alt="" loading="lazy" />
                          </button>
                        </td>
                        <td data-label="In-app ID" className="mono">
                          {a.appId}
                          {idCounts[`${a.startMonth}|${a.appId}`] > 1 && (
                            <span className="dup" title="This in-app ID applied more than once for the same start month">×{idCounts[`${a.startMonth}|${a.appId}`]}</span>
                          )}
                          {past.length > 0 && (
                            <span className="past">
                              {past.map(([m, st]) => <span key={m} className={`past-tag ${st}`}>{monthLabel(m).replace(/^13 /, "")}: {LABELS[st]}</span>)}
                            </span>
                          )}
                        </td>
                        <td data-label="Start">{monthLabel(a.startMonth)}</td>
                        <td data-label="Email"><a href={`mailto:${a.email}`}>{a.email}</a></td>
                        <td data-label="Phone"><a href={`tel:${a.phone.replace(/[^+\d]/g, "")}`}>{a.phone}</a></td>
                        <td data-label="Lang"><span className="lang-tag">{{ en: "EN", ru: "RU", uk: "UA" }[a.lang] || "EN"}</span></td>
                        <td data-label="Submitted">{new Date(a.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</td>
                        <td data-label="Status">
                          <select className={`status-select ${s}`} value={s} disabled={busyId === `${a.startMonth}|${a.appId}`} onChange={(e) => changeStatus(a.appId, e.target.value, a.startMonth)}>
                            {ORDER.map((o) => <option key={o} value={o}>{LABELS[o]}</option>)}
                          </select>
                        </td>
                        <td>
                          <button className="link-danger" disabled={busyId === a.id} onClick={() => remove(a)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="hint">A status belongs to the application’s start month only — setting December doesn’t change November. Small tags under an ID show its results in other months.</p>
        </>
      ) : (
        <>
          <div className="round-bar">
            <label htmlFor="list-round">Results for the bonus starting</label>
            <select id="list-round" value={listRound} onChange={(e) => setListRound(e.target.value)}>
              {roundOptions.map((m) => (
                <option key={m} value={m}>{monthLabel(m)}{statuses[m] ? ` · ${Object.keys(statuses[m]).length} IDs` : ""}</option>
              ))}
            </select>
            <a className="link-danger" href={`/beauty-bonus/results?round=${listRound}`} target="_blank" rel="noopener">See public page ↗</a>
          </div>
          <form className="bulk" onSubmit={addBulk}>
            <label htmlFor="bulk">Add in-app IDs to the {monthLabel(listRound)} lists</label>
            <textarea id="bulk" rows={4} placeholder="Paste one or more IDs — separated by commas, spaces or new lines" value={bulk} onChange={(e) => setBulk(e.target.value)} />
            <div className="bulk-row">
              <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
                <option value="accepted">Accepted</option>
                <option value="conditional">Conditionally accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="btn small" disabled={!bulk.trim()}>Save IDs</button>
            </div>
            <p className="hint">Within one month an ID can only be in one list — saving it again moves it. Other months are not affected.</p>
          </form>

          <div className="columns">
            {["accepted", "conditional", "rejected"].map((k) => (
              <div key={k} className={`col ${k}`}>
                <div className="col-head">
                  <h2>{k === "conditional" ? "Conditionally accepted" : LABELS[k]}</h2>
                  <span className="count">{lists[k].length}</span>
                </div>
                {lists[k].length ? (
                  <ul className="chips">
                    {lists[k].map((id) => (
                      <li key={id} className="chip removable">
                        {id}
                        <button aria-label={`Remove ${id}`} onClick={() => changeStatus(id, "pending", listRound)}>×</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty">No IDs yet</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox("")} role="dialog" aria-label="Photo">
          <img src={lightbox} alt="Applicant photo" />
          <a href={lightbox} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn small">Open original</a>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
