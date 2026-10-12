"use client";

import { useEffect } from "react";
import { hasLocale, LOCALE_STORAGE_KEY, matchLocale } from "@/i18n/config";

/** `/` → last chosen language, else the first supported browser language, else the default. */
export function LocaleRedirect() {
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // storage can be blocked (private mode); fall through to navigator
    }
    const locale =
      saved && hasLocale(saved)
        ? saved
        : matchLocale(
            navigator.languages?.length
              ? navigator.languages
              : [navigator.language],
          );
    window.location.replace(`/${locale}/`);
  }, []);
  return null;
}
