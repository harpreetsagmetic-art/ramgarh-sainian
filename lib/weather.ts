import type { WxKind } from "@/components/WeatherIcon";
import type { Bi } from "./content";
export type Hour = {
  time: string; // "2026-11-02T15:00" (India ka local time)
  temp: number;
  code: number;
  isDay: boolean;
  rain: number; // barish ki sambhavna %
  wind: number; // km/h
  vis: number | null; // meter
};

export type Day = {
  date: string;
  code: number;
  max: number;
  min: number;
  rainProb: number;
  rainMm: number;
  rainHours: number;
  windMax: number;
  gustMax: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
  et0: number; // mm/din
};

export type Weather = {
  updated: string;
  current: {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    gust: number;
    windDir: number;
    code: number;
    isDay: boolean;
    cloud: number;
    uv: number;
    vis: number | null;
  };
  hours: Hour[]; // 48 ghante
  days: Day[]; // aaj + 5 din
  aqi: { us: number; pm25: number; pm10: number } | null;
};

const FORECAST = "https://api.open-meteo.com/v1/forecast";
const AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";

async function getJson(url: string) {
  try {
    const r = await fetch(url, { next: { revalidate: 1800 } }); // 30 minute cache
    return r.ok ? await r.json() : null;
  } catch {
    return null; // net ya API band ho to site na tootay
  }
}

export async function getWeather(
  lat: number,
  lon: number,
): Promise<Weather | null> {
  const f = new URL(FORECAST);
  f.searchParams.set("latitude", String(lat));
  f.searchParams.set("longitude", String(lon));
  f.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility",
  );
  f.searchParams.set(
    "hourly",
    "temperature_2m,weather_code,is_day,precipitation_probability,wind_speed_10m,visibility",
  );
  f.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,et0_fao_evapotranspiration",
  );
  f.searchParams.set("timezone", "Asia/Kolkata");
  f.searchParams.set("forecast_days", "6");
  f.searchParams.set("forecast_hours", "48"); // hourly mein ye forecast_days se upar chalta hai

  const a = new URL(AIR);
  a.searchParams.set("latitude", String(lat));
  a.searchParams.set("longitude", String(lon));
  a.searchParams.set("current", "us_aqi,pm2_5,pm10");
  a.searchParams.set("timezone", "Asia/Kolkata");

  // Dono ek saath
  const [j, aq] = await Promise.all([
    getJson(f.toString()),
    getJson(a.toString()),
  ]);
  if (!j?.current || !j?.hourly || !j?.daily) return null;

  const c = j.current;
  const h = j.hourly;
  const d = j.daily;

  const hours: Hour[] = h.time.map((time: string, i: number) => ({
    time,
    temp: h.temperature_2m[i],
    code: h.weather_code[i],
    isDay: h.is_day[i] === 1,
    rain: h.precipitation_probability[i] ?? 0,
    wind: h.wind_speed_10m[i] ?? 0,
    vis: h.visibility?.[i] ?? null,
  }));

  const days: Day[] = d.time.map((date: string, i: number) => ({
    date,
    code: d.weather_code[i],
    max: d.temperature_2m_max[i],
    min: d.temperature_2m_min[i],
    rainProb: d.precipitation_probability_max[i] ?? 0,
    rainMm: d.precipitation_sum[i] ?? 0,
    rainHours: d.precipitation_hours[i] ?? 0,
    windMax: d.wind_speed_10m_max[i] ?? 0,
    gustMax: d.wind_gusts_10m_max[i] ?? 0,
    uvMax: d.uv_index_max[i] ?? 0,
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    et0: d.et0_fao_evapotranspiration[i] ?? 0,
  }));

  const q = aq?.current;
  const aqi =
    q && typeof q.us_aqi === "number"
      ? { us: q.us_aqi, pm25: q.pm2_5 ?? 0, pm10: q.pm10 ?? 0 }
      : null;

  return {
    updated: c.time,
    current: {
      temp: c.temperature_2m,
      feels: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      wind: c.wind_speed_10m,
      gust: c.wind_gusts_10m ?? 0,
      windDir: c.wind_direction_10m ?? 0,
      code: c.weather_code,
      isDay: c.is_day === 1,
      cloud: c.cloud_cover ?? 0,
      uv: c.uv_index ?? 0,
      vis: c.visibility ?? null,
    },
    hours,
    days,
    aqi,
  };
}

// ---------- samay ke helpers (server aur browser dono mein chalte hain) ----------

