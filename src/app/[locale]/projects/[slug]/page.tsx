import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandText } from "@/components/brand-text";
import { Icon, linkIcon } from "@/components/icons";
import { Capture, Gallery, MediaCaption } from "@/components/media";
import { LiveBadge } from "@/components/project-entry";
import { ExternalLink, RepoCard } from "@/components/repo";
import { ScreensLink } from "@/components/screens-link";
import { TechList } from "@/components/tech";
import { cx, LINK } from "@/components/ui";
import type { Project } from "@/content/schema";
import { getContent, getRelated } from "@/content/load";
import { hasLocale, locales, t, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import {
  fill,
  formatPercent,
  formatPeriod,
  formatYm,
  formatYmd,
} from "@/lib/format";
import { repoOf, snapshotDate } from "@/lib/github";
import { itemHref } from "@/lib/href";
import { galleryShots, heroShots } from "@/lib/media";
import { groupedStack, techUsage } from "@/lib/tech";

export const dynamicParams = false;

// `output: "export"` rejects an empty list, so emit one 404 placeholder until
// the first project is added.
const EMPTY_SLUG = "_none";

export function generateStaticParams() {
  const slugs = getContent().projects.map((p) => p.id);
  return locales.flatMap((locale) =>
    (slugs.length ? slugs : [EMPTY_SLUG]).map((slug) => ({ locale, slug })),
  );
}

const newestFirst = (projects: Project[]) =>
  [...projects].sort((a, b) => b.period.start.localeCompare(a.period.start));
const findProject = (slug: string) =>
  getContent().projects.find((p) => p.id === slug);

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = findProject(slug);
  if (!hasLocale(locale) || !project) return {};
  return {
    title: t(project.title, locale),
    description: t(project.tagline, locale),
  };
}

type Ctx = {
  p: Project;
  dict: Dictionary;
  locale: Locale;
  usage: Map<string, Project[]>;
};

const awardInOutcomes = (p: Project) =>
  p.outcomes.length
    ? getRelated(p.id).find((r) => r.kind === "award")
    : undefined;
