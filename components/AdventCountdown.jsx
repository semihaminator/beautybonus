"use client";

import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

export default function AdventCountdown({ target, units, openText }) {
  const end = new Date(target).getTime();
  const [now, setNow] = useState(null); // null on the server → shows "--"

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = now === null ? null : Math.max(0, end - now);
  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60, Math.floor(left / 1000) % 60].map((v, i) =>
          i === 0 ? String(v) : pad(v)
        );

  return (
    <div className="adv-count-wrap">
      <div className="adv-count" role="timer" aria-live="off">
        {parts.map((v, i) => (
          <div key={i} className="adv-tile">
            <span className="adv-num">{v}</span>
            <span className="adv-unit">{units[i]}</span>
          </div>
        ))}
      </div>
      {left === 0 && <p className="adv-open">{openText}</p>}
    </div>
  );
}
