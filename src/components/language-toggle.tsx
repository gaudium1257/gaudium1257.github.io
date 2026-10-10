"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";

export function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const target: Locale = locale === "ko" ? "en" : "ko";
  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      onClick={() => {
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, target);
        } catch {
          // non-critical preference
        }
      }}
    >
      {label}
    </Link>
  );
}
