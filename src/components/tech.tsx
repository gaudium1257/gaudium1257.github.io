import type { Project, Skills } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/lib/format";
import { groupedStack, TIER, techSlug } from "@/lib/tech";
import { cx } from "./ui";

const NODE =
  "inline-flex min-h-10 items-center rounded-node border border-edge bg-white px-3 py-1 text-ui font-semibold text-ink transition-colors hover:border-primary hover:text-primary active:bg-primary-50";

/** Static tech label in project entries; highlighted when it matches the active filter. */
export function TechChip({
  name,
  extra = false,
}: {
  name: string;
  /** past the card's visible chips: hidden unless the active filter matches it */
  extra?: boolean;
}) {
  return (
    <li
      data-node={techSlug(name)}
      data-match="false"
      data-extra={extra ? "true" : undefined}
      translate="no"
      className="inline-flex min-h-7 items-center rounded-tag border border-line bg-white px-2 py-0.5 text-sm font-medium text-ink-2 data-[extra=true]:hidden data-[match=true]:border-primary data-[match=true]:bg-primary-100 data-[match=true]:text-primary-700 data-[extra=true]:data-[match=true]:inline-flex"
    >
      {name}
    </li>
  );
}

/**
 * Interactive node: a real link to the projects that used the tech.
 * `filter` nodes (stack map, list) carry data-tech for the in-place filter; detail-page nodes just link.
 */
export function TechNode({
  name,
  href,
  srText,
  filter,
}: {
  name: string;
  href: string;
  srText: string;
  filter: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        translate="no"
        {...(filter ? { "data-tech": techSlug(name), "data-label": name } : {})}
        className={cx(
          NODE,
          filter &&
            // the selected node keeps white text on hover and darkens on hover/press
            "aria-[current=true]:border-primary aria-[current=true]:bg-primary aria-[current=true]:text-white aria-[current=true]:hover:border-primary-700 aria-[current=true]:hover:bg-primary-700 aria-[current=true]:hover:text-white aria-[current=true]:active:bg-primary-700",
        )}
      >
        {name}
        <span className="sr-only">, {srText}</span>
      </a>
    </li>
  );
}

