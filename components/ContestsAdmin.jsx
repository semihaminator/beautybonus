"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGS = [["en", "EN"], ["ru", "RU"], ["uk", "UA"]];
const blank = () => ({ slug: "", audience: "streamers", url: "", active: true, showFrom: "", showUntil: "", title: { en: "", ru: "", uk: "" }, text: { en: "", ru: "", uk: "" } });

function status(c) {
  const d = new Date().toISOString().slice(0, 10);
  if (!c.active) return ["off", "Switched off"];
  if (c.showFrom && d < c.showFrom) return ["soon", `Shows from ${c.showFrom}`];
  if (c.showUntil && d > c.showUntil) return ["ended", "Ended — hidden"];
  return ["live", "Live on the site"];
}

export default function ContestsAdmin({ initial, clicks: initialClicks, siteUrl }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [clicks, setClicks] = useState(initialClicks || {});
  const [state, setState] = useState("idle");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState("");
  const [confirmDel, setConfirmDel] = useState(-1);
  const dirty = JSON.stringify(list) !== JSON.stringify(initial);

  const update = (i, patch) => setList((l) => l.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const updateLang = (i, field, lang, v) => setList((l) => l.map((c, j) => (j === i ? { ...c, [field]: { ...c[field], [lang]: v } } : c)));

  async function save() {
    setState("saving");
    setMsg("");
    const res = await fetch("/api/admin/contests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contests: list }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("idle");
      setMsg(data.error || "Could not save.");
      return;
    }
    setList(data.contests);
    setClicks(data.clicks || {});
    setState("saved");
    setMsg("Saved. The site updates immediately.");
    router.refresh();
    setTimeout(() => setState("idle"), 2500);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="admin-section settings">
      <div className="admin-sub-top">
        <p className="muted">Contest pages hosted elsewhere. They appear on the home page and in the matching guide, with a short link you can share.</p>
        <div className="admin-actions">
          <button type="button" className="btn ghost small" onClick={() => setList((l) => [...l, blank()])}>+ Add contest</button>
          <button type="button" className="btn small" disabled={!dirty || state === "saving"} onClick={save}>{state === "saving" ? "Saving…" : "Save changes"}</button>
        </div>
      </div>
      {msg && <p className={state === "saved" ? "form-ok" : "form-error"} role="status">{msg}</p>}
      {list.length === 0 && <p className="empty big">No contests yet. Use “Add contest” to link one.</p>}

      {list.map((c, i) => {
        const [st, stLabel] = status(c);
        const short = c.slug ? `${siteUrl}/c/${c.slug}` : "";
        return (
          <section key={i} className="set-card contest-edit">
            <div className="contest-edit-top">
              <h2>{c.title.en || c.title.ru || c.title.uk || "New contest"}</h2>
              <span className={`pill ${st === "live" ? "approved" : st === "off" ? "rejected" : "contacted"}`}>{stLabel}</span>
              {c.slug && initial.some((x) => x.slug === c.slug) && <span className="muted small">{clicks[c.slug] || 0} {(clicks[c.slug] || 0) === 1 ? "click" : "clicks"}</span>}
            </div>

            <div className="set-grid three">
              <label className="set-field">
                <span>Contest page link</span>
                <input type="url" value={c.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="https://…" />
              </label>
              <label className="set-field">
                <span>Short link name</span>
                <input value={c.slug} onChange={(e) => update(i, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="e.g. autumn" />
              </label>
              <label className="set-field">
                <span>Who it's for</span>
                <select value={c.audience} onChange={(e) => update(i, { audience: e.target.value })}>
                  <option value="streamers">Streamers (shows in streamer guide)</option>
                  <option value="agencies">Agencies (shows in agency guide)</option>
                  <option value="all">Everyone (home page only)</option>
                </select>
              </label>
              <label className="set-field">
                <span>Show from (optional)</span>
                <input type="date" value={c.showFrom} onChange={(e) => update(i, { showFrom: e.target.value })} />
              </label>
              <label className="set-field">
                <span>Show until (optional)</span>
                <input type="date" value={c.showUntil} onChange={(e) => update(i, { showUntil: e.target.value })} />
              </label>
              <label className="toggle" style={{ alignSelf: "end", marginBottom: 10 }}>
                <input type="checkbox" checked={c.active} onChange={(e) => update(i, { active: e.target.checked })} />
                <span className="switch" aria-hidden="true" />
                <span>Switched on</span>
              </label>
            </div>

            {short && (
              <div className="short-link">
                <span>Short link to share:</span>
                <code>{short}</code>
                <button type="button" className="btn ghost small" onClick={() => copy(short)}>{copied === short ? "Copied" : "Copy"}</button>
              </div>
            )}

            <div className="set-grid three">
              {LANGS.map(([l, name]) => (
                <div key={l} className="lang-block">
                  <label className="set-field">
                    <span>Title · {name}</span>
                    <input value={c.title[l]} onChange={(e) => updateLang(i, "title", l, e.target.value)} maxLength={120} />
                  </label>
                  <label className="set-field">
                    <span>Short description · {name}</span>
                    <input value={c.text[l]} onChange={(e) => updateLang(i, "text", l, e.target.value)} maxLength={200} placeholder="Dates · prizes" />
                  </label>
                </div>
              ))}
            </div>

            <div className="contest-edit-actions">
              {c.url && <a className="link-danger" href={c.url} target="_blank" rel="noopener noreferrer">Open contest page ↗</a>}
              {confirmDel === i ? (
                <span className="confirm-del">
                  Remove this contest?
                  <button type="button" className="link-danger strong" onClick={() => { setList((l) => l.filter((_, j) => j !== i)); setConfirmDel(-1); }}>Yes, remove</button>
                  <button type="button" className="link-danger" onClick={() => setConfirmDel(-1)}>Cancel</button>
                </span>
              ) : (
                <button type="button" className="link-danger" onClick={() => setConfirmDel(i)}>Remove</button>
              )}
            </div>
          </section>
        );
      })}
      {dirty && <p className="hint">You have unsaved changes — press “Save changes”.</p>}
    </div>
  );
}
