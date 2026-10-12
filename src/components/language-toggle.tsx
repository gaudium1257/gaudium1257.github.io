"use client";

import { usePathname } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import {
  LOCALE_STORAGE_KEY,
  locales,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";

const POS_KEY = "locale-switch-position";

/** `sel` finds the anchor again on the other page; `hash` is set when it is a section. */
type Position = { path: string; sel?: string; hash?: string; ratio: number };

type Anchor = { el: HTMLElement; sel: string; hash?: string };

/** Top edge of the readable area: everything above it sits under the sticky header. */
const edge = () =>
  document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;

/**
 * What a position can be measured from: detail-page TOC sections, else home sections, else the
 * visible project cards (list page). Side-by-side sections share a top: the nav's current one first.
 */
function anchors(): Anchor[] {
  const toc = [...document.querySelectorAll<HTMLElement>("[data-toc]")];
  const links = toc.length
    ? toc
    : [...document.querySelectorAll<HTMLElement>("[data-nav]")];
  const idOf = (a?: HTMLElement) => a?.dataset.toc ?? a?.dataset.nav;
  const marked = idOf(links.find((a) => a.dataset.current === "true"));
  const ids = [...new Set(links.map((a) => idOf(a)))].sort(
    (a, b) => Number(b === marked) - Number(a === marked),
  );
  const secs = ids.flatMap((id) => {
    const el = id ? document.getElementById(id) : null;
    return el ? [{ el, sel: `#${id}`, hash: id }] : [];
  });
  if (secs.length) return secs;
  return [
    ...document.querySelectorAll<HTMLElement>(
      '[data-project]:not([data-show="false"])',
    ),
  ].map((el) => ({ el, sel: `[data-project="${el.dataset.project}"]` }));
}

/**
 * Where the visitor is reading, in terms that survive the other language's different text lengths:
 * the anchor at the top edge and how far into it they are (0–1); with no anchor passed yet, the
 * overall scroll fraction.
 */
function readingPosition(path: string): Position | null {
  if (scrollY < 4) return null;
  const line = edge() + 1;
  const passed = anchors().filter(
    (a) => a.el.getBoundingClientRect().top <= line,
  );
  if (passed.length) {
    const lowest = Math.max(
      ...passed.map((a) => a.el.getBoundingClientRect().top),
    );
    // first in `anchors()` order among those sharing that top
    const at = passed.find(
      (a) => Math.abs(a.el.getBoundingClientRect().top - lowest) < 4,
    )!;
    const r = at.el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (edge() - r.top) / r.height));
    return { path, sel: at.sel, hash: at.hash, ratio };
  }
  const max = document.documentElement.scrollHeight - innerHeight;
  return { path, ratio: max > 0 ? scrollY / max : 0 };
}

/**
 * On the new page: back to the saved spot (once; a stale entry for another page is dropped).
 * Waits two frames so effects that reshape the page on load (the `?tech=` filter) have run.
 */
function restorePosition() {
  let pos: Position | null = null;
  try {
    pos = JSON.parse(sessionStorage.getItem(POS_KEY) ?? "null");
    sessionStorage.removeItem(POS_KEY);
  } catch {
    return;
  }
  if (!pos || pos.path !== location.pathname) return;
  const { sel, ratio } = pos;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = sel ? document.querySelector<HTMLElement>(sel) : null;
      const top = el
        ? el.getBoundingClientRect().top +
          scrollY +
          ratio * el.offsetHeight -
          edge()
        : ratio * (document.documentElement.scrollHeight - innerHeight);
      scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }),
  );
}

/**
 * The same page in the other language with its query (`?tech=`), opened where the visitor is
 * reading now — not at the URL hash, which still names whatever was clicked last. The section also
 * goes in the hash so the page opens near it (and without storage) before the exact spot is restored.
 */
function targetUrl(to: Locale) {
  const path = switchLocalePath(location.pathname, to);
  const pos = readingPosition(path);
  try {
    if (pos) sessionStorage.setItem(POS_KEY, JSON.stringify(pos));
    else sessionStorage.removeItem(POS_KEY);
  } catch {
    // no storage: the hash still lands on the section
  }
  return path + location.search + (pos?.hash ? `#${pos.hash}` : "");
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
  useEffect(restorePosition, []);
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
