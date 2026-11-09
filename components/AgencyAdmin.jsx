"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["new", "contacted", "approved", "rejected"];
const LABELS = { new: "New", contacted: "Contacted", approved: "Approved", rejected: "Rejected" };
const LANG = { en: "EN", ru: "RU", uk: "UA" };

export default function AgencyAdmin({ apps }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState("");
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [notes, setNotes] = useState({});
  const [confirmDel, setConfirmDel] = useState("");

  const flash = (t) => {
    setToast(t);
    setTimeout(() => setToast(""), 2500);
  };

  const counts = useMemo(() => {
    const c = { total: apps.length, new: 0, contacted: 0, approved: 0, rejected: 0 };
    apps.forEach((a) => (c[a.status] = (c[a.status] || 0) + 1));
    return c;
  }, [apps]);

  // Streamer IDs that appear in more than one agency application.
  const dupStreamers = useMemo(() => {
    const seen = {};
    apps.forEach((a) => (a.streamerIds || []).forEach((id) => (seen[id.toLowerCase()] = (seen[id.toLowerCase()] || 0) + 1)));
    return seen;
  }, [apps]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return apps.filter(
      (a) =>
        (!status || a.status === status) &&
        (!s || [a.name, a.agentId, a.email, a.phone, a.country, a.city, ...(a.streamerIds || [])].some((v) => String(v || "").toLowerCase().includes(s)))
    );
  }, [apps, q, status]);

  async function patch(id, body, msg) {
    setBusy(id);
    const res = await fetch(`/api/admin/agency/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy("");
    flash(res.ok ? msg : "Could not save");
    router.refresh();
  }

  async function remove(id) {
    setBusy(id);
    const res = await fetch(`/api/admin/agency/${id}`, { method: "DELETE" });
    setBusy("");
    setConfirmDel("");
    flash(res.ok ? "Application deleted" : "Could not delete");
    router.refresh();
  }

  return (
    <div className="admin-section">
      <div className="admin-sub-top">
        <p className="muted">Applications sent from the agency guide form</p>
        <a className="btn ghost small" href="/api/admin/agency-export">Export CSV</a>
      </div>

      <div className="stats">
        <div className="stat"><span>{counts.total}</span>Applications</div>
        <div className="stat pending"><span>{counts.new}</span>New</div>
        <div className="stat conditional"><span>{counts.contacted}</span>Contacted</div>
        <div className="stat accepted"><span>{counts.approved}</span>Approved</div>
        <div className="stat rejected"><span>{counts.rejected}</span>Rejected</div>
      </div>

      <div className="filters two">
        <input type="search" placeholder="Search name, ID, email, phone, country or streamer ID" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search agency applications" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty big">{apps.length ? "No applications match these filters." : "No agency applications yet. They appear here when someone sends the form on /agency."}</p>
      ) : (
        <div className="agency-list">
          {filtered.map((a) => {
            const isOpen = open === a.id;
            const note = notes[a.id] ?? a.note ?? "";
            return (
              <article key={a.id} className={`agency-item ${a.status}`}>
                <button className="agency-head" onClick={() => setOpen(isOpen ? "" : a.id)} aria-expanded={isOpen}>
                  <span className="agency-name">
                    <strong>{a.name || "—"}</strong>
                    <span className="mono">ID {a.agentId}</span>
                  </span>
                  <span className="agency-meta">{[a.city, a.country].filter(Boolean).join(", ")}</span>
                  <span className="agency-meta">{(a.streamerIds || []).length} streamers</span>
                  <span className="lang-tag">{LANG[a.lang] || "EN"}</span>
                  <span className="agency-meta">{new Date(a.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                  <span className={`pill ${a.status}`}>{LABELS[a.status] || a.status}</span>
                  <span className="chev" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="agency-body">
                    <dl className="kv">
                      <div><dt>Email</dt><dd><a href={`mailto:${a.email}`}>{a.email}</a></dd></div>
                      <div><dt>Phone</dt><dd><a href={`https://wa.me/${a.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer">{a.phone}</a> <span className="muted">(opens WhatsApp)</span></dd></div>
                      <div><dt>Address</dt><dd>{[a.address, a.city, a.country].filter(Boolean).join(", ")}</dd></div>
                      {a.comment && <div className="full"><dt>Comment</dt><dd>{a.comment}</dd></div>}
                    </dl>
                    <div>
                      <p className="kv-label">Streamer IDs</p>
                      <ul className="chips">
                        {(a.streamerIds || []).map((id) => (
                          <li key={id} className="chip" title={dupStreamers[id.toLowerCase()] > 1 ? "This streamer ID also appears in another agency application" : undefined}>
                            {id}
                            {dupStreamers[id.toLowerCase()] > 1 && <span className="dup">×{dupStreamers[id.toLowerCase()]}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="agency-actions">
                      <label className="inline-field">
                        <span>Status</span>
                        <select className={`status-select ${a.status === "approved" ? "accepted" : a.status === "contacted" ? "conditional" : a.status}`} value={a.status} disabled={busy === a.id} onChange={(e) => patch(a.id, { status: e.target.value }, `Marked as ${LABELS[e.target.value]}`)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
                        </select>
                      </label>
                      <label className="inline-field grow">
                        <span>Internal note</span>
                        <input value={note} onChange={(e) => setNotes((n) => ({ ...n, [a.id]: e.target.value }))} placeholder="Only admins see this" maxLength={1000} />
                      </label>
                      <button className="btn small" disabled={busy === a.id || note === (a.note || "")} onClick={() => patch(a.id, { note }, "Note saved")}>Save note</button>
                      {confirmDel === a.id ? (
                        <span className="confirm-del">
                          Delete for good?
                          <button className="link-danger strong" onClick={() => remove(a.id)}>Yes, delete</button>
                          <button className="link-danger" onClick={() => setConfirmDel("")}>Cancel</button>
                        </span>
                      ) : (
                        <button className="link-danger" onClick={() => setConfirmDel(a.id)}>Delete</button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
