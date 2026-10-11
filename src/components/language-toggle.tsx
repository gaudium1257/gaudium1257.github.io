"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  locales,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";

/** KO | EN segmented links; the current one is marked, the other remembers the choice. */
export function LanguageToggle({
  locale,
  label,
  names,
}: {
  locale: Locale;
  label: string;
  names: Record<Locale, string>;
}) {
  const pathname = usePathname();
  return (
    <div
      role="group"
      aria-label={label}
      className="ml-auto flex shrink-0 overflow-hidden rounded-node border border-line lg:ml-2"
    >
      {locales.map((lc) => {
        const cur = lc === locale;
        return (
          <Link
            key={lc}
            href={switchLocalePath(pathname, lc)}
            lang={lc}
            hrefLang={cur ? undefined : lc}
            aria-current={cur ? "true" : undefined}
            onClick={() => {
              try {
                localStorage.setItem(LOCALE_STORAGE_KEY, lc);
              } catch {
                // non-critical preference
              }
            }}
            className={`relative flex h-8 min-w-10 items-center justify-center px-2.5 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-inset-y-1.5 focus-visible:z-10 focus-visible:-outline-offset-2 forced-colors:aria-[current=true]:underline ${cur ? "bg-ink text-white" : "text-muted hover:text-ink active:bg-primary-50"}`}
          >
            {lc.toUpperCase()}
            <span className="sr-only"> {names[lc]}</span>
          </Link>
        );
      })}
    </div>
  );
}
