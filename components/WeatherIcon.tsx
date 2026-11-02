import {
    Cloud,
    CloudDrizzle, CloudFog, CloudLightning,
    CloudMoon, CloudRain,
    CloudSun,
    Moon,
    Sun,
    type LucideIcon,
} from "lucide-react";

export type WxKind =
  | "clear-day" | "clear-night" | "mostly-clear-day" | "partly-day" | "partly-night"
  | "overcast" | "fog" | "drizzle" | "rain" | "storm";

const map: Record<WxKind, { Icon: LucideIcon; cls: string }> = {
  "clear-day": { Icon: Sun, cls: "text-gold" },
  "clear-night": { Icon: Moon, cls: "fill-slate-200 text-slate-500" },
  "mostly-clear-day": { Icon: CloudSun, cls: "text-saffron" },
  "partly-day": { Icon: CloudSun, cls: "text-saffron" },
  "partly-night": { Icon: CloudMoon, cls: "text-slate-500" },
  overcast: { Icon: Cloud, cls: "text-slate-500" },
  fog: { Icon: CloudFog, cls: "text-slate-400" },
  drizzle: { Icon: CloudDrizzle, cls: "text-sky-600" },
  rain: { Icon: CloudRain, cls: "text-sky-700" },
  storm: { Icon: CloudLightning, cls: "text-indigo-600" },
};

export default function WeatherIcon({
  kind, size = 28, label,
}: { kind: WxKind; size?: number; label: string }) {
  const { Icon, cls } = map[kind];
  return <Icon size={size} className={cls} role="img" aria-label={label} />;
}