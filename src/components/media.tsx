import Image from "next/image";
import type { MediaKind } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { galleryRows, rowClass, type Shot } from "@/lib/media";
import { cx } from "./ui";

/**
 * A project's square app icon / logo beside its title. Decorative (alt=""): the title next to it
 * already names the project. Callers give the size and the radius (one radius utility per element).
 */
export function ProjectLogo({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={512}
      height={512}
      className={cx(
        "shrink-0 bg-white object-cover ring-1 ring-line",
        className,
      )}
    />
  );
}

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
  radius = "rounded-node",
  className,
}: {
  src: string;
  alt: string;
  kind?: MediaKind;
  fullSize?: { label: string; newTab: string };
  /** above the fold: "eager" loads now, "high" also raises fetch priority (one per page) */
  load?: "eager" | "high";
  /** corner radius of the box (one radius utility per element, so callers pick it here) */
  radius?: "rounded-node" | "rounded-card";
  className?: string;
}) {
  const img = (
    <span
      className={cx(
        "relative block overflow-hidden bg-surface ring-1 ring-line ring-inset",
        radius,
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
          <figcaption className="mt-2 text-sm leading-copy">
            <MediaCaption shot={s} dict={dict} locale={locale} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
  // every screen up front (owner's call): the gallery is the evidence, so nothing hides behind "more"
  return <div className="grid gap-6">{galleryRows(shots).map(row)}</div>;
}
