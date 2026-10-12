"use client";

import { useEffect, type ReactNode } from "react";

const openScreens = () =>
  document
    .querySelector<HTMLDetailsElement>("#screens details")
    ?.setAttribute("open", "");

/**
 * "See all screens": a plain #screens link that also unfolds the gallery's "more" panel.
 * A pasted or shared `#screens` URL reaches the same state (on load and on hashchange).
 */
export function ScreensLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const sync = () => {
      if (location.hash === "#screens") openScreens();
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return (
    <a href="#screens" className={className} onClick={openScreens}>
      {children}
    </a>
  );
}
