"use client";

import { useEffect } from "react";

/**
 * Scrollspy for `[data-nav]` (home nav) and `[data-toc]` (project TOC). Exactly one link is current:
 * the last section whose top passed the line just under the sticky header (where an anchor jump lands).
 * Sections side by side share a top: the first wins unless the other was clicked. A clicked link stays
 * current until its jump has arrived, then while its section still holds the upper half of the screen
 * (near the page end the line slides past short sections, so the click must win there).
 */
function spy(links: HTMLAnchorElement[], key: "nav" | "toc") {
  const root = document.documentElement;
  const ids = [...new Set(links.map((a) => a.dataset[key]!))];
  const secs = ids
    .map((id) => document.getElementById(id))
    .filter((s): s is HTMLElement => !!s);
  if (!secs.length) return () => {};
  let clicked: string | null = null;
  let lock = 0;
  let last = "";
  let fallback: ReturnType<typeof setTimeout> | undefined;
  const set = (cur: string) => {
    if (cur === last) return;
    last = cur;
    for (const a of links) {
      const on = a.dataset[key] === cur;
      a.setAttribute("data-current", String(on));
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    }
  };
  const update = () => {
    if (Date.now() < lock) return;
    const base =
      (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) +
      24;
    // in the last screenful the line slides down to the viewport bottom, so short closing
    // sections (education, contact) each get their turn instead of the page jumping to the last one
    const max = root.scrollHeight - innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, (scrollY - (max - innerHeight)) / innerHeight),
    );
    const line = base + progress * (innerHeight - base);
    const passed = secs.filter((x) => x.getBoundingClientRect().top <= line);
    let row = [secs[0]];
    if (passed.length) {
      const top = passed[passed.length - 1].getBoundingClientRect().top;
      row = secs.filter(
        (x) => Math.abs(x.getBoundingClientRect().top - top) < 4,
      );
    }
    const bottom = innerHeight + scrollY >= root.scrollHeight - 2;
    let cur = row[0].id;
    const held = clicked && document.getElementById(clicked);
    if (held) {
      const r = held.getBoundingClientRect();
      if (r.top <= innerHeight / 2 && r.bottom > base) cur = held.id;
      else clicked = null;
    } else if (bottom) cur = secs[secs.length - 1].id;
    set(cur);
  };
  // the hold ends when the jump has arrived (a scrollend left over from an earlier scroll doesn't count)
  const arrived = () => {
    const el = clicked && document.getElementById(clicked);
    if (!el) return true;
    const pt = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const max = root.scrollHeight - innerHeight;
    const goal = Math.min(
      max,
      Math.max(0, scrollY + el.getBoundingClientRect().top - pt),
    );
    return Math.abs(scrollY - goal) < 6;
  };
  const release = () => {
    lock = 0;
    clearTimeout(fallback);
    update();
  };
  const onClick = (e: Event) => {
    clicked = (e.currentTarget as HTMLElement).dataset[key]!;
    lock = Infinity;
    clearTimeout(fallback);
    fallback = setTimeout(release, 2500);
    set(clicked);
  };
  let ticking = false;
  const tick = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };
  const onEnd = () => {
    if (lock === Infinity && !arrived()) return;
    release();
  };
  links.forEach((a) => a.addEventListener("click", onClick));
  addEventListener("scrollend", onEnd);
  addEventListener("scroll", tick, { passive: true });
  addEventListener("resize", tick);
  update();
  return () => {
    links.forEach((a) => a.removeEventListener("click", onClick));
    removeEventListener("scrollend", onEnd);
    removeEventListener("scroll", tick);
    removeEventListener("resize", tick);
    clearTimeout(fallback);
  };
}

export function ScrollSpy() {
  useEffect(() => {
    const navLinks = [
      ...document.querySelectorAll<HTMLAnchorElement>("a[data-nav]"),
    ];
    // sub-pages (project list/detail) have no home sections: 프로젝트 is the current section
    if (!document.getElementById("about"))
      navLinks
        .filter((a) => a.dataset.nav === "projects")
        .forEach((a) => {
          a.setAttribute("data-current", "true");
          a.setAttribute("aria-current", "true");
        });
    const offNav = spy(navLinks, "nav");
    const offToc = spy(
      [...document.querySelectorAll<HTMLAnchorElement>("a[data-toc]")],
      "toc",
    );
    return () => {
      offNav();
      offToc();
    };
  }, []);
  return null;
}
