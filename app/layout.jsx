import "./globals.css";
import { Banner, Footer, Header } from "@/components/SiteChrome";
import Tracker from "@/components/Tracker";
import VercelAnalytics from "@/components/VercelAnalytics";
import { getLiveContests } from "@/lib/contests";
import { getLocale } from "@/lib/locale";
import { getSettings } from "@/lib/settings";
import { getSite } from "@/lib/site";

export async function generateMetadata() {
  const s = getSite(await getLocale());
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://salsa.team"),
    title: s.metaTitle,
    description: s.metaDescription,
    // Link preview (WhatsApp, Telegram, Instagram): same title for every language.
    openGraph: {
      siteName: "Salsa",
      url: "/",
      type: "website",
      title: "Salsa — стримь и зарабатывай!",
      description: "Гайды для стримеров и агентств, Beauty Bonus и конкурсы Salsa.",
    },
    twitter: { card: "summary_large_image", title: "Salsa — стримь и зарабатывай!" },
  };
}

export const viewport = { themeColor: "#0b0307" };

export default async function RootLayout({ children }) {
  const [locale, settings, contests] = await Promise.all([getLocale(), getSettings(), getLiveContests()]);
  // agency contest first, then streamer, as asked
  const hot = [...contests].sort((a, b) => (a.audience === "agencies" ? -1 : 0) - (b.audience === "agencies" ? -1 : 0));
  const s = getSite(locale);
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,500;1,700&display=swap&subset=cyrillic"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-pattern" aria-hidden="true" />
        <Header locale={locale} s={s} settings={settings} contests={hot} />
        <Banner settings={settings} locale={locale} />
        <main>{children}</main>
        <Footer s={s} settings={settings} />
        <Tracker />
        <VercelAnalytics />
      </body>
    </html>
  );
}
