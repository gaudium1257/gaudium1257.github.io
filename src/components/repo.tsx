import type { Project } from "@/content/schema";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatYm } from "@/lib/format";
import { repoOf, snapshotDate } from "@/lib/github";
import { cx, LINK } from "./ui";

export function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0 fill-current"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function ExternalLink({
  href,
  children,
  className,
  newTab,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> {newTab}</span>
    </a>
  );
}

/** One line per project entry. Only the link sits above the card's stretched link. */
export function RepoLine({
  project,
  dict,
  newTab,
}: {
  project: Project;
  dict: Dictionary;
  newTab: string;
}) {
  const repo = repoOf(project);
  if (!repo) return null;
  const d = repo.data;
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      <ExternalLink
        href={repo.url}
        newTab={newTab}
        className={cx(
          "relative z-10 inline-flex min-h-6 items-center gap-1.5 font-medium wrap-anywhere",
          LINK,
        )}
      >
        <GitHubMark />
        <span translate="no">{repo.slug}</span>
      </ExternalLink>
      {d?.stars !== undefined && (
        <span className="tabular-nums">
          <span aria-hidden="true">★</span>
          <span className="sr-only">{dict.projects.starsSr}</span> {d.stars}
        </span>
      )}
      {d?.lastCommit && (
        <span className="tabular-nums">
          {dict.projects.lastCommit} {formatYm(d.lastCommit)}
        </span>
      )}
      {d?.archived && <span>{dict.project.archived}</span>}
    </p>
  );
}

export function RepoCard({
  project,
  dict,
  newTab,
}: {
  project: Project;
  dict: Dictionary;
  newTab: string;
}) {
  const repo = repoOf(project);
  if (!repo) return null;
  const d = repo.data;
  const facts = [
    d?.stars !== undefined && [dict.project.stars, String(d.stars)],
    d?.lastCommit && [dict.projects.lastCommit, formatYm(d.lastCommit)],
    d?.license && [dict.project.license, d.license],
  ].filter(Boolean) as [string, string][];
  return (
    <section
      aria-labelledby="repo-title"
      className="rounded-panel bg-surface p-5"
    >
      <h2
        id="repo-title"
        className="flex items-center gap-2 text-ui font-semibold text-ink-2"
      >
        <GitHubMark />
        {dict.project.repoTitle}
      </h2>
      <p className="mt-2 text-lead font-semibold">
        <ExternalLink
          href={repo.url}
          newTab={newTab}
          className={cx("wrap-anywhere", LINK)}
        >
          <span translate="no">{repo.slug}</span>
        </ExternalLink>
        {d?.archived && (
          <span className="ml-2 text-sm font-medium text-muted">
            {dict.project.archived}
          </span>
        )}
      </p>
      {facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="mt-0.5 text-ui font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {facts.length > 0 && snapshotDate && (
        <p className="mt-4 border-t border-line pt-3 text-ui text-muted">
          {fill(dict.project.repoNote, {
            date: snapshotDate.replaceAll("-", "."),
          })}
        </p>
      )}
    </section>
  );
}
