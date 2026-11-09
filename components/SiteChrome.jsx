import Link from "next/link";
import { CameraIcon, PlaneIcon, SupportIcon } from "./Icons";
import LangSwitcher from "./LangSwitcher";
import MainNav from "./MainNav";

export function Header({ locale, s, settings }) {
  const items = [
    ["guide", "/guide", s.nav.guide],
    ["agency", "/agency", s.nav.agency],
    ["beautyBonus", "/beauty-bonus", s.nav.beautyBonus],
  ].filter(([k]) => settings.sections[k]);
  return (
    <header className="site-header" id="site-header">
      <Link href="/" className="brand" aria-label="Salsa">
        <img src="/img/salsa-wordmark.webp" alt="salsa" width="96" height="27" />
      </Link>
      <MainNav items={items.map(([key, href, label]) => ({ key, href, label }))} />
      <LangSwitcher locale={locale} label={s.nav.language} />
    </header>
  );
}

export function Banner({ settings, locale }) {
  const b = settings.banner;
  const text = b.enabled && (b.text[locale] || b.text.en || b.text.ru);
  if (!text) return null;
  return (
    <div className="site-banner" role="status">
      {b.link ? <a href={b.link}>{text} →</a> : <span>{text}</span>}
    </div>
  );
}

export function Socials({ settings, compact = false, withSupport = false, supportLabel = "Support" }) {
  const l = settings.links;
  return (
    <div className={compact ? "socials compact" : "socials"}>
      {withSupport && l.support && (
        <a href={l.support} target="_blank" rel="noopener noreferrer" className="social">
          <SupportIcon /> <span>{supportLabel}</span>
        </a>
      )}
      {l.telegram && (
        <a href={l.telegram} target="_blank" rel="noopener noreferrer" className="social">
          <PlaneIcon /> <span>Telegram</span>
        </a>
      )}
      {l.instagram && (
        <a href={l.instagram} target="_blank" rel="noopener noreferrer" className="social">
          <CameraIcon /> <span>Instagram</span>
        </a>
      )}
    </div>
  );
}

export function Footer({ s, settings }) {
  return (
    <footer className="site-footer">
      <img src="/img/salsa-wordmark.webp" alt="salsa" className="footer-mark" width="128" height="36" />
      <Socials settings={settings} compact withSupport supportLabel={s.footer.support} />
      <p className="fine">© {new Date().getFullYear()} {s.footer.rights}</p>
    </footer>
  );
}

// Apply · Rules · Results tabs inside the Beauty Bonus section.
export function BBNav({ s, current }) {
  const items = [["apply", "/beauty-bonus", s.bbNav.apply], ["rules", "/beauty-bonus/rules", s.bbNav.rules], ["results", "/beauty-bonus/results", s.bbNav.results]];
  return (
    <nav className="subnav" aria-label="Beauty Bonus">
      {items.map(([k, href, label]) => (
        <Link key={k} href={href} className={current === k ? "on" : ""} aria-current={current === k ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
