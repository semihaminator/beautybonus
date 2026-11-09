"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  ["beauty", "Beauty Bonus"],
  ["agency", "Agency applications"],
  ["settings", "Site settings"],
];

export default function AdminShell({ children, badges = {} }) {
  const router = useRouter();
  const [tab, setTab] = useState("beauty");

  // Remember the open area in the address (#agency) so a refresh keeps it.
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (TABS.some(([k]) => k === h)) setTab(h);
  }, []);
  const choose = (k) => {
    setTab(k);
    history.replaceState(null, "", `#${k}`);
  };

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <section className="admin">
      <div className="admin-top">
        <div>
          <h1 className="page-title left">Admin panel</h1>
          <p className="muted">Manage applications and the whole site from one place</p>
        </div>
        <div className="admin-actions">
          <a className="btn ghost small" href="/" target="_blank" rel="noopener">View site ↗</a>
          <button className="btn ghost small" onClick={logout}>Sign out</button>
        </div>
      </div>
      <div className="tabs area-tabs" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => choose(k)}>
            {label}
            {badges[k] > 0 && <span className="tab-badge">{badges[k]}</span>}
          </button>
        ))}
      </div>
      {children[tab]}
    </section>
  );
}
