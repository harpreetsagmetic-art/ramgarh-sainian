import CalendarList from "@/components/CalendarList";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { x } from "@/lib/extra";
import { fmtFull, istDate, toItems } from "@/lib/gurpurab";
import { isLocale } from "@/lib/i18n";
import { getMeta, getRange } from "@/lib/jantri";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [range, meta] = await Promise.all([getRange(45), getMeta()]);
  const items = toItems(range);

  // Chhapi Jantri se pakki tareekhein kab tak hain
  const last = meta?.loadedThrough;
  const daysLeft = last
    ? Math.round((Date.parse(`${last}T00:00:00Z`) - Date.parse(`${istDate(0)}T00:00:00Z`)) / 86_400_000)
    : null;
  const anyEstimated = items.some((i) => i.estimated);

  return (
    <>
      <PageBanner title={x.calendarTitle[locale]} subtitle={x.calendarSub[locale]} image="/images/hero.jpg" />
      <Container className="space-y-4 py-8">
        {last && (
          <p className="rounded-xl bg-gold/30 p-3 text-sm">
            {x.coverageTill[locale]} <strong>{fmtFull(last, locale)}</strong>
            {daysLeft !== null && daysLeft <= 45 && <> · {x.coverageSoon[locale]}</>}
          </p>
        )}
        {anyEstimated && <p className="text-xs text-navy/60">{x.estimatedNote[locale]}</p>}
        <CalendarList items={items} locale={locale} />
        <p className="text-xs text-navy/50">
          {x.calendarSource[locale]}
          {meta && <> · {meta.packageName} v{meta.packageVersion}</>}
        </p>
      </Container>
    </>
  );
}