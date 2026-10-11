"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tech filter for a project list. Tech nodes are real links (`a[data-tech]`, no-JS fallback: the
 * project list page); with JS this filters entries (`[data-project][data-techs]`) in place, marks
 * matching chips (`[data-node]`), keeps `?tech=` in the URL and announces the result.
 */
export function FilterBar({
  template,
  clearLabel,
}: {
  template: string;
  clearLabel: string;
}) {
  const [text, setText] = useState("");
  const current = useRef<string | null>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>("a[data-tech]"),
    ];
    const entries = [
      ...document.querySelectorAll<HTMLElement>("[data-project]"),
    ];
    const status = document.querySelector("[data-status]");
    const say = (msg: string) => {
      if (!status) return;
      status.textContent = "";
      requestAnimationFrame(() => (status.textContent = msg));
    };
    const apply = (slug: string | null, announce: boolean) => {
      current.current = slug;
      links.forEach((a) =>
        a.setAttribute("aria-current", String(a.dataset.tech === slug)),
      );
      let n = 0;
      for (const li of entries) {
        const hit = !slug || (li.dataset.techs ?? "").split(" ").includes(slug);
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
      const msg = slug
        ? template.replace("{tech}", label).replace("{n}", String(n))
        : "";
      setText(msg);
      if (slug && announce) say(msg);
      return msg;
    };
    const onClick = (ev: MouseEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; // new tab: open the static page
      ev.preventDefault();
      const a = ev.currentTarget as HTMLAnchorElement;
      const kbd = ev.detail === 0;
      const next = current.current === a.dataset.tech ? null : a.dataset.tech!;
      apply(next, !(kbd && next));
      const list = document.querySelector("[data-project-list]");
      if (list && list.getBoundingClientRect().top > innerHeight - 160)
        document
          .querySelector("[data-filter-bar]")
          ?.scrollIntoView({ block: "start" });
      if (kbd && next)
        requestAnimationFrame(() =>
          textRef.current?.focus({ preventScroll: true }),
        );
    };
    links.forEach((a) => a.addEventListener("click", onClick));
    const q = new URLSearchParams(location.search).get("tech");
    if (q && links.some((a) => a.dataset.tech === q)) apply(q, false);
    const onClear = () => {
      const was = links.find((a) => a.dataset.tech === current.current);
      apply(null, false);
      was?.focus();
    };
    window.addEventListener("portfolio:clear-filter", onClear);
    return () => {
      links.forEach((a) => a.removeEventListener("click", onClick));
      window.removeEventListener("portfolio:clear-filter", onClear);
    };
  }, [template]);

  return (
    <div
      data-filter-bar
      data-show={text ? "true" : "false"}
      className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-node bg-primary-50 px-4 py-2.5 data-[show=false]:hidden"
    >
      <p
        ref={textRef}
        tabIndex={-1}
        className="text-ui font-medium text-primary-700"
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() =>
          window.dispatchEvent(new Event("portfolio:clear-filter"))
        }
        className="relative text-ui font-semibold text-primary underline underline-offset-4 after:absolute after:-inset-2 hover:text-primary-700"
      >
        {clearLabel}
      </button>
    </div>
  );
}
