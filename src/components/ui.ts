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

/** Links and buttons on the deep-violet stage (hero, contact band). */
export const STAGE_LINK =
  "text-lilac underline decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-2 active:text-white";
// hover and press always get brighter than rest (WIG: interactive states increase contrast)
export const STAGE_BUTTON_PRIMARY =
  "inline-flex min-h-12 items-center gap-2 rounded-node bg-lilac-soft px-5 text-ui font-semibold text-stage transition-colors hover:bg-white active:bg-white active:ring-2 active:ring-lilac";
export const STAGE_BUTTON =
  "inline-flex min-h-12 items-center gap-2 rounded-node px-5 text-ui font-semibold text-white ring-1 ring-lilac/60 transition-colors ring-inset hover:bg-stage-line hover:ring-white active:bg-stage-line active:ring-2 active:ring-white";

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");
