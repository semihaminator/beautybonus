"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGS = [["en", "English"], ["ru", "Русский"], ["uk", "Українська"]];

export default function SettingsAdmin({ initial, linkFields, sectionFields }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [state, setState] = useState("idle");
  const [msg, setMsg] = useState("");
  const dirty = JSON.stringify(s) !== JSON.stringify(initial);

  const setLink = (k, v) => setS((x) => ({ ...x, links: { ...x.links, [k]: v } }));
  const setSection = (k, v) => setS((x) => ({ ...x, sections: { ...x.sections, [k]: v } }));
  const setBanner = (patch) => setS((x) => ({ ...x, banner: { ...x.banner, ...patch } }));
  const setBannerText = (l, v) => setS((x) => ({ ...x, banner: { ...x.banner, text: { ...x.banner.text, [l]: v } } }));

  async function save(e) {
    e.preventDefault();
    setState("saving");
    setMsg("");
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("idle");
      setMsg(data.error || "Could not save settings.");
      return;
    }
    setS(data.settings);
    setState("saved");
    setMsg("Saved. The site updates immediately.");
    router.refresh();
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <form className="admin-section settings" onSubmit={save}>
      <div className="admin-sub-top">
        <p className="muted">Links, announcement banner and which sections are visible</p>
        <button className="btn small" disabled={!dirty || state === "saving"}>{state === "saving" ? "Saving…" : "Save changes"}</button>
      </div>
      {msg && <p className={state === "saved" ? "form-ok" : "form-error"} role="status">{msg}</p>}

      <section className="set-card">
        <h2>Sections</h2>
        <p className="muted small">Hidden sections disappear from the menu and home page and show “page not found” to visitors. You can still preview them while signed in.</p>
        <div className="toggles">
          {sectionFields.map(([k, label]) => (
            <label key={k} className="toggle">
              <input type="checkbox" checked={!!s.sections[k]} onChange={(e) => setSection(k, e.target.checked)} />
              <span className="switch" aria-hidden="true" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="set-card">
        <h2>Links</h2>
        <p className="muted small">Where the site's buttons go. Leave a link empty to hide its button.</p>
        <div className="set-grid">
          {linkFields.map(([k, label]) => (
            <label key={k} className="set-field" htmlFor={`set-${k}`}>
              <span>{label}</span>
              <input id={`set-${k}`} type="text" inputMode="url" value={s.links[k] || ""} onChange={(e) => setLink(k, e.target.value)} placeholder={k === "support" ? "support@… or https://…" : "https://…"} />
            </label>
          ))}
        </div>
      </section>

      <section className="set-card">
        <h2>Announcement banner</h2>
        <p className="muted small">A pink strip under the menu on every page, e.g. “Beauty Bonus applications are open 1–5 December”. Write it in each language; empty languages fall back to English.</p>
        <label className="toggle">
          <input type="checkbox" checked={!!s.banner.enabled} onChange={(e) => setBanner({ enabled: e.target.checked })} />
          <span className="switch" aria-hidden="true" />
          <span>Show banner</span>
        </label>
        <div className="set-grid">
          {LANGS.map(([l, name]) => (
            <label key={l} className="set-field" htmlFor={`banner-${l}`}>
              <span>Text · {name}</span>
              <input id={`banner-${l}`} value={s.banner.text[l] || ""} onChange={(e) => setBannerText(l, e.target.value)} maxLength={240} />
            </label>
          ))}
          <label className="set-field" htmlFor="banner-link">
            <span>Banner link (optional)</span>
            <input id="banner-link" value={s.banner.link || ""} onChange={(e) => setBanner({ link: e.target.value })} placeholder="/beauty-bonus or https://…" />
          </label>
        </div>
      </section>
    </form>
  );
}
