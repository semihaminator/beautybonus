import { redis } from "./db";

// Simple, private visit & click counters stored in the site's own database.
// Per-day hashes  stats:YYYY-MM-DD  (kept ~13 months) and an all-time hash  stats:all.
export const TRACKED_PAGES = ["/", "/guide", "/agency", "/beauty-bonus", "/beauty-bonus/rules", "/beauty-bonus/results"];
const KEY_RE = /^[a-z0-9:._-]{1,60}$/;
const TTL = 60 * 60 * 24 * 400;

export const dayKey = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

export async function trackEvent({ t, p, k }, newVisitor) {
  const fields = [];
  if (t === "view" && TRACKED_PAGES.includes(p)) fields.push(`view:${p}`);
  if (t === "view" && newVisitor) fields.push("visitors");
  if (t === "click" && typeof k === "string" && KEY_RE.test(k.toLowerCase())) fields.push(`click:${k.toLowerCase()}`);
  if (!fields.length) return;
  const r = redis();
  const day = `stats:${dayKey()}`;
  await Promise.all(fields.flatMap((f) => [r.hincrby(day, f, 1), r.hincrby("stats:all", f, 1)]));
  await r.expire(day, TTL);
}

const sum = (into, h) => {
  for (const [k, v] of Object.entries(h || {})) into[k] = (into[k] || 0) + Number(v || 0);
  return into;
};

// days = 1, 7, 30 … or 0 for all time
export async function getStats(days) {
  const r = redis();
  if (!days) return sum({}, await r.hgetall("stats:all"));
  const keys = [];
  for (let i = 0; i < days; i++) keys.push(`stats:${dayKey(new Date(Date.now() - i * 86400000))}`);
  const rows = await Promise.all(keys.map((k) => r.hgetall(k)));
  return rows.reduce((acc, h) => sum(acc, h), {});
}

// Visitors per day for the little chart (oldest first)
export async function getDaily(days = 30) {
  const r = redis();
  const list = [];
  for (let i = days - 1; i >= 0; i--) list.push(dayKey(new Date(Date.now() - i * 86400000)));
  const rows = await Promise.all(list.map((d) => r.hgetall(`stats:${d}`)));
  return list.map((d, i) => {
    const h = rows[i] || {};
    const views = Object.entries(h).filter(([k]) => k.startsWith("view:")).reduce((a, [, v]) => a + Number(v), 0);
    return { day: d, visitors: Number(h.visitors || 0), views };
  });
}
