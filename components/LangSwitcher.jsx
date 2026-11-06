"use client";

import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES, LOCALE_TITLES } from "@/lib/i18n";

export default function LangSwitcher({ locale, label }) {
  const router = useRouter();
  function choose(l) {
    if (l === locale) return;
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
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
