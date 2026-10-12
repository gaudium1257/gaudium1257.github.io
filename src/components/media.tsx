import Image from "next/image";
import type { MediaKind } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/lib/format";
import { foldRows, galleryRows, rowClass, type Shot } from "@/lib/media";
import { cx } from "./ui";

const BOX: Record<MediaKind, string> = {
  web: "aspect-16/10",
  mobile: "aspect-6/13",
  photo: "aspect-4/3",
};

/**
 * A project capture in a fixed box per kind (web 16:10 · phone 6:13 · photo 4:3;
 * never cropped: object-contain on the surface tint).
 * `fullSize` (detail pages) wraps it in a link to the original file.
 */
export function Capture({
  src,
  alt,
  kind = "web",
  fullSize,
  load,
  className,
}: {
  src: string;
  alt: string;
  kind?: MediaKind;
  fullSize?: { label: string; newTab: string };
  /** above the fold: "eager" loads now, "high" also raises fetch priority (one per page) */
  load?: "eager" | "high";
  className?: string;
}) {
  const img = (
    <span
      className={cx(
        "relative block overflow-hidden rounded-node bg-surface ring-1 ring-line ring-inset",
        fullSize &&
          "transition-colors group-hover/cap:ring-edge group-active/cap:ring-primary",
        BOX[kind],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={
          kind === "mobile"
            ? "(min-width: 640px) 12rem, 50vw"
            : "(min-width: 1024px) 40vw, 100vw"
        }
        loading={load ? "eager" : undefined}
        fetchPriority={load === "high" ? "high" : undefined}
        className="object-contain"
      />
    </span>
  );
  if (!fullSize) return img;
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="group/cap block cursor-zoom-in rounded-node"
    >
      {img}
      <span className="sr-only">
        {fullSize.label} {fullSize.newTab}
      </span>
    </a>
  );
}

/** Kind label + description under a capture. */
export function MediaCaption({
  shot,
  dict,
  locale,
  className,
}: {
  shot: Shot;
  dict: Dictionary;
  locale: Locale;
  className?: string;
}) {
  return (
    <span className={cx("text-sm text-muted", className)}>
      <span className="font-medium text-ink-2">
        {dict.project.mediaKind[shot.kind]}
      </span>{" "}
      {t(shot.alt, locale)}
    </span>
  );
}

/** Detail "화면": rows shaped by kind, the first 4 shots up front, the rest behind "more". */
export function Gallery({
  shots,
  dict,
  locale,
}: {
  shots: Shot[];
  dict: Dictionary;
  locale: Locale;
}) {
  const { shown, rest, hidden } = foldRows(galleryRows(shots));
  const fullSize = { label: dict.project.fullSize, newTab: dict.common.newTab };
  const row = (r: Shot[]) => (
    <div
      key={r[0].src}
      className={cx("grid grid-cols-2 items-start gap-3", rowClass(r))}
    >
      {r.map((s) => (
        <figure
          key={s.src}
          className={cx(
            "min-w-0",
            s.kind !== "mobile" && "col-span-2 sm:col-span-1",
          )}
        >
          <Capture
            src={s.src}
            alt={t(s.alt, locale)}
            kind={s.kind}
            fullSize={fullSize}
          />
          <figcaption className="mt-2 leading-snug">
            <MediaCaption shot={s} dict={dict} locale={locale} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
  return (
    <div className="grid gap-6">
      {shown.map(row)}
      {rest.length > 0 && (
        <details className="group/more">
          <summary className="inline-flex h-11 cursor-pointer list-none items-center gap-2 rounded-node border border-line px-4 text-ui font-semibold text-ink transition-colors hover:border-edge active:bg-primary-50 [&::-webkit-details-marker]:hidden">
            {fill(dict.project.moreScreens, { n: hidden })}
          </summary>
          <div className="mt-6 grid gap-6">{rest.map(row)}</div>
        </details>
      )}
    </div>
  );
}
