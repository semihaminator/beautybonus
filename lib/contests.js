import { redis } from "./db";

// External contest pages shown on the site and reachable via short links (/c/<slug>).
// Edited in Admin → Contests. Until something is saved there, these defaults are used.
export const DEFAULT_CONTESTS = [
  {
    slug: "autumn",
    audience: "streamers",
    url: "https://salsa-autumn.vercel.app/",
    active: true,
    showFrom: "",
    showUntil: "2026-11-22",
    title: {
      en: "Salsa Autumn — streamer referral contest",
      ru: "Salsa Autumn — реферальный конкурс для стримеров",
      uk: "Salsa Autumn — реферальний конкурс для стримерів",
    },
    text: {
      en: "Two rounds: 26 Oct – 9 Nov and 9–23 Nov · cash prizes and merch",
      ru: "Два раунда: 26.10–09.11 и 09.11–23.11 · денежные призы и мерч",
      uk: "Два раунди: 26.10–09.11 та 09.11–23.11 · грошові призи та мерч",
    },
  },
  {
    slug: "flash",
    audience: "agencies",
    url: "https://flashcontest.vercel.app/",
    active: true,
    showFrom: "",
    showUntil: "2026-11-25",
    title: {
      en: "Salsa Flash — flash contest for agents",
      ru: "Salsa Flash — флеш-конкурс для агентов",
      uk: "Salsa Flash — флеш-конкурс для агентів",
    },
    text: {
      en: "7–25 November · prizes up to $750 plus gifts",
      ru: "7–25 ноября · призы до $750 и подарки",
      uk: "7–25 листопада · призи до $750 і подарунки",
    },
  },
];

export const AUDIENCES = { streamers: "Streamers", agencies: "Agencies", all: "Everyone" };
const KEY = "site:contests";
const clicksKey = (slug) => `contest:clicks:${slug}`;
export const SLUG_RE = /^[a-z0-9-]{2,30}$/;

const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export async function getContests() {
  try {
    const saved = await redis().get(KEY);
    return Array.isArray(saved) ? saved : DEFAULT_CONTESTS;
  } catch (err) {
    console.error("Contests unavailable, using defaults:", err.message);
    return DEFAULT_CONTESTS;
  }
}

// Switched on, and today (Istanbul time) is within the optional date window.
export function isLive(c, day = today()) {
  if (!c.active) return false;
  if (c.showFrom && day < c.showFrom) return false;
  if (c.showUntil && day > c.showUntil) return false;
  return true;
}

export async function getLiveContests(audience) {
  const list = await getContests();
  return list.filter((c) => isLive(c) && (!audience || c.audience === audience || c.audience === "all"));
}

const cleanUrl = (v) => {
  try {
    const u = new URL(String(v || "").trim());
    return ["http:", "https:"].includes(u.protocol) ? u.toString() : "";
  } catch {
    return "";
  }
};
const cleanDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || "")) ? v : "");
const txt = (o, max) => ({ en: String(o?.en || "").slice(0, max), ru: String(o?.ru || "").slice(0, max), uk: String(o?.uk || "").slice(0, max) });

// Returns { list } or { error }.
export function validateContests(input) {
  if (!Array.isArray(input)) return { error: "Invalid data." };
  const seen = new Set();
  const list = [];
  for (const c of input.slice(0, 40)) {
    const slug = String(c.slug || "").trim().toLowerCase();
    if (!SLUG_RE.test(slug)) return { error: `Short link “${slug || "(empty)"}” must be 2–30 lowercase letters, numbers or dashes.` };
    if (seen.has(slug)) return { error: `Short link “${slug}” is used twice.` };
    seen.add(slug);
    const url = cleanUrl(c.url);
    if (!url) return { error: `Contest “${slug}” needs a full link starting with https://` };
    const title = txt(c.title, 120);
    if (!title.en && !title.ru && !title.uk) return { error: `Contest “${slug}” needs a title in at least one language.` };
    list.push({
      slug,
      audience: AUDIENCES[c.audience] ? c.audience : "all",
      url,
      active: !!c.active,
      showFrom: cleanDate(c.showFrom),
      showUntil: cleanDate(c.showUntil),
      title,
      text: txt(c.text, 200),
    });
  }
  return { list };
}

export async function saveContests(list) {
  await redis().set(KEY, list);
  return list;
}

export async function countClick(slug) {
  try {
    await redis().incr(clicksKey(slug));
  } catch (err) {
    console.error("Could not count click:", err.message);
  }
}

export async function getClicks(slugs) {
  if (!slugs.length) return {};
  try {
    const vals = await redis().mget(...slugs.map(clicksKey));
    return Object.fromEntries(slugs.map((s, i) => [s, Number(vals[i] || 0)]));
  } catch {
    return {};
  }
}
