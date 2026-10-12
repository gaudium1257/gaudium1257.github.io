import type { Localized, MediaKind, Project } from "@/content/schema";

export type Shot = { src: string; alt: Localized; kind: MediaKind };

/** Width ÷ height of each capture box (the files are prepared at the same ratio). */
export const MEDIA_RATIO: Record<MediaKind, number> = {
  web: 16 / 10,
  mobile: 6 / 13,
  photo: 4 / 3,
};

/** Lead captures: one wide (thumbnail, else the first web/photo shot) and the first phone shot. */
export function heroShots(p: Project): { wide?: Shot; phone?: Shot } {
  const wide: Shot | undefined = p.thumbnail
    ? { src: p.thumbnail, alt: p.title, kind: "web" }
    : p.screenshots.find((s) => s.kind !== "mobile");
  return { wide, phone: p.screenshots.find((s) => s.kind === "mobile") };
}

/**
 * Every screenshot, but only when there is more than the lead always shows
 * (a wide shot from `screenshots`, or a lone phone). A phone beside a wide
 * lead is hidden below 640px, so it does not count.
 */
export function galleryShots(p: Project): Shot[] {
  const { wide, phone } = heroShots(p);
  const alwaysShown = (wide && !p.thumbnail) || (!wide && phone) ? 1 : 0;
  return p.screenshots.length > alwaysShown ? p.screenshots : [];
}

/** Literal classes per row shape; fr = aspect ratio at one shared height (web 208 : phone 60 : photo 173). */
const ROW: Record<string, string> = {
  "web mobile mobile":
    "sm:grid-cols-[minmax(0,208fr)_minmax(0,60fr)_minmax(0,60fr)]",
  "web mobile": "sm:grid-cols-[minmax(0,208fr)_minmax(0,60fr)]",
  "web web": "sm:grid-cols-2",
  "web photo": "sm:grid-cols-[minmax(0,208fr)_minmax(0,173fr)]",
  "photo photo": "sm:grid-cols-2",
  "photo web": "sm:grid-cols-[minmax(0,173fr)_minmax(0,208fr)]",
  "photo mobile mobile":
    "sm:grid-cols-[minmax(0,173fr)_minmax(0,60fr)_minmax(0,60fr)]",
  "photo mobile": "sm:grid-cols-[minmax(0,173fr)_minmax(0,60fr)]",
  web: "sm:grid-cols-2", // a lone wide capture takes half the row, never the full width
  photo: "sm:grid-cols-2",
};
export const rowClass = (row: Shot[]) =>
  ROW[row.map((s) => s.kind).join(" ")] ?? "sm:grid-cols-4"; // phones: 4 per row

/** Each wide shot takes up to two phones beside it; leftover wides pair up; leftover phones go 4 per row. */
export function galleryRows(shots: Shot[]): Shot[][] {
  const wides = shots.filter((s) => s.kind !== "mobile");
  const phones = shots.filter((s) => s.kind === "mobile");
  const rows: Shot[][] = [];
  while (wides.length) {
    const w = wides.shift()!;
    if (phones.length) rows.push([w, ...phones.splice(0, 2)]);
    else if (wides.length) rows.push([w, wides.shift()!]);
    else rows.push([w]);
  }
  while (phones.length) rows.push(phones.splice(0, 4));
  return rows;
}

/** Rows shown up front (at most `limit` shots, unless everything fits) and the rest behind "more". */
export function foldRows(rows: Shot[][], limit = 4) {
  const total = rows.reduce((n, r) => n + r.length, 0);
  const shown: Shot[][] = [];
  const rest: Shot[][] = [];
  let count = 0;
  for (const row of rows) {
    if (!rest.length && (total <= limit || count + row.length <= limit)) {
      shown.push(row);
      count += row.length;
    } else rest.push(row);
  }
  return { shown, rest, hidden: total - count };
}
