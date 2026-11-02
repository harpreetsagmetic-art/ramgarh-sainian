import type { Locale } from "@/lib/i18n";
import type { Alert } from "@/lib/weather";
import { wx } from "@/lib/weather-text";

const levelStyle = {
  danger: "border-red-500 bg-red-50 text-red-900",
  warn: "border-saffron bg-gold/30 text-navy",
  info: "border-navy/30 bg-cream text-navy",
} as const;

const levelIcon = { danger: "🚨", warn: "⚠️", info: "ℹ️" } as const;

export function AlertList({ alerts, locale, max }: { alerts: Alert[]; locale: Locale; max?: number }) {
  if (alerts.length === 0) return null;
  const list = max ? alerts.slice(0, max) : alerts;
  return (
    <div className="space-y-2" role="region" aria-live="polite">
      {list.map((a) => (
        <p key={a.id} className={`rounded-xl border-l-4 p-3 text-sm font-medium ${levelStyle[a.level]}`}>
          {levelIcon[a.level]} {a.text[locale]}
        </p>
      ))}
    </div>
  );
}

export function Attribution({ locale, air }: { locale: Locale; air: boolean }) {
  return (
    <p className="text-xs text-navy/50">
      {wx.credit[locale]}:{" "}
      <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline">
        Open-Meteo.com
      </a>{" "}
      (CC BY 4.0)
      {air && <> · {wx.creditAir[locale]}: CAMS ENSEMBLE data provider via Open-Meteo</>}
    </p>
  );
}