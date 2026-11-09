"use client";

import { animate } from "motion";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { reducedMotion } from "@/lib/reduced-motion";

type Status = { slug: string; label: string; n: number } | null;

/**
 * Tech filter for a project list. Tech nodes are real links (`a[data-tech]`, no-JS fallback: the
 * project list page); with JS this filters entries (`[data-project][data-techs]`) in place, marks
 * matching chips (`[data-node]`), keeps `?tech=` in the URL and announces the result.
 * `listHref` (home only): where to send the visitor when none of the shown entries match.
 */
export function FilterBar({
  template,
  clearLabel,
  clearedMessage,
  noneMessage,
  noneLink,
  listHref,
}: {
  template: string;
  clearLabel: string;
  clearedMessage: string;
  noneMessage: string;
  noneLink: string;
  listHref?: string;
}) {
  const [status, setStatus] = useState<Status>(null);
  const current = useRef<string | null>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>("a[data-tech]"),
    ];
    const entries = [
      ...document.querySelectorAll<HTMLElement>("[data-project]"),
    ];
    const region = document.querySelector("[data-status]");
    const say = (msg: string) => {
      if (!region) return;
      region.textContent = "";
      requestAnimationFrame(() => (region.textContent = msg));
    };
    const shown = (li: HTMLElement) => li.dataset.show !== "false";
    const hits = (li: HTMLElement, slug: string | null) =>
      !slug || (li.dataset.techs ?? "").split(" ").includes(slug);
    let running: { stop: () => void }[] = [];
    /**
     * Cards that stay glide from their old spot to the new one (FLIP), leaving cards fade out
     * first, arriving ones rise in. Without motion (or on load) the list just switches.
     */
    const change = async (slug: string | null, announce: boolean) => {
      running.forEach((a) => a.stop());
      running = [];
      if (reducedMotion()) return apply(slug, announce);
      const leaving = entries.filter((li) => shown(li) && !hits(li, slug));
      const arriving = entries.filter((li) => !shown(li) && hits(li, slug));
      const fades = leaving.map((li) =>
        animate(li, { opacity: 0, scale: 0.97 }, { duration: 0.16 }),
      );
      running.push(...fades);
      await Promise.all(fades);
      leaving.forEach((li) =>
        Object.assign(li.style, { opacity: "", transform: "" }),
      );
      const before = new Map(
        entries.filter(shown).map((li) => [li, li.getBoundingClientRect()]),
      );
      flushSync(() => apply(slug, announce));
      for (const li of entries.filter(shown)) {
        const was = before.get(li);
        if (!was) continue;
        const now = li.getBoundingClientRect();
        const x = was.left - now.left;
        const y = was.top - now.top;
        if (x || y)
          running.push(
            animate(
              li,
              { x: [x, 0], y: [y, 0] },
              {
                type: "spring",
                stiffness: 380,
                damping: 34,
              },
            ),
          );
      }
      arriving.forEach((li, i) =>
        running.push(
          animate(
            li,
            { opacity: [0, 1], y: [16, 0] },
            { duration: 0.3, delay: 0.04 * i, ease: [0.22, 1, 0.36, 1] },
          ),
        ),
      );
    };
    const apply = (slug: string | null, announce: boolean) => {
      const was = current.current;
      current.current = slug;
      links.forEach((a) =>
        a.setAttribute("aria-current", String(a.dataset.tech === slug)),
      );
      let n = 0;
      for (const li of entries) {
        const hit = hits(li, slug);
        li.setAttribute("data-show", String(hit));
        if (hit) n++;
        li.querySelectorAll<HTMLElement>("[data-node]").forEach((c) =>
          c.setAttribute(
            "data-match",
            String(!!slug && c.dataset.node === slug),
          ),
        );
      }
      const url = new URL(location.href);
      if (slug) url.searchParams.set("tech", slug);
      else url.searchParams.delete("tech");
      history.replaceState(history.state, "", url);
      const label =
        links.find((a) => a.dataset.tech === slug)?.dataset.label ?? "";
      setStatus(slug ? { slug, label, n } : null);
      if (slug && announce)
        say(
          template.replace("{tech}", label) +
            (n === 0 && listHref ? ` ${noneMessage}` : ""),
        );
      if (!slug && was && announce) say(clearedMessage);
    };
    const onClick = (ev: MouseEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; // new tab: open the static page
      ev.preventDefault();
      const a = ev.currentTarget as HTMLAnchorElement;
      const kbd = ev.detail === 0;
      const next = current.current === a.dataset.tech ? null : a.dataset.tech!;
      void change(next, !(kbd && next));
      // measure and move only after React has rendered the bar (it is hidden while empty)
      requestAnimationFrame(() => {
        const list = document.querySelector("[data-project-list]");
        if (list && list.getBoundingClientRect().top > innerHeight - 160)
          document
            .querySelector("[data-filter-bar]")
            ?.scrollIntoView({ block: "start" });
        if (kbd && next) textRef.current?.focus({ preventScroll: true });
      });
    };
    links.forEach((a) => a.addEventListener("click", onClick));
    const q = new URLSearchParams(location.search).get("tech");
    if (q && links.some((a) => a.dataset.tech === q)) apply(q, false);
    const onClear = () => {
      const was = links.find((a) => a.dataset.tech === current.current);
      void change(null, true);
      was?.focus();
    };
    window.addEventListener("portfolio:clear-filter", onClear);
    return () => {
      links.forEach((a) => a.removeEventListener("click", onClick));
      window.removeEventListener("portfolio:clear-filter", onClear);
    };
  }, [template, clearedMessage, noneMessage, listHref]);

  // the tech name stays out of auto-translate: split the sentence around it
  const [before, after] = template.split("{tech}");
  return (
    <div
      data-filter-bar
      data-show={status ? "true" : "false"}
      className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-node bg-primary-50 px-4 py-2.5 data-[show=false]:hidden"
    >
      <p
        ref={textRef}
        tabIndex={-1}
        className="text-ui font-medium text-primary-700"
      >
        {status && (
          <>
            {before}
            <span translate="no">{status.label}</span>
            {after}
            {status.n === 0 && listHref && (
              <>
                {" "}
                <span className="font-normal">{noneMessage}</span>{" "}
                <a
                  href={`${listHref}?tech=${status.slug}`}
                  className="font-semibold underline underline-offset-4 hover:decoration-2 active:text-ink"
                >
                  {noneLink}
                </a>
              </>
            )}
          </>
        )}
      </p>
      <button
        type="button"
        onClick={() =>
          window.dispatchEvent(new Event("portfolio:clear-filter"))
        }
        className="relative text-ui font-semibold text-primary underline underline-offset-4 after:absolute after:-inset-2 hover:text-primary-700 hover:decoration-2 active:text-ink"
      >
        {clearLabel}
      </button>
    </div>
  );
}
