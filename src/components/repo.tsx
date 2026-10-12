import type { Project } from "@/content/schema";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { fill, formatNumber, formatYm, formatYmd } from "@/lib/format";
import { repoOf, snapshotDate } from "@/lib/github";
import { BrandText } from "./brand-text";
import { Icon } from "./icons";
import { cx, LINK } from "./ui";

export const GitHubMark = () => <Icon name="github" />;

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
  locale,
  newTab,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
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
          <span className="sr-only">
            <BrandText text={dict.projects.starsSr} />
          </span>{" "}
          {formatNumber(d.stars, locale)}
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
  locale,
  newTab,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  newTab: string;
}) {
  const repo = repoOf(project);
  if (!repo) return null;
  const d = repo.data;
  const facts = [
    d?.stars !== undefined && [
      dict.project.stars,
      formatNumber(d.stars, locale),
    ],
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
        <BrandText text={dict.project.repoTitle} />
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
              <dd
                translate={k === dict.project.license ? "no" : undefined}
                className="mt-0.5 text-ui font-medium tabular-nums"
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {facts.length > 0 && snapshotDate && (
        <p className="mt-4 border-t border-line pt-3 text-ui text-muted">
          <BrandText
            text={fill(dict.project.repoNote, {
              date: formatYmd(snapshotDate),
            })}
          />
        </p>
      )}
    </section>
  );
}
