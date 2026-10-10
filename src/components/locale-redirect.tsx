"use client";

import { useEffect } from "react";
import { defaultLocale, hasLocale, LOCALE_STORAGE_KEY } from "@/i18n/config";

/** `/` → last chosen language, else the browser language, else the default. */
export function LocaleRedirect() {
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // storage can be blocked (private mode); fall through to navigator
    }
    const browser = navigator.language.slice(0, 2);
    const locale =
      saved && hasLocale(saved)
        ? saved
        : hasLocale(browser)
          ? browser
          : defaultLocale;
    window.location.replace(`/${locale}/`);
  }, []);
  return null;
}
