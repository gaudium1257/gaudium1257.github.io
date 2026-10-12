import type { Project, Skills } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/lib/format";
import { groupedStack, TIER, techSlug } from "@/lib/tech";
import { Icon } from "./icons";
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
 * Every category folds on its own (owner request 2026.10). The tech you build with — language,
 * frontend, mobile, backend, AI — starts open; the tech that supports it — DB, data, infra,
 * tooling, other — starts folded. Native <details>: works without JS, and the filter reopens a
 * category when `?tech=` points inside it.
 */
const SUPPORT: TechCategory[] = [
  "database",
  "data",
  "infra",
  "tooling",
  "other",
];

/** Foldable category rows of filter nodes (stack map on home, filter on the project list). */
export function StackRows({
  groups,
  usage,
  dict,
  locale,
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
  // when every row is a supporting one, nothing would be open: open them all
  const allSupport = rows.every((g) => SUPPORT.includes(g.category));
  return (
    <ul>
      {rows.map((g) => (
        <li
          key={g.category + (g.label ?? "")}
          className="border-t border-line first:border-t-0"
        >
          <details
            open={allSupport || !SUPPORT.includes(g.category)}
            className="group/cat"
          >
            <summary className="-mx-2 flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-node px-2 py-1.5 transition-colors hover:bg-white active:bg-primary-50 [&::-webkit-details-marker]:hidden">
              <h3 className="text-sm font-semibold text-ink-2 sm:text-ui">
                {g.label ?? dict.skills.category[g.category]}
              </h3>
              <span className="text-sm text-muted tabular-nums">
                <span aria-hidden="true">{g.names.length}</span>
                <span className="sr-only">
                  {fill(dict.skills.countSr, { n: g.names.length })}
                </span>
              </span>
              <Icon
                name="chevron"
                className="ml-auto text-muted group-open/cat:rotate-180"
              />
            </summary>
            <ul className="flex flex-wrap gap-2 pt-1 pb-3">
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
                      onHome
                        ? `/${locale}/projects/?tech=${slug}`
                        : `?tech=${slug}`
                    }
                    srText={dict.skills.linkSr}
                    filter
                  />
                );
              })}
            </ul>
          </details>
        </li>
      ))}
    </ul>
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
