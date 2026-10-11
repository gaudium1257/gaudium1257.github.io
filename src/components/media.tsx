import Image from "next/image";
import { cx } from "./ui";

/**
 * A project capture in a fixed 16:10 box (never cropped: object-contain on the surface tint).
 * `fullSize` (detail pages) wraps it in a link to the original file.
 */
export function Capture({
  src,
  alt,
  fullSize,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  fullSize?: { label: string; newTab: string };
  priority?: boolean;
  className?: string;
}) {
  const img = (
    <span
      className={cx(
        "relative block aspect-16/10 overflow-hidden rounded-node bg-surface ring-1 ring-line ring-inset",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        priority={priority}
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
      className="block cursor-zoom-in rounded-node"
    >
      {img}
      <span className="sr-only">
        {fullSize.label} {fullSize.newTab}
      </span>
    </a>
  );
}
