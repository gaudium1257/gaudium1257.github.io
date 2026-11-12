"use client";

import { animate } from "motion";
import { useEffect } from "react";
import { reducedMotion } from "@/lib/reduced-motion";

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

/**
 * One underline per nav list that slides to the scroll-spy's current link instead of each
 * link drawing its own. The links' own ::after stays hidden while the slider is in charge.
 */
function slideNav() {
  const lists = [...document.querySelectorAll<HTMLUListElement>("ul")].filter(
    (ul) => ul.querySelector("a[data-nav]"),
  );
  const offs = lists.map((ul) => {
    const bar = document.createElement("span");
    bar.setAttribute("aria-hidden", "true");
    bar.className =
      "pointer-events-none absolute top-0 left-0 h-0.5 w-0 origin-left bg-primary opacity-0 forced-colors:bg-[CanvasText]";
    ul.classList.add("relative");
    ul.append(bar);
    ul.dataset.slide = "true";
    let first = true;
    const place = () => {
      const a = ul.querySelector<HTMLElement>('a[data-current="true"]');
      if (!a || !a.offsetParent) {
        bar.style.opacity = "0";
        return;
      }
      // the bar spans the link minus its ::after insets, on the link's bottom edge
      const after = getComputedStyle(a, "::after");
      const inset = parseFloat(after.left) || 0;
      const box = a.getBoundingClientRect();
      const host = ul.getBoundingClientRect();
      const to = {
        x: box.left - host.left + inset,
        y: box.bottom - host.top - 2,
        width: box.width - inset * 2,
        opacity: 1,
      };
      if (first || reducedMotion()) {
        Object.assign(bar.style, {
          transform: `translate(${to.x}px, ${to.y}px)`,
          width: `${to.width}px`,
          opacity: "1",
        });
        first = false;
      } else animate(bar, to, SPRING);
    };
    const watch = new MutationObserver(place);
    ul.querySelectorAll("a[data-nav]").forEach((a) =>
      watch.observe(a, { attributes: true, attributeFilter: ["data-current"] }),
    );
    const onResize = () => {
      first = true;
      place();
    };
    addEventListener("resize", onResize);
    place();
    return () => {
      watch.disconnect();
      removeEventListener("resize", onResize);
      bar.remove();
      delete ul.dataset.slide;
    };
  });
  return () => offs.forEach((off) => off());
}

/** Buttons and tech nodes (`.press`) dip on press and spring back. */
function pressFeedback() {
  let held: HTMLElement | null = null;
  const down = (e: PointerEvent) => {
    held = (e.target as Element).closest<HTMLElement>(".press");
    if (held) animate(held, { scale: 0.95 }, { duration: 0.08 });
  };
  const up = () => {
    if (held)
      animate(
        held,
        { scale: 1 },
        { type: "spring", stiffness: 600, damping: 14 },
      );
    held = null;
  };
  addEventListener("pointerdown", down);
  addEventListener("pointerup", up);
  addEventListener("pointercancel", up);
  return () => {
    removeEventListener("pointerdown", down);
    removeEventListener("pointerup", up);
    removeEventListener("pointercancel", up);
  };
}

/**
 * The header's name/mark (`a[data-home]`): on the home page itself it scrolls back to the top
 * (smoothly unless motion is reduced) instead of reloading; elsewhere it stays a plain link home.
 */
function scrollHome() {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-home]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)
      return;
    if (new URL(a.href).pathname !== location.pathname) return;
    e.preventDefault();
    scrollTo({ top: 0, behavior: reducedMotion() ? "instant" : "smooth" });
    // drop a stale #section from the address; keep ?tech=
    history.replaceState(
      history.state,
      "",
      location.pathname + location.search,
    );
  };
  addEventListener("click", onClick);
  return () => removeEventListener("click", onClick);
}

/**
 * Site-wide touches (owner picked 2026.11): the home link scrolls to the top, plus — unless motion
 * is reduced — the sliding nav underline and the press spring. The project filter animates its own
 * cards (project-filter.tsx).
 */
export function MotionEffects() {
  useEffect(() => {
    // smooth scrolling starts after load: the browser's own jump to /#section (and its scroll
    // restore on reload) must not turn into a visible glide down the page
    const root = document.documentElement;
    const smooth = () =>
      requestAnimationFrame(() => (root.dataset.smooth = ""));
    if (document.readyState === "complete") smooth();
    else addEventListener("load", smooth, { once: true });
    const offs = [scrollHome()];
    if (!reducedMotion()) offs.push(slideNav(), pressFeedback());
    return () => offs.forEach((off) => off());
  }, []);
  return null;
}
