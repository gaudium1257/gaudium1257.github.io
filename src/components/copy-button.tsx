"use client";

import { useRef, useState } from "react";
import { BrandText } from "./brand-text";
import { cx } from "./ui";

type Text = { idle: string; done: string; failed: string; hint: string };

/**
 * Copies `value`. Announces through the page's single status region. If the clipboard is blocked,
 * the visible value (`[data-copy-value=<id>]` in the same row) is selected so it can be copied by
 * hand, and the hint shows as its own line under the row (aria-hidden: the status region says it).
 * The parent row must wrap (`flex-wrap`) so the hint can take the full width.
 */
export function CopyButton({
  value,
  valueId,
  text,
  doneMessage,
  sr,
  tone = "light",
}: {
  value: string;
  valueId: string;
  text: Text;
  doneMessage: string;
  sr: { pre: string; post: string };
  /** "stage": sits on the deep-violet band, so the failure hint uses the light on-stage colour */
  tone?: "light" | "stage";
}) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const button = useRef<HTMLButtonElement>(null);
  const say = (msg: string) => {
    const status = document.querySelector("[data-status]");
    if (!status) return;
    status.textContent = "";
    requestAnimationFrame(() => (status.textContent = msg));
  };
  const onClick = async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      ok = false;
    }
    setState(ok ? "done" : "fail");
    say(ok ? doneMessage : text.hint);
    if (!ok) {
      // the same value can appear twice on a page (intro and contact): select the one in this row
      const sel = `[data-copy-value="${valueId}"]`;
      const el =
        button.current?.closest("dd")?.querySelector(sel) ??
        document.querySelector(sel);
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        getSelection()?.removeAllRanges();
        getSelection()?.addRange(r);
      }
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), ok ? 1600 : 4000);
  };
  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={onClick}
        data-done={
          state === "done" ? "true" : state === "fail" ? "fail" : "false"
        }
        className="relative z-10 inline-flex h-7 shrink-0 items-center rounded-tag border border-line bg-white px-2 text-sm font-medium text-ink-2 transition-colors after:absolute after:-inset-2 hover:border-edge hover:text-ink active:bg-primary-50 data-[done=fail]:border-award data-[done=fail]:text-award data-[done=true]:border-live data-[done=true]:text-live"
      >
        {sr.pre && <span className="sr-only">{sr.pre}</span>}
        <span>
          {state === "done"
            ? text.done
            : state === "fail"
              ? text.failed
              : text.idle}
        </span>
        {sr.post && (
          <span className="sr-only">
            <BrandText text={sr.post} />
          </span>
        )}
      </button>
      {state === "fail" && (
        <span
          aria-hidden="true"
          className={cx(
            "basis-full text-sm",
            tone === "stage" ? "text-lilac-soft" : "text-award",
          )}
        >
          {text.hint}
        </span>
      )}
    </>
  );
}
