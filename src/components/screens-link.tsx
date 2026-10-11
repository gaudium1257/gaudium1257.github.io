"use client";

import type { ReactNode } from "react";

/** "See all screens": a plain #screens link that also unfolds the gallery's "more" panel. */
export function ScreensLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#screens"
      className={className}
      onClick={() =>
        document
          .querySelector<HTMLDetailsElement>("#screens details")
          ?.setAttribute("open", "")
      }
    >
      {children}
    </a>
  );
}
