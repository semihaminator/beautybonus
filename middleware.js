import { NextResponse } from "next/server";

const LOCALES = ["en", "ru", "uk"];

// Shareable language links: /?lang=ru, /results?lang=uk (also accepts "ua").
export function middleware(request) {
  const url = request.nextUrl;
  let lang = url.searchParams.get("lang")?.toLowerCase();
  if (!lang) return NextResponse.next();
  if (lang === "ua") lang = "uk";
  url.searchParams.delete("lang");
  const res = NextResponse.redirect(url);
  if (LOCALES.includes(lang)) {
    res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return res;
}

export const config = { matcher: ["/", "/results"] };
