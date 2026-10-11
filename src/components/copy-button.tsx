"use client";

import { useRef, useState } from "react";

type Text = { idle: string; done: string; failed: string; hint: string };

/**
 * Copies `value`. Announces through the page's single status region. If the clipboard is blocked,
 * the visible value (`[data-copy-value=<id>]`) is selected so it can be copied by hand.
 */
export function CopyButton({
  value,
  valueId,
  text,
  doneMessage,
  sr,
}: {
  value: string;
  valueId: string;
  text: Text;
  doneMessage: string;
  sr: { pre: string; post: string };
}) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
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
      const el = document.querySelector(`[data-copy-value="${valueId}"]`);
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
    <button
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
      {sr.post && <span className="sr-only">{sr.post}</span>}
    </button>
  );
}
