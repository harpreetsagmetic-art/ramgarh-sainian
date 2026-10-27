import Container from "@/components/Container";
import HukamnamaCard from "@/components/HukamnamaCard";
import LiveLink from "@/components/LiveLink";
import TodayStrip from "@/components/TodayStrip";
import UpcomingSection from "@/components/UpcomingSection";
import WeatherCard from "@/components/WeatherCard";
import { pick } from "@/lib/content";
import { x } from "@/lib/extra";
import { getDictionary, isLocale } from "@/lib/i18n";
import {
  Bell,
  HandHeart,
  Images,
  Landmark,
  Phone,
  TreePine,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 1800; 

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const base = `/${locale}`;

  const quick = [
    { href: `${base}/village`, label: t.nav.village, Icon: TreePine },
    { href: `${base}/gurudwara`, label: t.nav.gurudwara, Icon: Landmark },
    { href: `${base}/gallery`, label: t.nav.gallery, Icon: Images },
    { href: `${base}/contact`, label: t.nav.contact, Icon: Phone },
  ];

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Image
          src="/images/hero.jpg"
          alt={t.site.name}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-navy via-navy/70 to-navy/30" />
        <Container className="flex min-h-[75svh] flex-col justify-end pb-16 pt-24 md:min-h-[85svh]">
          <p className="font-medium text-saffron">{t.home.greeting} 🙏</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-gold md:text-6xl">
            {t.site.name}
          </h1>
          <p className="text-xl text-white/90 md:text-2xl">{t.site.sub}</p>
          <p className="mt-3 max-w-md text-white/80">{t.site.tagline}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`${base}/gurudwara`}
              className="rounded-xl bg-gold px-6 py-3 text-center font-bold text-navy active:scale-95"
            >
              {t.home.ctaGurudwara}
            </Link>
            <Link
              href={`${base}/donate`}
              className="rounded-xl bg-saffron px-6 py-3 text-center font-bold text-navy active:scale-95"
            >
              {t.home.ctaDonate}
            </Link>
          </div>
        </Container>
        <div className="h-1.5 bg-linear-to-r from-saffron via-gold to-saffron" />
      </section>

      {/* QUICK LINKS */}
      <Container className="relative z-10 -mt-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quick.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-2xl border-b-4 border-saffron bg-white p-5 shadow-lg active:scale-95"
            >
              <Icon className="text-navy" size={30} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* AAJ: date, Nanakshahi date, aaj ke dihare, aaj ka itihaas */}
      <Container className="mt-8">
        <TodayStrip locale={locale} />
      </Container>
           <Container className="mt-4">
        <LiveLink locale={locale} />
      </Container>
      {/* HUKAMNAMA */}
      <Container className="mt-4">
        <HukamnamaCard locale={locale} />
      </Container>

      {/* SANGRAND, PURANMASHI, MASSIA aur aage ke dihare */}
      <Container className="mt-8">
        <UpcomingSection locale={locale} limit={6} />
      </Container>

      {/* WEATHER + NOTICES */}
      <Container className="mt-8 grid items-start gap-4 md:grid-cols-2">
        <WeatherCard locale={locale} />

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Bell className="text-saffron" /> {t.home.latestNotices}
          </h2>
          <p className="mt-3 text-navy/70">{pick(locale, x.comingSoon)}</p>
        </div>
      </Container>

      {/* DONATE CTA */}
      <Container className="py-8">
        <div className="rounded-2xl bg-gold p-6 text-center">
          <HandHeart className="mx-auto" size={36} />
          <h2 className="mt-2 text-xl font-bold">{t.home.donateTitle}</h2>
          <p className="mx-auto mt-1 max-w-md">{t.home.donateText}</p>
          <Link
            href={`${base}/donate`}
            className="mt-4 inline-block rounded-xl bg-navy px-6 py-3 font-bold text-gold active:scale-95"
          >
            {t.home.ctaDonate}
          </Link>
        </div>
      </Container>
    </>
  );
}
