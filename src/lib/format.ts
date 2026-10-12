const NBSP = " ";

/** "2025-03" | "2025-03-14" → "2025.03" (both languages). */
export const formatYm = (date: string) => date.slice(0, 7).replace("-", ".");

/**
 * "2025-03-14" → "2025.03.14". The dotted date is a design decision for both languages
 * (docs/design/README.md, rule 1), so it is formatted here instead of with Intl.DateTimeFormat.
 */
export const formatYmd = (date: string) => date.replaceAll("-", ".");

/** Counts such as GitHub stars, grouped the locale's way. */
export const formatNumber = (n: number, locale: string) =>
  new Intl.NumberFormat(locale).format(n);

/** 42.5 → "42.5%" in the locale's style. */
export const formatPercent = (pct: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(pct / 100);

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
