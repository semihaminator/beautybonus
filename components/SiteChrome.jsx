import Link from "next/link";
import { CameraIcon, PlaneIcon } from "./Icons";
import LangSwitcher from "./LangSwitcher";
import { INSTAGRAM_URL, TELEGRAM_URL } from "@/lib/links";

export function Header({ locale, t, showLang = true }) {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Salsa Beauty Bonus">
        <img src="/img/salsa-wordmark.webp" alt="salsa" width="96" height="27" />
      </Link>
      <nav className="nav">
        <Link href="/#apply">{t.nav.apply}</Link>
        <Link href="/rules">{t.nav.rules}</Link>
        <Link href="/results">{t.nav.results}</Link>
      </nav>
      {showLang && <LangSwitcher locale={locale} label={t.nav.language} />}
    </header>
  );
}

export function Socials({ compact = false }) {
  return (
    <div className={compact ? "socials compact" : "socials"}>
      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="social">
        <PlaneIcon /> <span>Telegram · @SalsaStream</span>
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social">
        <CameraIcon /> <span>Instagram · @salsa_stream.app</span>
      </a>
    </div>
  );
}

export function Footer({ t }) {
  return (
    <footer className="site-footer">
      <img src="/img/beauty-bonus-script.webp" alt="Beauty Bonus" className="footer-script" />
      <Socials compact />
      <p className="fine">{t.footer.fine} © {new Date().getFullYear()} Salsa</p>
    </footer>
  );
}
