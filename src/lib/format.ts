const NBSP = " ";

/** "2025-03" | "2025-03-14" → "2025.03" (both languages). */
export const formatYm = (date: string) => date.slice(0, 7).replace("-", ".");

/** "2025.03 – 2025.06", open end → "2025.03 – 현재". NBSPs keep a range on one line. */
export const formatPeriod = (
  period: { start: string; end: string | null },
  openLabel: string,
) =>
  period.end && formatYm(period.end) === formatYm(period.start)
    ? formatYm(period.start)
    : `${formatYm(period.start)}${NBSP}–${NBSP}${period.end ? formatYm(period.end) : openLabel}`;

/** Fill "{n}" style placeholders in a dictionary string. */
export const fill = (
  template: string,
  values: Record<string, string | number>,
) => template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
