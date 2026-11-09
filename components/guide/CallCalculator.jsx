"use client";

import { useState } from "react";

const RATES = [60, 120, 240, 360, 480];
const COINS_PER_USD = 650;

export default function CallCalculator({ t, locale }) {
  const [rate, setRate] = useState(120);
  const [minutes, setMinutes] = useState("30");
  const m = Math.max(0, Math.min(600, Math.floor(Number(minutes) || 0)));
  const coins = rate * m;
  const nf = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-US");
  return (
    <form className="g-card g-calc" onSubmit={(e) => e.preventDefault()}>
      <h3>{t.calcTitle}</h3>
      <div className="g-calc-in">
        <label htmlFor="calc-rate">
          {t.calcRate}
          <select id="calc-rate" value={rate} onChange={(e) => setRate(Number(e.target.value))}>
            {RATES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label htmlFor="calc-min">
          {t.calcMin}
          <input id="calc-min" type="number" inputMode="numeric" min="1" max="600" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </label>
      </div>
      <div className="g-calc-out" aria-live="polite">
        <span>{t.calcOut}</span>
        <strong>{nf.format(coins)} {t.coins}</strong>
        <em>≈ ${(coins / COINS_PER_USD).toFixed(2)}</em>
      </div>
    </form>
  );
}