/** Category-grouped tech in the fixed TIER order. `link` → detail-page nodes to the home filter. */
export function TechList({
  project,
  dict,
  locale,
  link = false,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  link?: boolean;
}) {
  return (
    <dl
      aria-label={dict.skills.label}
      className="flex flex-wrap gap-x-5 gap-y-2"
    >
      {groupedStack(project).map((g) => (
        <div key={g.category} className="flex min-w-0 items-center gap-2">
          <dt className="shrink-0 text-sm text-muted">
            {dict.skills.category[g.category]}
          </dt>
          <dd>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((name) =>
                link ? (
                  <TechNode
                    key={name}
                    name={name}
                    href={`/${locale}/?tech=${techSlug(name)}#projects`}
                    srText={dict.skills.linkSr}
                    filter={false}
                  />
                ) : (
                  <TechChip key={name} name={name} />
                ),
              )}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}

type TechCategory = Project["techStack"][number]["category"];

/**
 * Folding rule (owner request 2026.10): the tech you build with — language, frontend, mobile,
 * backend, AI — stays open; the tech that supports it — DB, data, infra, tooling, other — folds.
 */
const SUPPORT: TechCategory[] = [
  "database",
  "data",
  "infra",
  "tooling",
  "other",
];

/** Rows of filter nodes by category (stack map on home, filter on the project list). */
export function StackRows({
  groups,
  usage,
  dict,
  locale,
  narrow = false,
  unrecorded = true,
  onHome,
}: {
  groups: {
    category: TechCategory;
    label?: string;
    names: string[];
  }[];
  usage: Map<string, Project[]>;
  dict: Dictionary;
  locale: Locale;
  narrow?: boolean;
  unrecorded?: boolean;
  onHome: boolean;
}) {
  const rows = [...groups]
    .sort((a, b) => TIER.indexOf(a.category) - TIER.indexOf(b.category))
    .map((g) => ({
      ...g,
      names: g.names.filter((n) => unrecorded || usage.has(n)),
    }))
    .filter((g) => g.names.length);
  const main = rows.filter((g) => !SUPPORT.includes(g.category));
  const support = rows.filter((g) => SUPPORT.includes(g.category));
  // nothing to fold into when every row is a supporting one
  const open = main.length ? main : support;
  const folded = main.length ? support : [];
  const label = (g: (typeof rows)[number]) =>
    g.label ?? dict.skills.category[g.category];
  const row = (g: (typeof rows)[number]) => (
    <li
      key={g.category + (g.label ?? "")}
      className={cx(
        "grid gap-x-4 gap-y-2 border-t border-line py-3 first:border-t-0 sm:grid-cols-[6rem_minmax(0,1fr)]",
        narrow && "lg:grid-cols-1",
      )}
    >
      <h3
        className={cx(
          "text-sm font-semibold text-ink-2 sm:pt-2.5 sm:text-ui",
          narrow && "lg:pt-0",
        )}
      >
        {label(g)}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {g.names.map((name) => {
          if (!usage.has(name))
            return (
              <li key={name}>
                <span
                  translate="no"
                  className="inline-flex min-h-10 items-center rounded-node border border-dashed border-edge px-3 py-1 text-ui text-muted"
                >
                  {name}
                  <span className="sr-only">, {dict.skills.srNone}</span>
                </span>
              </li>
            );
          const slug = techSlug(name);
          return (
            <TechNode
              key={name}
              name={name}
              href={
                onHome ? `/${locale}/projects/?tech=${slug}` : `?tech=${slug}`
              }
              srText={dict.skills.linkSr}
              filter
            />
          );
        })}
      </ul>
    </li>
  );
  const hidden = folded.reduce((n, g) => n + g.names.length, 0);
  return (
    <>
      <ul>{open.map(row)}</ul>
      {folded.length > 0 && (
        // native disclosure: works without JS; the filter opens it when ?tech= points inside
        <details className="group/fold border-t border-line">
          <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-0.5 py-2 text-ui font-semibold text-primary hover:text-primary-700 active:text-ink [&::-webkit-details-marker]:hidden">
            <span className="group-open/fold:hidden">
              {fill(dict.skills.more, { n: hidden })}
            </span>
            <span className="hidden group-open/fold:inline">
              {dict.skills.less}
            </span>
            <span className="text-sm font-normal text-muted">
              {folded.map(label).join(" · ")}
            </span>
          </summary>
          <ul className="border-t border-line">{folded.map(row)}</ul>
        </details>
      )}
    </>
  );
}

export function StackMap({
  skills,
  usage,
  dict,
  locale,
  title,
}: {
  skills: Skills;
  usage: Map<string, Project[]>;
  dict: Dictionary;
  locale: Locale;
  title: string;
}) {
  const groups = skills.groups.map((g) => ({
    category: g.category,
    label: t(g.label, locale),
    names: g.items.map((i) => i.name),
  }));
  const hasUnrecorded = groups.some((g) => g.names.some((n) => !usage.has(n)));
  return (
    <section id="skills" aria-labelledby="skills-title" className="min-w-0">
      <h2 id="skills-title" className="text-h2 font-bold text-ink">
        {title}
      </h2>
      {groups.length ? (
        <>
          <p className="mt-2 max-w-152 text-ui text-muted">
            {dict.skills.help}
          </p>
          <div className="mt-4 rounded-panel bg-surface px-3 py-1 sm:px-5">
            <StackRows
              groups={groups}
              usage={usage}
              dict={dict}
              locale={locale}
              narrow
              onHome
            />
          </div>
          {hasUnrecorded && (
            <p className="mt-2 flex items-center gap-2 text-ui text-muted">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-6 shrink-0 rounded-tag border border-dashed border-edge"
              />
              {dict.skills.unrecorded}
            </p>
          )}
        </>
      ) : (
        <p className="mt-3 border-t border-line pt-4 text-ui text-muted">
          {dict.common.empty}
        </p>
      )}
    </section>
  );
}
