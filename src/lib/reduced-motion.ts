/** Visitors who asked for less motion get none of the Motion effects. */
export const reducedMotion = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;
