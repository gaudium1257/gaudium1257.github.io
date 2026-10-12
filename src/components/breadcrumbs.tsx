import { Fragment } from "react";

const CRUMB =
  "relative inline-flex min-h-6 items-center underline decoration-edge underline-offset-4 transition-colors after:absolute after:-inset-x-1.5 after:-inset-y-2.5 hover:text-primary hover:decoration-primary active:text-primary-700";

/** Page-header crumbs shared by the project list and detail pages (44px hit area per link). */
export function Breadcrumbs({
  label,
  items,
  current,
}: {
  label: string;
  items: { href: string; label: string }[];
  current: string;
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {items.map((it) => (
          <Fragment key={it.href}>
            <li>
              <a href={it.href} className={CRUMB}>
                {it.label}
              </a>
            </li>
            <li aria-hidden="true">/</li>
          </Fragment>
        ))}
        <li>
          <span aria-current="page" className="text-ink-2">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
