import type { Project, Skills } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { groupedStack, TIER, techSlug } from "@/lib/tech";
import { TechIcon } from "./tech-icons";
import { cx, LABEL_COLS } from "./ui";

const NODE =
  "inline-flex min-h-8 items-center gap-1.5 rounded-node border border-line bg-white px-2.5 py-1 text-sm font-medium text-ink-2 transition-colors hover:border-primary hover:text-primary active:bg-primary-50";

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
      className="inline-flex min-h-7 items-center gap-1.5 rounded-tag border border-line bg-white px-2 py-0.5 text-sm font-medium text-ink-2 data-[extra=true]:hidden data-[match=true]:border-primary data-[match=true]:bg-primary-100 data-[match=true]:text-primary-700 data-[extra=true]:data-[match=true]:inline-flex"
    >
      <TechIcon name={name} className="size-3.5" />
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
        <TechIcon name={name} className="size-3.5" />
        {name}
        <span className="sr-only">, {srText}</span>
      </a>
    </li>
  );
}

/**
 * Category-grouped tech in the fixed TIER order. `link` → detail-page nodes to the home filter.
 * `skip`: names left out (supporting libraries, listed on their own line by the caller).
 */
export function TechList({
  project,
  dict,
  locale,
  link = false,
  skip,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  link?: boolean;
  skip?: Set<string>;
}) {
  const groups = groupedStack(project)
    .map((g) => ({ ...g, items: g.items.filter((n) => !skip?.has(n)) }))
    .filter((g) => g.items.length);
  return (
    <dl aria-label={dict.skills.label} className="grid gap-y-2.5">
      {groups.map((g) => (
        // a spec sheet: one row per category, labels in a fixed column
        <div key={g.category} className={cx(LABEL_COLS, "items-start")}>
          <dt
            className={cx(
              "flex items-center text-sm text-muted",
              link ? "min-h-10" : "min-h-7",
            )}
          >
            {dict.skills.category[g.category]}
          </dt>
          <dd className="min-w-0">
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
 * The stack as a category table (owner's pick 2026.10, option B): one white panel, a row per
 * category — label column + nodes — split into two columns from 1024px. Nothing folds: the rows
 * are short enough to show at once, and every row lines up instead of cards of uneven height.
 */
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
  // reading order runs down the first column, then the second
  const half = Math.ceil(rows.length / 2);
  const cols = [rows.slice(0, half), rows.slice(half)].filter((c) => c.length);
  return (
    <div className="grid gap-x-10 rounded-card bg-white px-5 ring-1 ring-line sm:px-6 lg:grid-cols-2">
      {cols.map((col, i) => (
        <dl
          key={i}
          className={cx(
            "divide-y divide-line",
            i === 1 && "border-t border-line lg:border-t-0",
          )}
        >
          {col.map((g) => (
            <div
              key={g.category + (g.label ?? "")}
              className="grid gap-2 py-3.5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-start sm:gap-4"
            >
              <dt className="text-sm font-semibold text-ink sm:pt-1.5">
                {g.label ?? dict.skills.category[g.category]}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {g.names.map((name) => {
                    if (!usage.has(name))
                      return (
                        <li key={name}>
                          <span
                            translate="no"
                            className="inline-flex min-h-8 items-center rounded-node border border-dashed border-edge px-2.5 text-sm text-muted"
                          >
                            {name}
                            <span className="sr-only">
                              , {dict.skills.srNone}
                            </span>
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
              </dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
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
  // core tech only: supporting libraries live on the project pages
  const groups = skills.groups.map((g) => ({
    category: g.category,
    label: t(g.label, locale),
    names: g.items.filter((i) => i.home).map((i) => i.name),
  }));
  const hasUnrecorded = groups.some((g) => g.names.some((n) => !usage.has(n)));
  return (
    <section id="skills" aria-labelledby="skills-title" className="min-w-0">
      <h2
        id="skills-title"
        className="text-h2 font-bold text-ink sm:text-section"
      >
        {title}
      </h2>
      {groups.length ? (
        <>
          <p className="mt-3 max-w-152 text-base text-ink-2">
            {dict.skills.help}
          </p>
          <div className="mt-8">
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
        <p className="mt-4 border-t border-line pt-4 text-ui text-muted">
          {dict.common.empty}
        </p>
      )}
    </section>
  );
}
