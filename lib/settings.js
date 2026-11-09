import { redis } from "./db";

// Site-wide settings editable from Admin → Site settings.
// Anything not saved yet falls back to these defaults.
export const DEFAULT_SETTINGS = {
  links: {
    startStreaming: "https://salsavideochat.com/",
    support: "https://wa.me/+84358962820",
    agencyManager: "https://wa.me/+84358962820",
    agencyPanel: "https://agency.salsavideochat.com",
    cafeApp: "",
    telegram: "https://t.me/SalsaStream",
    instagram: "https://www.instagram.com/salsa_stream.app/",
  },
  sections: {
    guide: true,
    agency: true,
    beautyBonus: true,
  },
  banner: {
    enabled: false,
    link: "",
    text: { en: "", ru: "", uk: "" },
  },
};

export const LINK_FIELDS = [
  ["startStreaming", "“Start streaming” buttons"],
  ["support", "Support button (email address or link)"],
  ["agencyManager", "Agency manager on WhatsApp (agency guide)"],
  ["agencyPanel", "Agency panel"],
  ["cafeApp", "Cafe app on Google Play (optional)"],
  ["telegram", "Telegram channel"],
  ["instagram", "Instagram"],
];

export const SECTION_FIELDS = [
  ["guide", "Streamer guide (/guide)"],
  ["agency", "Agency guide & form (/agency)"],
  ["beautyBonus", "Beauty Bonus (/beauty-bonus)"],
];

const KEY = "site:settings";

function merge(saved) {
  const s = saved && typeof saved === "object" ? saved : {};
  return {
    links: { ...DEFAULT_SETTINGS.links, ...(s.links || {}) },
    sections: { ...DEFAULT_SETTINGS.sections, ...(s.sections || {}) },
    banner: {
      ...DEFAULT_SETTINGS.banner,
      ...(s.banner || {}),
      text: { ...DEFAULT_SETTINGS.banner.text, ...((s.banner && s.banner.text) || {}) },
    },
  };
}

// Never throws: if the database is unreachable, the site still renders with defaults.
export async function getSettings() {
  try {
    return merge(await redis().get(KEY));
  } catch (err) {
    console.error("Settings unavailable, using defaults:", err.message);
    return merge(null);
  }
}

const cleanUrl = (v) => {
  const s = String(v || "").trim();
  if (!s) return "";
  if (/^\/(?!\/)[^\s]*$/.test(s)) return s; // a page on this site, e.g. /beauty-bonus
  const email = s.replace(/^mailto:/i, "");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return `mailto:${email}`; // an email address
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return ["http:", "https:"].includes(u.protocol) ? u.toString() : "";
  } catch {
    return "";
  }
};

export async function saveSettings(input) {
  const next = merge(input);
  for (const k of Object.keys(next.links)) next.links[k] = cleanUrl(next.links[k]);
  for (const k of Object.keys(next.sections)) next.sections[k] = !!next.sections[k];
  next.banner.enabled = !!next.banner.enabled;
  next.banner.link = cleanUrl(next.banner.link);
  for (const k of ["en", "ru", "uk"]) next.banner.text[k] = String(next.banner.text[k] || "").slice(0, 240);
  await redis().set(KEY, next);
  return next;
}
