"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav({ items }) {
  const path = usePathname() || "/";
  return (
    <nav className="nav">
      {items.map(({ key, href, label }) => {
        const on = path === href || path.startsWith(href + "/");
        return (
          <Link key={key} href={href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
