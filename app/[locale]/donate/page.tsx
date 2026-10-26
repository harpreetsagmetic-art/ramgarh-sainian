import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import UpiPay from "@/components/UpiPay";
import { accounts, inr, labels, pick, site } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const monthName = (m: string) =>
    new Date(`${m}-01`).toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
      month: "long", year: "numeric", timeZone: "UTC",
    });

  return (
    <>
      <PageBanner title={t.home.donateTitle} subtitle={t.home.donateText} />
      <Container className="max-w-lg space-y-10 py-8">
        <UpiPay
          upiId={site.upiId}
          payee={pick(locale, site.payee)}
          labels={{
            upiId: pick(locale, labels.upiId),
            payee: pick(locale, labels.payee),
            copy: pick(locale, labels.copy),
            copied: pick(locale, labels.copied),
            amount: pick(locale, labels.amount),
            payNow: pick(locale, labels.payNow),
            scanQr: pick(locale, labels.scanQr),
            note: pick(locale, labels.donateNote),
          }}
        />

        {/* Donation accounts (transparency) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">{pick(locale, labels.accounts)}</h2>
          <p className="rounded-xl bg-gold/30 p-3 text-sm">{pick(locale, labels.sampleData)}</p>

          {accounts.map((a) => {
            // Total database mein store nahi karte, items se calculate karte hain
            const spent = a.items.reduce((sum, i) => sum + i.amount, 0);
            return (
              <div key={a.month} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold">{monthName(a.month)}</h3>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-cream p-2">
                    <p className="font-bold">{inr(a.collected)}</p>
                    <p className="text-xs text-navy/60">{pick(locale, labels.collected)}</p>
                  </div>
                  <div className="rounded-xl bg-cream p-2">
                    <p className="font-bold">{inr(spent)}</p>
                    <p className="text-xs text-navy/60">{pick(locale, labels.spent)}</p>
                  </div>
                  <div className="rounded-xl bg-cream p-2">
                    <p className="font-bold text-saffron">{inr(a.collected - spent)}</p>
                    <p className="text-xs text-navy/60">{pick(locale, labels.balance)}</p>
                  </div>
                </div>

                <ul className="mt-3 divide-y divide-navy/10">
                  {a.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between py-2">
                      <span>{pick(locale, i.title)}</span>
                      <span className="font-medium">{inr(i.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </Container>
    </>
  );
}