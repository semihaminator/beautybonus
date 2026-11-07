// ── Beauty Bonus calendar ────────────────────────────────────────────────
// Each bonus period runs from the 13th of one month to the 13th of the next.
// New applications are collected from the 1st to the 5th of every month:
//   • applied on the 1st–5th  → earliest start is the 13th of THIS month
//   • applied on the 6th or later → earliest start is the 13th of NEXT month
export const BONUS_DAY = 13;
export const APPLY_FROM_DAY = 1;
export const APPLY_TO_DAY = 5;
// Dates are counted in this time zone (UTC+3: Istanbul, Moscow, Kyiv in summer).
export const APP_TIMEZONE = "Europe/Istanbul";

const fmt = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;
const INTL = { en: "en-GB", ru: "ru-RU", uk: "uk-UA" };

// "13 December 2026" / "13 декабря 2026" / "13 грудня 2026"
export function monthLabel(value, locale = "en") {
  const [y, m] = String(value).split("-").map(Number);
  if (!y || !m) return value;
  return new Date(Date.UTC(y, m - 1, BONUS_DAY))
    .toLocaleDateString(INTL[locale] || "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .replace(/\s*(г|р)\.$/, "");
}

// Today's year / month (0-based) / day in the app's time zone.
function localDate(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { y: get("year"), m: get("month") - 1, d: get("day") };
}

// Index (year*12 + month) of the earliest start month for an application made `now`.
function earliestIndex(now) {
  const { y, m, d } = localDate(now);
  const offset = d >= APPLY_FROM_DAY && d <= APPLY_TO_DAY ? 0 : 1;
  return y * 12 + m + offset;
}

const toValue = (index) => fmt(Math.floor(index / 12), index % 12);

export function earliestStart(now = new Date()) {
  return toValue(earliestIndex(now));
}

export function isApplicationWindowOpen(now = new Date()) {
  const { d } = localDate(now);
  return d >= APPLY_FROM_DAY && d <= APPLY_TO_DAY;
}

// Start dates an applicant can pick, beginning with the earliest allowed one.
export function upcomingMonths(now = new Date(), count = 6, locale = "en") {
  const first = earliestIndex(now);
  return Array.from({ length: count }, (_, i) => {
    const value = toValue(first + i);
    return { value, label: monthLabel(value, locale) };
  });
}

// Server-side check. A 30-minute grace period lets someone who opened the
// form on the 5th still submit just after midnight with the date they saw.
export function isValidStartMonth(value, now = new Date()) {
  if (!/^\d{4}-\d{2}$/.test(value)) return false;
  const [y, m] = value.split("-").map(Number);
  if (m < 1 || m > 12) return false;
  const idx = y * 12 + (m - 1);
  const earliest = Math.min(earliestIndex(now), earliestIndex(new Date(now.getTime() - 30 * 60 * 1000)));
  return idx >= earliest && idx <= earliest + 12;
}
