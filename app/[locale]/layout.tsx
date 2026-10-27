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

export const viewport: Viewport = { themeColor: "#1D2951", viewportFit: "cover" };

export const metadata: Metadata = {
  // OG image ka link poora (absolute) hona chahiye, isliye base URL chahiye
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ | Ramgarh Sainian",
  description: "Ramgarh Sainian / Saini Majra, Fatehgarh Sahib, Punjab",
  icons: { apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    title: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ | Ramgarh Sainian",
    description: "ਸਾਡਾ ਪਿੰਡ, ਸਾਡੀ ਪਛਾਣ",
    siteName: "Ramgarh Sainian",
    type: "website",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Ramgarh Sainian",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/images/og.jpg"] },
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
    { href: `${base}/live`, label: t.nav.live, icon: "live" },
    { href: `${base}/donate`, label: t.nav.donate, icon: "donate" },
  ];
  // Desktop header: 6 items (Contact ke saath)
  const headerItems = [
    ...nav,
    { href: `${base}/gallery`, label: t.nav.gallery },
    { href: `${base}/contact`, label: t.nav.contact },
  ];

  return (
    <html
      lang={locale === "pa" ? "pa" : "en"}
      className={`${gurmukhi.variable} ${poppins.variable}`}
    >
      <body className="font-sans antialiased">
        <Header
          locale={locale}
          items={headerItems}
          name={t.site.name}
          switchLabel={t.common.switchTo}
        />
        <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
        <Footer
          name={t.site.name}
          location={t.site.location}
          rights={t.common.rights}
        />
        <BottomNav items={nav} />
      </body>
    </html>
  );
}
