/** Shared class strings (one link style site-wide; stretched card links). */
export const LINK =
  "text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-primary-700 hover:decoration-2 active:text-primary-700";
export const STRETCH =
  "after:absolute after:inset-0 after:rounded-panel focus-visible:outline-none";
export const ENTRY_FOCUS =
  "has-[[data-stretch]:focus-visible]:outline-2 has-[[data-stretch]:focus-visible]:outline-offset-2 has-[[data-stretch]:focus-visible]:outline-primary";

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");
