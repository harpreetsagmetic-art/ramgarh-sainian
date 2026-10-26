import type { Bi } from "./content";

export type Weather = {
  current: { temp: number; humidity: number; wind: number; code: number };
  days: { date: string; code: number; max: number; min: number; rainProb: number; rainMm: number }[];
};

export async function getWeather(lat: number, lon: number): Promise<Weather | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code");
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum"
  );
  url.searchParams.set("timezone", "Asia/Kolkata");
  url.searchParams.set("forecast_days", "3");

  try {
    // 1800 sec = 30 minute cache. Isse API par bahut kam calls jaati hain.
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const j = await res.json();
    const d = j.daily;
    return {
      current: {
        temp: j.current.temperature_2m,
        humidity: j.current.relative_humidity_2m,
        wind: j.current.wind_speed_10m,
        code: j.current.weather_code,
      },
      days: d.time.map((date: string, i: number) => ({
        date,
        code: d.weather_code[i],
        max: d.temperature_2m_max[i],
        min: d.temperature_2m_min[i],
        rainProb: d.precipitation_probability_max[i] ?? 0,
        rainMm: d.precipitation_sum[i] ?? 0,
      })),
    };
  } catch {
    return null; // API band ho ya net na ho, site crash nahi hogi
  }
}

// WMO weather code → emoji + text
export function weatherInfo(code: number): { emoji: string; text: Bi } {
  if (code === 0) return { emoji: "☀️", text: { pa: "ਸਾਫ਼ ਮੌਸਮ", en: "Clear" } };
  if (code <= 3) return { emoji: "⛅", text: { pa: "ਹਲਕੇ ਬੱਦਲ", en: "Partly cloudy" } };
  if (code === 45 || code === 48) return { emoji: "🌫️", text: { pa: "ਧੁੰਦ", en: "Fog" } };
  if (code >= 51 && code <= 57) return { emoji: "🌦️", text: { pa: "ਬੂੰਦਾਬਾਂਦੀ", en: "Drizzle" } };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return { emoji: "🌧️", text: { pa: "ਮੀਂਹ", en: "Rain" } };
  if (code >= 95) return { emoji: "⛈️", text: { pa: "ਗਰਜ ਨਾਲ ਮੀਂਹ", en: "Thunderstorm" } };
  return { emoji: "☁️", text: { pa: "ਬੱਦਲਵਾਈ", en: "Cloudy" } };
}

// Simple rules se kisan ke liye hints
export function farmTips(w: Weather): Bi[] {
  const tips: Bi[] = [];
  const today = w.days[0];

  if (today.rainProb >= 60 || today.rainMm >= 5)
    tips.push({
      pa: "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ: ਸਪਰੇਅ ਤੇ ਕਟਾਈ ਅੱਗੇ ਪਾਓ, ਫ਼ਸਲ ਢੱਕ ਕੇ ਰੱਖੋ।",
      en: "Rain likely: postpone spraying and harvesting, keep produce covered.",
    });
  if (w.current.wind >= 20)
    tips.push({ pa: "ਹਵਾ ਤੇਜ਼ ਹੈ: ਸਪਰੇਅ ਨਾ ਕਰੋ।", en: "Strong wind: avoid spraying." });
  if (today.max >= 38)
    tips.push({
      pa: "ਬਹੁਤ ਗਰਮੀ: ਸਿੰਜਾਈ ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਕਰੋ।",
      en: "Very hot: irrigate in the early morning or evening.",
    });
  if (today.min <= 4)
    tips.push({ pa: "ਕੋਰੇ ਦਾ ਖ਼ਤਰਾ: ਛੋਟੇ ਬੂਟਿਆਂ ਨੂੰ ਬਚਾਓ।", en: "Frost risk: protect young plants." });
  if (tips.length === 0)
    tips.push({ pa: "ਮੌਸਮ ਆਮ ਹੈ, ਖੇਤੀ ਦੇ ਕੰਮ ਲਈ ਠੀਕ ਹੈ।", en: "Weather is normal, fine for farm work." });

  return tips;
}