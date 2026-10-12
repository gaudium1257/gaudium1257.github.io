"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import {
  LOCALE_STORAGE_KEY,
  locales,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";

/**
 * Where to land in the other language: the same page, with its query (`?tech=`) and hash, and —
 * when the visitor has scrolled — the section in the upper part of the viewport (detail-page TOC
 * sections first, else the home sections), so switching never drops them at the top.
 * Not the scroll-spy's highlight: near the page end that line slides down to later sections.
 */
function targetUrl(to: Locale) {
  const path = switchLocalePath(location.pathname, to);
  let hash = location.hash;
  if (!hash && scrollY > 80) {
    const toc = [...document.querySelectorAll<HTMLElement>("[data-toc]")];
    const ids = (
      toc.length
        ? toc.map((a) => a.dataset.toc)
        : [...document.querySelectorAll<HTMLElement>("[data-nav]")].map(
            (a) => a.dataset.nav,
          )
    ).filter((id): id is string => !!id);
    // a section whose top has reached the upper third of the screen is the one being read
    const line = innerHeight / 3;
    // the lowest section top above the line; side-by-side sections (activities | awards) keep the first
    let at: string | undefined;
    let best = -Infinity;
    for (const id of ids) {
      const top = document.getElementById(id)?.getBoundingClientRect().top;
      if (top !== undefined && top <= line && top > best)
        [at, best] = [id, top];
    }
    if (at) hash = `#${at}`;
  }
  return path + location.search + hash;
}

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
  const go = (e: MouseEvent<HTMLAnchorElement>, lc: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, lc);
    } catch {
      // non-critical preference
    }
    // new tab / window: let the plain href (same page in the other language) do its job
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    location.assign(targetUrl(lc));
  };
  return (
    <div
      role="group"
      aria-label={label}
      className="ml-auto flex shrink-0 rounded-node border border-line lg:ml-2"
    >
      {locales.map((lc) => {
        const cur = lc === locale;
        return (
          // a plain link (full page load): the other language is a different root layout
          <a
            key={lc}
            href={switchLocalePath(pathname, lc)}
            lang={lc}
            hrefLang={cur ? undefined : lc}
            aria-current={cur ? "true" : undefined}
            onClick={(e) => go(e, lc)}
            // no overflow-hidden on the group: it would clip the ::after that grows the tap target to 44px
            className={`relative flex h-8 min-w-10 items-center justify-center px-2.5 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-inset-y-1.5 first:rounded-l-[calc(var(--radius-node)-1px)] last:rounded-r-[calc(var(--radius-node)-1px)] focus-visible:z-10 forced-colors:aria-[current=true]:underline ${cur ? "bg-ink text-white" : "text-muted hover:text-ink active:bg-primary-50"}`}
          >
            {lc.toUpperCase()}
            <span className="sr-only"> {names[lc]}</span>
          </a>
        );
      })}
    </div>
  );
}
