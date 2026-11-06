"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLocale, LOCALES, LOCALE_NAMES, LOCALE_TITLES } from "@/lib/i18n";

const saveLang = (l) => {
  document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
};

export default function LangSwitcher({ locale, label }) {
  const router = useRouter();

  // Shareable links: /?lang=ru, /?lang=uk (or ua), /results?lang=ru
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let l = params.get("lang")?.toLowerCase();
    if (!l) return;
    if (l === "ua") l = "uk";
    params.delete("lang");
    const qs = params.toString();
    const clean = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
    if (isLocale(l) && l !== locale) {
      saveLang(l);
      window.location.replace(clean); // reload once in the chosen language
    } else {
      window.history.replaceState(window.history.state, "", clean);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(l) {
    if (l === locale) return;
    saveLang(l);
    router.refresh();
  }

  return (
    <div className="lang" role="group" aria-label={label}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          title={LOCALE_TITLES[l]}
          aria-pressed={l === locale}
          className={l === locale ? "on" : ""}
          onClick={() => choose(l)}
        >
          {LOCALE_NAMES[l]}
        </button>
      ))}
    </div>
  );
}