// "2026-11-02T06:35" -> "6:35 AM"
export function fmtClock(iso: string) {
  const [hh, mm] = iso.slice(11, 16).split(":").map(Number);
  return `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
}

export function fmtHourNum(n: number) {
  const hh = ((n % 24) + 24) % 24;
  return `${hh % 12 || 12} ${hh < 12 ? "AM" : "PM"}`;
}

export const fmtHour = (iso: string) => fmtHourNum(Number(iso.slice(11, 13)));

// India ka abhi ka ghanta "2026-11-02T15" (browser ke time se)
export const nowKey = () =>
  new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
    .slice(0, 13)
    .replace(" ", "T");

// Abhi ke ghante se `count` ghante
export function fromNow(hours: Hour[], key: string, count: number): Hour[] {
  const i = hours.findIndex((h) => h.time.slice(0, 13) >= key);
  const start = i === -1 ? 0 : i;
  return hours.slice(start, start + count);
}

// ---------- mausam ka naam aur emoji ----------
export function weatherInfo(
  code: number,
  isDay = true,
): { emoji: string; kind: WxKind; text: Bi } {
  if (code === 0)
    return isDay
      ? {
          emoji: "☀️",
          kind: "clear-day",
          text: { pa: "ਸਾਫ਼ ਮੌਸਮ", en: "Clear" },
        }
      : {
          emoji: "🌙",
          kind: "clear-night",
          text: { pa: "ਸਾਫ਼ ਰਾਤ", en: "Clear night" },
        };
  if (code === 1)
    return isDay
      ? {
          emoji: "🌤️",
          kind: "mostly-clear-day",
          text: { pa: "ਜ਼ਿਆਦਾਤਰ ਸਾਫ਼", en: "Mostly clear" },
        }
      : {
          emoji: "🌙",
          kind: "clear-night",
          text: { pa: "ਜ਼ਿਆਦਾਤਰ ਸਾਫ਼ ਰਾਤ", en: "Mostly clear night" },
        };
  if (code === 2)
    return {
      emoji: isDay ? "⛅" : "☁️",
      kind: isDay ? "partly-day" : "partly-night",
      text: { pa: "ਹਲਕੇ ਬੱਦਲ", en: "Partly cloudy" },
    };
  if (code === 3)
    return {
      emoji: "☁️",
      kind: "overcast",
      text: { pa: "ਬੱਦਲਵਾਈ", en: "Overcast" },
    };
  if (code === 45 || code === 48)
    return { emoji: "🌫️", kind: "fog", text: { pa: "ਧੁੰਦ", en: "Fog" } };
  if (code >= 51 && code <= 57)
    return {
      emoji: "🌦️",
      kind: "drizzle",
      text: { pa: "ਬੂੰਦਾਬਾਂਦੀ", en: "Drizzle" },
    };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return { emoji: "🌧️", kind: "rain", text: { pa: "ਮੀਂਹ", en: "Rain" } };
  if (code >= 95)
    return {
      emoji: "⛈️",
      kind: "storm",
      text: { pa: "ਗਰਜ ਨਾਲ ਮੀਂਹ", en: "Thunderstorm" },
    };
  return {
    emoji: "☁️",
    kind: "overcast",
    text: { pa: "ਬੱਦਲਵਾਈ", en: "Cloudy" },
  };
}

export const compass = (deg: number) =>
  ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];

// ---------- Hawa ki quality (US AQI ke standard hisse) ----------
export function aqiInfo(us: number): { label: Bi; advice: Bi; style: string } {
  if (us <= 50)
    return {
      label: { pa: "ਚੰਗੀ", en: "Good" },
      advice: { pa: "ਹਵਾ ਚੰਗੀ ਹੈ।", en: "Air quality is good." },
      style: "bg-green-100 text-green-900",
    };
  if (us <= 100)
    return {
      label: { pa: "ਠੀਕ-ਠਾਕ", en: "Moderate" },
      advice: {
        pa: "ਬਹੁਤ ਸੰਵੇਦਨਸ਼ੀਲ ਲੋਕ ਲੰਮੀ ਬਾਹਰੀ ਮਿਹਨਤ ਘਟਾਉਣ।",
        en: "Very sensitive people should reduce long outdoor exertion.",
      },
      style: "bg-yellow-100 text-yellow-900",
    };
  if (us <= 150)
    return {
      label: {
        pa: "ਸੰਵੇਦਨਸ਼ੀਲਾਂ ਲਈ ਮਾੜੀ",
        en: "Unhealthy for sensitive groups",
      },
      advice: {
        pa: "ਬਜ਼ੁਰਗ, ਬੱਚੇ ਅਤੇ ਦਮੇ ਜਾਂ ਦਿਲ ਦੇ ਮਰੀਜ਼ ਬਾਹਰ ਘੱਟ ਰਹਿਣ।",
        en: "Elders, children and people with asthma or heart conditions should limit time outdoors.",
      },
      style: "bg-orange-100 text-orange-900",
    };
  if (us <= 200)
    return {
      label: { pa: "ਮਾੜੀ", en: "Unhealthy" },
      advice: {
        pa: "ਸਭ ਲਈ ਠੀਕ ਨਹੀਂ। ਲੰਮੀ ਬਾਹਰੀ ਮਿਹਨਤ ਘਟਾਓ।",
        en: "Not good for anyone. Reduce long outdoor exertion.",
      },
      style: "bg-red-100 text-red-900",
    };
  if (us <= 300)
    return {
      label: { pa: "ਬਹੁਤ ਮਾੜੀ", en: "Very unhealthy" },
      advice: {
        pa: "ਬਾਹਰ ਜਾਣ ਤੋਂ ਬਚੋ। ਜ਼ਰੂਰੀ ਹੋਵੇ ਤਾਂ N95 ਮਾਸਕ ਵਰਤੋ।",
        en: "Avoid going out. If you must, use an N95 mask.",
      },
      style: "bg-purple-100 text-purple-900",
    };
  return {
    label: { pa: "ਖ਼ਤਰਨਾਕ", en: "Hazardous" },
    advice: { pa: "ਘਰ ਦੇ ਅੰਦਰ ਰਹੋ।", en: "Stay indoors." },
    style: "bg-rose-200 text-rose-950",
  };
}

// ---------- Chetavani (alerts) ----------
export type Alert = { id: string; level: "info" | "warn" | "danger"; text: Bi };

export function buildAlerts(w: Weather): Alert[] {
  const out: Alert[] = [];
  const next = w.hours.slice(0, 24);
  const d0 = w.days[0];
  const minVis = Math.min(...next.map((h) => h.vis ?? Infinity));

  if (minVis < 200)
    out.push({
      id: "fog",
      level: "danger",
      text: {
        pa: "ਬਹੁਤ ਸੰਘਣੀ ਧੁੰਦ ਦਾ ਖ਼ਤਰਾ: ਬਹੁਤ ਜ਼ਰੂਰੀ ਨਾ ਹੋਵੇ ਤਾਂ ਸਫ਼ਰ ਨਾ ਕਰੋ।",
        en: "Risk of very dense fog: avoid travel unless essential.",
      },
    });
  else if (minVis < 1000)
    out.push({
      id: "fog",
      level: "warn",
      text: {
        pa: "ਧੁੰਦ: ਗੱਡੀ ਹੌਲੀ ਚਲਾਓ ਅਤੇ ਲਾਈਟਾਂ ਚਾਲੂ ਰੱਖੋ।",
        en: "Fog: drive slowly and keep lights on.",
      },
    });

  if (next.some((h) => h.code >= 95))
    out.push({
      id: "storm",
      level: "warn",
      text: {
        pa: "ਗਰਜ ਨਾਲ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ: ਖੁੱਲ੍ਹੇ ਖੇਤ ਜਾਂ ਰੁੱਖਾਂ ਹੇਠ ਨਾ ਖੜ੍ਹੋ।",
        en: "Thunderstorm possible: do not stand in open fields or under trees.",
      },
    });

  if (d0.gustMax >= 60)
    out.push({
      id: "wind",
      level: "danger",
      text: {
        pa: "ਬਹੁਤ ਤੇਜ਼ ਹਵਾ/ਝੱਖੜ: ਢਿੱਲੀਆਂ ਛੱਤਾਂ ਅਤੇ ਸਮਾਨ ਦਾ ਧਿਆਨ ਰੱਖੋ।",
        en: "Very strong wind: secure loose roofs and belongings.",
      },
    });
  else if (d0.gustMax >= 40)
    out.push({
      id: "wind",
      level: "warn",
      text: {
        pa: "ਤੇਜ਼ ਹਵਾ ਦੇ ਝੋਂਕੇ: ਢਿੱਲੇ ਸਮਾਨ ਦਾ ਧਿਆਨ ਰੱਖੋ।",
        en: "Strong gusts: secure loose items.",
      },
    });

  if (d0.rainMm >= 40)
    out.push({
      id: "rain",
      level: "danger",
      text: {
        pa: "ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ: ਖੇਤਾਂ ਵਿੱਚੋਂ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।",
        en: "Heavy rain likely: arrange drainage in the fields.",
      },
    });
  else if (d0.rainMm >= 15)
    out.push({
      id: "rain",
      level: "warn",
      text: { pa: "ਚੰਗੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।", en: "Good rainfall likely." },
    });

  if (d0.max >= 45)
    out.push({
      id: "heat",
      level: "danger",
      text: {
        pa: "ਬਹੁਤ ਜ਼ਿਆਦਾ ਗਰਮੀ: ਦੁਪਹਿਰ ਨੂੰ ਬਾਹਰ ਕੰਮ ਨਾ ਕਰੋ, ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ।",
        en: "Extreme heat: avoid outdoor work at noon, keep drinking water.",
      },
    });
  else if (d0.max >= 40)
    out.push({
      id: "heat",
      level: "warn",
      text: {
        pa: "ਗਰਮੀ: ਦੁਪਹਿਰ ਨੂੰ ਬਾਹਰ ਕੰਮ ਘਟਾਓ।",
        en: "Hot: reduce outdoor work at noon.",
      },
    });

  if (d0.min <= 3)
    out.push({
      id: "cold",
      level: "warn",
      text: {
        pa: "ਕੜਾਕੇ ਦੀ ਠੰਢ: ਬਜ਼ੁਰਗਾਂ ਅਤੇ ਬੱਚਿਆਂ ਦਾ ਖ਼ਾਸ ਧਿਆਨ ਰੱਖੋ।",
        en: "Severe cold: take special care of elders and children.",
      },
    });

  if (d0.uvMax >= 8)
    out.push({
      id: "uv",
      level: "warn",
      text: {
        pa: "ਯੂਵੀ ਬਹੁਤ ਵੱਧ: ਦੁਪਹਿਰ ਦੀ ਧੁੱਪ ਤੋਂ ਬਚੋ।",
        en: "Very high UV: avoid midday sun.",
      },
    });

  if (w.aqi && w.aqi.us >= 200)
    out.push({
      id: "aqi",
      level: "danger",
      text: {
        pa: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਬਹੁਤ ਮਾੜੀ: ਬਾਹਰ ਜਾਣ ਤੋਂ ਬਚੋ।",
        en: "Air quality is very poor: avoid going out.",
      },
    });
  else if (w.aqi && w.aqi.us >= 150)
    out.push({
      id: "aqi",
      level: "warn",
      text: {
        pa: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਮਾੜੀ: ਬਜ਼ੁਰਗ ਤੇ ਬੱਚੇ ਬਾਹਰ ਘੱਟ ਰਹਿਣ।",
        en: "Air quality is poor: elders and children should stay indoors more.",
      },
    });

  const rank = { danger: 0, warn: 1, info: 2 } as const;
  return out.sort((a, b) => rank[a.level] - rank[b.level]);
}

// ---------- Kisan ke liye sanket ----------
export function farmTips(w: Weather): Bi[] {
  const tips: Bi[] = [];
  const d0 = w.days[0];
  const next = w.hours.slice(0, 24);
  const frost = w.days.slice(0, 3).some((d) => d.min <= 4);
  const rain5 = w.days.slice(0, 5).reduce((s, d) => s + d.rainMm, 0);

  if (d0.rainProb >= 60 || d0.rainMm >= 5)
    tips.push({
      pa: "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ: ਸਪਰੇਅ ਤੇ ਕਟਾਈ ਅੱਗੇ ਪਾਓ, ਫ਼ਸਲ ਢੱਕ ਕੇ ਰੱਖੋ।",
      en: "Rain likely: postpone spraying and harvesting, keep produce covered.",
    });
  if (w.current.wind >= 20 || next.some((h) => h.wind >= 20))
    tips.push({
      pa: "ਹਵਾ ਤੇਜ਼ ਹੈ: ਸਪਰੇਅ ਨਾ ਕਰੋ।",
      en: "Strong wind: avoid spraying.",
    });
  if (d0.max >= 38)
    tips.push({
      pa: "ਬਹੁਤ ਗਰਮੀ: ਸਿੰਜਾਈ ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਕਰੋ।",
      en: "Very hot: irrigate in the early morning or evening.",
    });
  if (frost)
    tips.push({
      pa: "ਅਗਲੇ ਦਿਨਾਂ ਵਿੱਚ ਕੋਰੇ ਦਾ ਖ਼ਤਰਾ: ਛੋਟੇ ਬੂਟਿਆਂ ਨੂੰ ਬਚਾਓ।",
      en: "Frost risk in the coming days: protect young plants.",
    });
  if (rain5 >= 30)
    tips.push({
      pa: "ਅਗਲੇ 5 ਦਿਨਾਂ ਵਿੱਚ ਚੰਗਾ ਮੀਂਹ ਪੈ ਸਕਦਾ ਹੈ: ਸਿੰਜਾਈ ਅੱਗੇ ਪਾਓ ਅਤੇ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।",
      en: "Good rain likely in the next 5 days: delay irrigation and arrange drainage.",
    });
  if (tips.length === 0)
    tips.push({
      pa: "ਮੌਸਮ ਆਮ ਹੈ, ਖੇਤੀ ਦੇ ਕੰਮ ਲਈ ਠੀਕ ਹੈ।",
      en: "Weather is normal, fine for farm work.",
    });

  return tips;
}
