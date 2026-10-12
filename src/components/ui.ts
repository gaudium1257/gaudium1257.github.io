/** Shared class strings (one link style site-wide; stretched card links). */
export const LINK =
  "text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-primary-700 hover:decoration-2 active:text-primary-700";
export const STRETCH =
  "after:absolute after:inset-0 after:rounded-panel focus-visible:outline-none";
export const ENTRY_FOCUS =
  "has-[[data-stretch]:focus-visible]:outline-2 has-[[data-stretch]:focus-visible]:-outline-offset-2 has-[[data-stretch]:focus-visible]:outline-primary";

/** Label/value rows (detail tech list, AI tools row): one fixed label column. */
export const LABEL_COLS =
  "grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]";

/** The one bordered button (detail links, "more screens"). */
export const BUTTON =
  "inline-flex min-h-11 items-center gap-2 rounded-node border border-edge bg-white px-4 py-2 text-ui font-semibold text-ink transition-colors hover:border-primary hover:bg-primary-50 active:bg-primary-100";

/** The one filled (primary) button: the main action of a section. */
export const BUTTON_PRIMARY =
  "inline-flex min-h-12 items-center gap-2 rounded-node bg-primary px-5 text-ui font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-700 active:ring-2 active:ring-primary-100";

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");
