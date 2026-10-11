import type { Project, Skills } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/lib/format";
import { groupedStack, TIER, techSlug } from "@/lib/tech";
import { cx } from "./ui";

const NODE =
  "group inline-flex min-h-10 items-center gap-2 rounded-node border border-edge bg-white py-1 pl-3 pr-1.5 text-ui font-semibold text-ink transition-colors hover:border-primary hover:text-primary active:bg-primary-50";
const COUNT =
  "grid h-7 min-w-7 place-items-center rounded-tag bg-primary-50 px-1.5 text-sm font-semibold tabular-nums text-primary-700";

/** Static tech label in project entries; highlighted when it matches the active filter. */
export function TechChip({ name }: { name: string }) {
  return (
    <li
      data-node={techSlug(name)}
      data-match="false"
      translate="no"
      className="inline-flex min-h-7 items-center rounded-tag border border-line bg-white px-2 py-0.5 text-sm font-medium text-ink-2 data-[match=true]:border-primary data-[match=true]:bg-primary-100 data-[match=true]:text-primary-700"
    >
      {name}
    </li>
  );
}

/**
 * Interactive node: a real link with the number of projects that used the tech (data, not a rating).
 * `filter` nodes (stack map, list) carry data-tech for the in-place filter; detail-page nodes just link.
 */
export function TechNode({
  name,
  used,
  href,
  srText,
  filter,
}: {
  name: string;
  used: number;
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
            "aria-[current=true]:border-primary aria-[current=true]:bg-primary aria-[current=true]:text-white",
        )}
      >
        {name}
        <span className="sr-only">, {srText}</span>
        <span
          aria-hidden="true"
          className={cx(
            COUNT,
            filter &&
              "group-aria-[current=true]:bg-white group-aria-[current=true]:text-primary",
          )}
        >
          {used}
        </span>
      </a>
    </li>
  );
}

/** Category-grouped tech in the fixed TIER order. `link` → detail-page nodes to the home filter. */
export function TechList({
  project,
  dict,
  locale,
  usage,
  link = false,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  usage: Map<string, Project[]>;
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
                    used={usage.get(name)?.length ?? 0}
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
    category: Project["techStack"][number]["category"];
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
      names: g.names
        .filter((n) => unrecorded || usage.has(n))
        .sort(
          (a, b) =>
            (usage.get(b)?.length ?? 0) - (usage.get(a)?.length ?? 0) ||
            a.localeCompare(b),
        ),
    }))
    .filter((g) => g.names.length);
  return (
    <ul>
      {rows.map((g) => (
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
            {g.label ?? dict.skills.category[g.category]}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {g.names.map((name) => {
              const used = usage.get(name) ?? [];
              if (!used.length)
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
                  used={used.length}
                  href={
                    onHome
                      ? `/${locale}/projects/?tech=${slug}`
                      : `?tech=${slug}`
                  }
                  srText={fill(dict.skills.srCount, {
                    n: used.length,
                    names: used.map((p) => t(p.title, locale)).join(", "),
                  })}
                  filter
                />
              );
            })}
          </ul>
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
