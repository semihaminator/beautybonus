import "./globals.css";
import { Banner, Footer, Header } from "@/components/SiteChrome";
import { getLocale } from "@/lib/locale";
import { getSettings } from "@/lib/settings";
import { getSite } from "@/lib/site";

export async function generateMetadata() {
  const s = getSite(await getLocale());
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://salsa.team"),
    title: s.metaTitle,
    description: s.metaDescription,
    openGraph: { siteName: "Salsa", url: "/" },
  };
}

export const viewport = { themeColor: "#0b0307" };

export default async function RootLayout({ children }) {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
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
        <Header locale={locale} s={s} settings={settings} />
        <Banner settings={settings} locale={locale} />
        <main>{children}</main>
        <Footer s={s} settings={settings} />
      </body>
    </html>
  );
}
