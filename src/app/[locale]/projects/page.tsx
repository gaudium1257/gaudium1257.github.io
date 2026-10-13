import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandText } from "@/components/brand-text";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Empty } from "@/components/home-sections";
import { FilterBar } from "@/components/project-filter";
import { ProjectEntry } from "@/components/project-entry";
import { StackRows } from "@/components/tech";
import { getContent } from "@/content/load";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fill, formatYmd } from "@/lib/format";
import { snapshotDate } from "@/lib/github";
import { techUsage } from "@/lib/tech";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: getDictionary(locale).nav.projects };
}

export default async function ProjectsPage({
  params,
}: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { projects } = getContent();
  const usage = techUsage(projects);
  const byCat = new Map<string, Set<string>>();
  for (const p of projects)
    for (const g of p.techStack) {
      const set = byCat.get(g.category) ?? new Set<string>();
      g.items.forEach((n) => set.add(n));
      byCat.set(g.category, set);
    }
  const groups = [...byCat].map(([category, names]) => ({
    category:
      category as (typeof projects)[number]["techStack"][number]["category"],
    names: [...names],
  }));
  const list = projects; // the owner's order (content/project-order.json), same as the home page

  return (
    <main id="main">
      {/* page header and filter on a tinted band, like the home chapters and the detail header */}
      <div className="bg-surface">
        <div className="shell pt-8 pb-12 lg:pt-12 lg:pb-16">
          <Breadcrumbs
            label={dict.project.crumbs}
            items={[{ href: `/${locale}/`, label: dict.project.home }]}
            current={dict.nav.projects}
          />
          <h1 className="mt-5 flex items-baseline gap-3 text-title-sm font-extrabold text-ink sm:text-display-sm">
            {dict.nav.projects}
            {list.length > 0 && (
              <span className="text-lead leading-none font-medium text-muted tabular-nums">
                {fill(dict.common.count, { n: list.length })}
              </span>
            )}
          </h1>
          {list.length > 0 && (
            <section aria-labelledby="filter-title" className="mt-8">
              <h2
                id="filter-title"
                className="text-ui font-semibold text-ink-2"
              >
                {dict.projects.filterLabel}
              </h2>
              <div className="mt-3">
                <StackRows
                  groups={groups}
                  usage={usage}
                  dict={dict}
                  locale={locale}
                  unrecorded={false}
                  onHome={false}
                />
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="shell pb-16 lg:pb-20">
        {list.length ? (
          <>
            <FilterBar
              template={dict.projects.filterStatus}
              clearLabel={dict.projects.filterClear}
              clearedMessage={dict.projects.filterCleared}
              noneMessage={dict.projects.filterNone}
              noneLink={dict.projects.filterNoneLink}
            />
            <ol
              data-project-list
              className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
            >
              {list.map((p, i) => (
                <ProjectEntry
                  key={p.id}
                  project={p}
                  dict={dict}
                  locale={locale}
                  eager={i < 3 ? (i === 0 ? "high" : "eager") : undefined}
                  heading="h2"
                  onHome={false}
                />
              ))}
            </ol>
            {snapshotDate && (
              <p className="mt-12 border-t border-line pt-4 text-ui text-muted">
                <BrandText
                  text={fill(dict.projects.provenance, {
                    date: formatYmd(snapshotDate),
                  })}
                />
              </p>
            )}
          </>
        ) : (
          <Empty dict={dict} />
        )}
      </div>
    </main>
  );
}
