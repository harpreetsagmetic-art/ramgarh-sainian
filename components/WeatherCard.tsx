import TodayDate from "@/components/TodayDate";
import { geo, labels, pick } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { farmTips, getWeather, weatherInfo } from "@/lib/weather";
import { CloudRain, Droplets, MapPin, Sprout, Wind } from "lucide-react";

export default async function WeatherCard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const w = await getWeather(geo.lat, geo.lon);

  if (!w) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">{t.home.weatherTitle}</h2>
        <p className="mt-2 text-navy/70">{pick(locale, labels.weatherDown)}</p>
      </div>
    );
  }

  const now = weatherInfo(w.current.code);
  const today = w.days[0];
  const tips = farmTips(w);
  const dayName = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
      weekday: "short",
      timeZone: "UTC",
    });

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{t.home.weatherTitle}</h2>
      <p className="mt-1 flex items-center gap-1 text-sm text-navy/70">
        <MapPin size={14} className="text-saffron" /> {t.site.name},{" "}
        {t.site.sub}
      </p>
      <p className="text-sm text-navy/70">
        <TodayDate locale={locale} />
      </p>
      <div className="mt-3 flex items-center gap-4">
        <span className="text-5xl">{now.emoji}</span>
        <div>
          <p className="text-4xl font-bold">{Math.round(w.current.temp)}°C</p>
          <p className="text-navy/70">{pick(locale, now.text)}</p>
          <p className="text-xs text-navy/60">
            {Math.round(today.min)}° / {Math.round(today.max)}°
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-cream p-2">
          <Wind size={18} className="mx-auto text-saffron" />
          <p className="font-bold">{Math.round(w.current.wind)} km/h</p>
          <p className="text-xs text-navy/60">{pick(locale, labels.wind)}</p>
        </div>
        <div className="rounded-xl bg-cream p-2">
          <Droplets size={18} className="mx-auto text-saffron" />
          <p className="font-bold">{Math.round(w.current.humidity)}%</p>
          <p className="text-xs text-navy/60">
            {pick(locale, labels.humidity)}
          </p>
        </div>
        <div className="rounded-xl bg-cream p-2">
          <CloudRain size={18} className="mx-auto text-saffron" />
          <p className="font-bold">{Math.round(today.rainProb)}%</p>
          <p className="text-xs text-navy/60">
            {pick(locale, labels.rainChance)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {w.days.slice(1).map((d) => (
          <div
            key={d.date}
            className="flex items-center justify-between rounded-xl border border-navy/10 px-3 py-2"
          >
            <span>{dayName(d.date)}</span>
            <span>
              {weatherInfo(d.code).emoji} {Math.round(d.max)}°
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-gold/30 p-3">
        <p className="flex items-center gap-2 font-bold">
          <Sprout size={18} /> {pick(locale, labels.farmTips)}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {tips.map((tip, i) => (
            <li key={i}>{pick(locale, tip)}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-navy/60">
          {pick(locale, labels.tipsNote)}
        </p>
      </div>

      <p className="mt-3 text-right text-xs text-navy/50">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Weather data by Open-Meteo.com
        </a>
      </p>
    </div>
  );
}
