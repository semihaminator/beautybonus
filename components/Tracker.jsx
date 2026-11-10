"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function send(body) {
  try {
    const data = JSON.stringify(body);
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([data], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body: data, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {}
}

// Counts page views and clicks. Buttons can name themselves with data-track="…";
// other links are counted by where they go. Nothing is tracked on /admin.
export default function Tracker() {
  const path = usePathname();

  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;
    send({ t: "view", p: path });
  }, [path]);

  useEffect(() => {
    const onClick = (e) => {
      if (location.pathname.startsWith("/admin")) return;
      const el = e.target.closest?.("a,button,[data-track]");
      if (!el) return;
      let k = el.dataset?.track;
      if (!k && el.tagName === "A") {
        const href = el.getAttribute("href") || "";
        if (href.startsWith("/c/")) k = `contest:${href.slice(3)}`;
        else if (href.startsWith("mailto:")) k = "link:email";
        else if (/^https?:/.test(href)) {
          try {
            k = `link:${new URL(href).hostname.replace(/^www\./, "")}`;
          } catch {}
        }
      }
      if (k) send({ t: "click", k, p: location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
