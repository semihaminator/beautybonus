import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale } from "./i18n";

export const LANG_COOKIE = "lang";

// Chosen language: the visitor's saved choice, else their browser language.
export async function getLocale() {
  const saved = (await cookies()).get(LANG_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  const accept = (await headers()).get("accept-language") || "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (code === "ua") return "uk";
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}
