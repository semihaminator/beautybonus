// The Beauty Bonus always starts on the 13th of a month.
export const BONUS_DAY = 13;

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

// Start months an applicant can pick. Once the 13th of the current month
// has arrived, that month's bonus has already started, so it is skipped.
export function upcomingMonths(now = new Date(), count = 6, locale = "en") {
  let y = now.getUTCFullYear();
  let m = now.getUTCMonth();
  if (now.getUTCDate() >= BONUS_DAY) m += 1;
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(y, m + i, 1));
    const value = fmt(d.getUTCFullYear(), d.getUTCMonth());
    out.push({ value, label: monthLabel(value, locale) });
  }
  return out;
}

export function isValidStartMonth(value, now = new Date()) {
  if (!/^\d{4}-\d{2}$/.test(value)) return false;
  // Allow anything from the current month up to 12 months ahead
  // (a little slack for time-zone edges around the 13th).
  const [y, m] = value.split("-").map(Number);
  const diff = (y - now.getUTCFullYear()) * 12 + (m - 1 - now.getUTCMonth());
  return diff >= 0 && diff <= 12;
}