const relatedRest = (p: Project) => {
  const aw = awardInOutcomes(p);
  return getRelated(p.id).filter((r) => r.id !== aw?.id);
};
const sharedProjects = ({ p, usage }: Ctx) =>
  [
    ...new Set(
      p.techStack.flatMap((g) => g.items.flatMap((n) => usage.get(n) ?? [])),
    ),
  ].filter((q) => q.id !== p.id);

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid max-w-160 gap-2">
      {items.map((x, i) => (
        <li key={i} className="flex gap-3 text-base leading-prose text-ink-2">
          <span
            aria-hidden="true"
            className="mt-3 size-1.5 shrink-0 rounded-full bg-edge"
          />
          <span className="min-w-0">{x}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Block registry: one default template; a block renders only when its data exists, and the TOC is
 * built from the rendered blocks. A future `layout` preset may only reorder these ids.
 */
const BLOCKS: {
  id: keyof Dictionary["project"]["sections"];
  has: (c: Ctx) => boolean;
  render: (c: Ctx) => React.ReactNode;
}[] = [
  {
    id: "summary",
    has: () => true,
    render: ({ p, locale }) => (
      <p className="max-w-160 text-lead leading-prose text-ink-2">
        {t(p.summary, locale)}
      </p>
    ),
  },
  {
    id: "contributions",
    has: () => true,
    render: ({ p, locale }) => (
      <Bullets items={p.contributions.map((c) => t(c, locale))} />
    ),
  },
  {
    id: "screens",
    has: ({ p }) => galleryShots(p).length > 0,
    render: ({ p, dict, locale }) => (
      <Gallery shots={galleryShots(p)} dict={dict} locale={locale} />
    ),
  },
  {
    id: "features",
    has: () => true,
    render: ({ p, locale }) => (
      <dl className="max-w-160 divide-y divide-line border-t border-line">
        {p.features.map((f, i) => (
          <div
            key={i}
            className="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
          >
            <dt className="text-base font-semibold text-ink">
              {t(f.title, locale)}
            </dt>
            <dd className="text-ui text-ink-2">{t(f.description, locale)}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "stack",
    has: (c) =>
      Object.keys(c.p.techNotes).length > 0 ||
      sharedProjects(c).length > 0 ||
      !!repoOf(c.p)?.data?.languages?.length,
    render: (c) => {
      const shared = sharedProjects(c);
      const langs = repoOf(c.p)?.data?.languages ?? [];
      const LANG = ["bg-lang-1", "bg-lang-2", "bg-lang-3", "bg-lang-4"];
      const notes = c.p.techNotes;
      const hasNotes = Object.keys(notes).length > 0;
      return (
        <>
          {hasNotes && (
            // where each tech was used: category | tech | use (stacks below 640px)
            <div className="max-w-200 divide-y divide-line border-t border-line">
              {groupedStack(c.p).map((g) => (
                <div
                  key={g.category}
                  className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                >
                  <p className="pt-0.5 text-sm text-muted">
                    {c.dict.skills.category[g.category]}
                  </p>
                  <dl className="grid gap-y-2">
                    {g.items.map((name) => (
                      <div
                        key={name}
                        className="grid gap-x-6 gap-y-0.5 sm:grid-cols-[11rem_minmax(0,1fr)]"
                      >
                        <dt translate="no" className="font-semibold text-ink">
                          {name}
                        </dt>
                        <dd className="text-ui leading-copy text-ink-2">
                          {notes[name] ? t(notes[name], c.locale) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
          {shared.length > 0 && (
            <p
              className={cx(
                "flex flex-wrap items-baseline gap-x-3 text-ui",
                hasNotes && "mt-6",
              )}
            >
              <span className="text-muted">{c.dict.project.shared}</span>
              {shared.map((q) => (
                <a
                  key={q.id}
                  href={`/${c.locale}/projects/${q.id}/`}
                  className={cx("font-medium", LINK)}
                >
                  {t(q.title, c.locale)}
                </a>
              ))}
            </p>
          )}
          {langs.length > 0 && (
            <div
              className={cx(
                "max-w-160",
                (hasNotes || shared.length > 0) && "mt-6",
              )}
            >
              <p className="text-ui font-semibold text-ink-2">
                <BrandText text={c.dict.project.langsTitle} />{" "}
                {snapshotDate && (
                  <span className="font-normal text-muted">
                    {fill(c.dict.project.langsNote, {
                      date: formatYmd(snapshotDate),
                    })}
                  </span>
                )}
              </p>
              <div
                aria-hidden="true"
                className="mt-2 flex h-2.5 gap-0.5 overflow-hidden rounded-full"
              >
                {langs.map((l, i) => (
                  <span
                    key={l.name}
                    className={i < 4 ? LANG[i] : "bg-line"}
                    style={{ flexGrow: l.pct }}
                  />
                ))}
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
                {langs.map((l, i) => (
                  <li key={l.name} className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={cx(
                        "size-2.5 rounded-full",
                        i < 4 ? LANG[i] : "bg-line",
                      )}
                    />
                    <span translate="no">{l.name}</span>
                    <span className="text-muted tabular-nums">
                      {formatPercent(l.pct, c.locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      );
    },
  },
  {
    id: "architecture",
    has: ({ p }) => !!p.architecture,
    render: ({ p, locale }) => (
      <p className="max-w-160 text-base leading-prose text-ink-2">
        {p.architecture && t(p.architecture, locale)}
      </p>
    ),
  },
  {
    id: "challenges",
    has: ({ p }) => p.challenges.length > 0,
    render: ({ p, dict, locale }) => (
      <ol className="max-w-184 divide-y divide-line border-t border-line">
        {p.challenges.map((c, i) => (
          <li key={i} className="grid gap-x-8 gap-y-3 py-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-ink-2">
                {dict.project.problem}
              </p>
              <p className="mt-1 text-base leading-prose">
                {t(c.problem, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-2">
                {dict.project.solution}
              </p>
              <p className="mt-1 text-base leading-prose">
                {t(c.solution, locale)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "outcomes",
    has: ({ p }) => p.outcomes.length > 0,
    render: ({ p, dict, locale }) => {
      const aw = awardInOutcomes(p);
      const award = aw && getContent().awards.find((a) => a.id === aw.id);
      return (
        <>
          <Bullets items={p.outcomes.map((o) => t(o, locale))} />
          {award && (
            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ui">
              <span className="text-muted">{dict.project.relatedAward}</span>
              <a
                href={itemHref(locale, award.id, "award")}
                className={cx("font-semibold", LINK)}
              >
                {t(award.title, locale)}{" "}
                <span className="text-award">{t(award.prize, locale)}</span>
              </a>
              <span className="text-sm text-muted tabular-nums">
                {t(award.organizer, locale)}&nbsp;&nbsp;{formatYm(award.date)}
              </span>
            </p>
          )}
        </>
      );
    },
  },
  {
    id: "learnings",
    has: ({ p }) => p.learnings.length > 0,
    render: ({ p, locale }) => (
      <Bullets items={p.learnings.map((l) => t(l, locale))} />
    ),
  },
  {
    id: "related",
    has: ({ p }) => relatedRest(p).length > 0,
    render: ({ p, dict, locale }) => (
      <ul className="max-w-184 divide-y divide-line border-t border-line">
        {relatedRest(p).map((r) => (
          <li key={r.id} className="py-3">
            <p className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="inline-flex h-6 shrink-0 items-center self-center rounded-tag border border-line px-1.5 text-sm font-medium text-ink-2">
                {dict.kind[r.kind]}
              </span>
              <a
                href={itemHref(locale, r.id, r.kind)}
                className={cx("font-semibold", LINK)}
              >
                {t(r.title, locale)}
                {r.prize && (
                  <span className="text-award"> {t(r.prize, locale)}</span>
                )}
              </a>
            </p>
          </li>
        ))}
      </ul>
    ),
  },
];

const CRUMB =
  "relative inline-flex min-h-6 items-center underline decoration-edge underline-offset-4 transition-colors after:absolute after:-inset-x-1.5 after:-inset-y-2.5 hover:text-primary hover:decoration-primary active:text-primary-700";

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const p = findProject(slug);
  if (!hasLocale(locale) || !p) notFound();
  const dict = getDictionary(locale);
  const { projects } = getContent();
  const ctx: Ctx = { p, dict, locale, usage: techUsage(projects) };
  const F = dict.project.facts;

  const live = p.deployment.status === "live";
  const facts: [string, React.ReactNode][] = [
    [
      F.period,
      <span key="p" className="tabular-nums">
        {formatPeriod(p.period, dict.common.present)}
      </span>,
    ],
    [F.kind, dict.category[p.category]],
  ];
  if (p.team.size)
    facts.push([
      F.team,
      p.team.size === 1
        ? dict.project.solo
        : fill(dict.project.teamSize, { n: p.team.size }),
    ]);
  facts.push(
    [F.role, t(p.team.role, locale)],
    [F.status, dict.projectStatus[p.status]],
  );
  facts.push([
    F.deploy,
    live ? (
      <span key="d">
        <LiveBadge label={dict.deploymentStatus.live} />
        {p.deployment.platform && (
          <span
            translate="no"
            className="mt-0.5 block text-sm font-normal text-muted"
          >
            {p.deployment.platform}
          </span>
        )}
      </span>
    ) : (
      dict.deploymentStatus[p.deployment.status]
    ),
  ]);

  const buttons = p.links.filter((l) => l.type !== "github");
  // the live URL gets its own button unless a demo or a link to the same URL (e.g. a store page) exists
  const liveUrl = p.deployment.url;
  if (
    live &&
    liveUrl &&
    !buttons.some((l) => l.type === "demo" || l.url === liveUrl)
  )
    buttons.unshift({ type: "demo", url: liveUrl });
  const { wide, phone } = heroShots(p);
  const lead = Boolean(wide || phone);
  const shots = galleryShots(p);
  const fullSize = { label: dict.project.fullSize, newTab: dict.common.newTab };
  const repo = repoOf(p);

  const blocks = BLOCKS.filter((b) => b.has(ctx));
  const order = newestFirst(projects);
  const i = order.findIndex((q) => q.id === p.id);
  const prev = order[i - 1];
  const next = order[i + 1];
  const pagerLink = (q: Project | undefined, label: string, right: boolean) => {
    const cls = cx(
      "group block py-6 active:bg-primary-50",
      right
        ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-6 sm:text-right"
        : "sm:pr-6",
    );
    if (!q)
      return (
        <a
          href={`/${locale}/projects/`}
          className={cx(cls, "flex items-center", right && "sm:justify-end")}
        >
          <span className="text-lg font-bold text-ink transition-colors group-hover:text-primary">
            {fill(dict.project.allProjects, { n: projects.length })}
          </span>
        </a>
      );
    return (
      <a href={`/${locale}/projects/${q.id}/`} className={cls}>
        <span className="block text-sm text-muted">{label}</span>
        <span className="mt-1 block text-lg font-bold text-ink transition-colors group-hover:text-primary">
          {t(q.title, locale)}
        </span>
        <span className="mt-0.5 block text-sm text-muted tabular-nums">
          {formatPeriod(q.period, dict.common.present)}
        </span>
      </a>
    );
  };

  return (
    <main id="main" data-layout="default">
      <div className="shell pt-6 pb-10 lg:pt-10 lg:pb-12">
        <nav aria-label={dict.project.crumbs}>
          <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <li>
              <a href={`/${locale}/`} className={CRUMB}>
                {dict.project.home}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href={`/${locale}/projects/`} className={CRUMB}>
                {dict.nav.projects}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span aria-current="page" className="text-ink-2">
                {t(p.title, locale)}
              </span>
            </li>
          </ol>
        </nav>
        <div className="mt-5 grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr]">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="text-title-sm font-bold text-ink sm:text-title">
              {t(p.title, locale)}
            </h1>
            <p className="mt-3 max-w-160 text-lead leading-copy text-ink-2">
              {t(p.tagline, locale)}
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:row-span-2 lg:row-start-2">
            <TechList project={p} dict={dict} locale={locale} link />
            {p.aiTools.length > 0 && (
              // plain text, not chips/nodes: AI assistants are not part of the tech stack
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm">
                <span className="text-muted">{dict.project.aiTools}</span>
                <span translate="no" className="text-ink-2">
                  {p.aiTools.join(", ")}
                </span>
              </p>
            )}
            {buttons.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {buttons.map((l) => (
                  <ExternalLink
                    key={l.url}
                    href={l.url}
                    newTab={dict.common.newTab}
                    className="inline-flex min-h-11 items-center gap-2 rounded-node border border-edge bg-white px-4 py-2 text-left text-ui font-semibold text-ink transition-colors hover:border-primary hover:bg-primary-50 active:bg-primary-100"
                  >
                    <Icon name={linkIcon(l.url, l.type)} />
                    {l.label ? t(l.label, locale) : dict.project.links[l.type]}
                  </ExternalLink>
                ))}
              </div>
            )}
            <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k} className="min-w-0 border-t border-line py-3 pr-4">
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="mt-1 text-ui font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {lead && (
            <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
              <div
                className={cx(
                  "grid gap-3",
                  wide &&
                    phone &&
                    "sm:grid-cols-[minmax(0,208fr)_minmax(0,60fr)]",
                )}
              >
                {wide && (
                  <Capture
                    src={wide.src}
                    alt={t(wide.alt, locale)}
                    kind={wide.kind}
                    load="high"
                    fullSize={fullSize}
                  />
                )}
                {phone && (
                  // beside a wide capture the phone drops out below 640px; alone it keeps a phone's width
                  <div className={wide ? "hidden sm:block" : "w-40 sm:w-48"}>
                    <Capture
                      src={phone.src}
                      alt={t(phone.alt, locale)}
                      kind="mobile"
                      load={wide ? undefined : "high"}
                      fullSize={fullSize}
                    />
                  </div>
                )}
              </div>
              {shots.length > 0 ? (
                <p className="mt-3">
                  <ScreensLink
                    className={cx(
                      "inline-flex min-h-6 items-center text-ui font-semibold",
                      LINK,
                    )}
                  >
                    {fill(dict.project.allScreens, { n: shots.length })}
                  </ScreensLink>
                </p>
              ) : (
                !p.thumbnail && (
                  <MediaCaption
                    shot={(wide ?? phone)!}
                    dict={dict}
                    locale={locale}
                    className="mt-2 block"
                  />
                )
              )}
            </div>
          )}
          {repo && (
            <div
              className={cx(
                "min-w-0 lg:col-span-5 lg:col-start-8",
                lead ? "lg:row-start-3" : "lg:row-span-3 lg:row-start-1",
              )}
            >
              <RepoCard
                project={p}
                dict={dict}
                locale={locale}
                newTab={dict.common.newTab}
              />
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="shell grid gap-x-12 pt-8 lg:grid-cols-12 lg:pt-10">
          <nav
            aria-labelledby="toc-title"
            className="mb-8 lg:col-span-3 lg:mb-0"
          >
            <div className="lg:sticky lg:top-24">
              <p id="toc-title" className="text-sm font-semibold text-ink-2">
                {dict.project.toc}
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">
                {blocks.map((b) => (
                  <li key={b.id}>
                    <a
                      href={`#${b.id}`}
                      data-toc={b.id}
                      className="relative block py-1.5 pl-3 text-ui text-muted transition-colors before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:bg-line hover:text-ink data-[current=true]:font-semibold data-[current=true]:text-ink data-[current=true]:before:bg-primary forced-colors:data-[current=true]:before:bg-[CanvasText]"
                    >
                      {dict.project.sections[b.id]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="min-w-0 lg:col-span-9">
            {blocks.map((b) => (
              <section
                key={b.id}
                id={b.id}
                data-block={b.id}
                aria-labelledby={`${b.id}-title`}
                className="border-t border-line py-8 first:border-t-0 first:pt-0 lg:py-10"
              >
                <h2
                  id={`${b.id}-title`}
                  className="mb-4 text-h2 font-bold text-ink"
                >
                  {dict.project.sections[b.id]}
                </h2>
                {b.render(ctx)}
              </section>
            ))}
          </div>
        </div>
      </div>
      <nav
        aria-label={dict.project.otherProjects}
        className="border-t border-line"
      >
        <div className="shell grid sm:grid-cols-2">
          {pagerLink(prev, dict.project.prev, false)}
          {pagerLink(next, dict.project.next, true)}
        </div>
      </nav>
    </main>
  );
}
