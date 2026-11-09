"use client";

import { useEffect, useRef, useState } from "react";

// Sticky chapter tabs under the site header; highlights the chapter in view.
export default function GuideTabs({ items }) {
  const [active, setActive] = useState(items[0]?.id);
  const bar = useRef(null);

  // Keep the tabs just below the (variable-height) site header.
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const set = () => document.documentElement.style.setProperty("--hdr", `${header.offsetHeight}px`);
    set();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(set) : null;
    ro?.observe(header);
    return () => ro?.disconnect();
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    const el = bar.current?.querySelector(`[data-id="${active}"]`);
    if (el && bar.current) bar.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="g-tabs" ref={bar} aria-label="Contents">
      {items.map((it, i) => (
        <a key={it.id} href={`#${it.id}`} data-id={it.id} className={active === it.id ? "on" : ""}>
          <b>{String(i + 1).padStart(2, "0")}</b>
          {it.label}
        </a>
      ))}
    </nav>
  );
}
