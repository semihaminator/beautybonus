import "./globals.css";
import { Footer, Header } from "@/components/SiteChrome";
import { getDict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const t = getDict(await getLocale());
  return { title: t.meta.title, description: t.meta.description };
}

export const viewport = { themeColor: "#0b0307" };

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const t = getDict(locale);
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,700&display=swap&subset=cyrillic"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-pattern" aria-hidden="true" />
        <Header locale={locale} t={t} />
        <main>{children}</main>
        <Footer t={t} />
      </body>
    </html>
  );
}
