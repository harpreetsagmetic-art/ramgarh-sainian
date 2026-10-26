import { en } from "./dictionaries/en";
import { pa } from "./dictionaries/pa";

export const locales = ["pa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pa";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

export function getDictionary(locale: Locale) {
  return locale === "pa" ? pa : en;
}