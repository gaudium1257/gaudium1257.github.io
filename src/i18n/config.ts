import type { Localized } from "@/content/schema";

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** First supported language in a preference list (`navigator.languages`), else the default. */
export const matchLocale = (langs: readonly string[]): Locale =>
  langs.map((l) => l.slice(0, 2).toLowerCase()).find(hasLocale) ??
  defaultLocale;

/** Pick the string for the current locale from a content `Localized` field. */
export const t = (value: Localized, locale: Locale) => value[locale];

/** Same page in the other language: `/ko/projects/x/` → `/en/projects/x/`. */
export const switchLocalePath = (pathname: string, to: Locale) =>
  pathname.replace(/^\/(ko|en)(?=\/|$)/, `/${to}`);

/** localStorage key remembering the visitor's last chosen language. */
export const LOCALE_STORAGE_KEY = "preferred-locale";
