import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import WeatherFull from "@/components/WeatherFull";
import { isLocale } from "@/lib/i18n";
import { wx } from "@/lib/weather-text";
import { notFound } from "next/navigation";

export const revalidate = 1800; // 30 minute

export default async function WeatherPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageBanner title={wx.title[locale]} image="/images/hero.jpg" />
      <Container className="py-8">
        <WeatherFull locale={locale} />
      </Container>
    </>
  );
}