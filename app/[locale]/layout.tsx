import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_Gurmukhi, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const gurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-gurmukhi",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#1D2951" };

export const metadata: Metadata = {
  title: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ | Ramgarh Sainian",
  description: "Ramgarh Sainian / Saini Majra, Fatehgarh Sahib, Punjab",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const base = `/${locale}`;

  // Mobile bottom bar: 5 items
  const nav = [
    { href: base, label: t.nav.home, icon: "home" },
    { href: `${base}/village`, label: t.nav.village, icon: "village" },
    { href: `${base}/gurudwara`, label: t.nav.gurudwara, icon: "gurudwara" },
    { href: `${base}/gallery`, label: t.nav.gallery, icon: "gallery" },
    { href: `${base}/donate`, label: t.nav.donate, icon: "donate" },
  ];
  // Desktop header: 6 items (Contact ke saath)
  const headerItems = [...nav, { href: `${base}/contact`, label: t.nav.contact }];

  return (
    <html lang={locale === "pa" ? "pa" : "en"} className={`${gurmukhi.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <Header locale={locale} items={headerItems} name={t.site.name} switchLabel={t.common.switchTo} />
        <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
        <Footer name={t.site.name} location={t.site.location} rights={t.common.rights} />
        <BottomNav items={nav} />
      </body>
    </html>
  );
}