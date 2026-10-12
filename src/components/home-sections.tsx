import Image from "next/image";
import type { Content } from "@/content/collect";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatPeriod, formatYm, formatYmd } from "@/lib/format";
import { snapshotDate } from "@/lib/github";
import { BrandText } from "./brand-text";
import { CopyButton } from "./copy-button";
import { FilterBar } from "./project-filter";
import { ProjectEntry, RelatedLinks } from "./project-entry";
import { Icon, type IconName } from "./icons";
import { ExternalLink, GitHubMark } from "./repo";
import { BUTTON, BUTTON_PRIMARY, cx, LINK } from "./ui";

type Props = { content: Content; dict: Dictionary; locale: Locale };

export function SectionHead({
  id,
  title,
  count,
  countLabel,
  action,
}: {
  id: string;
  title: string;
  count?: number;
  countLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2
        id={`${id}-title`}
        className="flex items-baseline gap-2.5 text-h2 font-bold text-ink sm:text-section"
      >
        {title}
        {count !== undefined && count > 0 && countLabel && (
          <span className="text-lead leading-none font-medium text-muted tabular-nums">
            {fill(countLabel, { n: count })}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}

export function Empty({ dict }: { dict: Dictionary }) {
  return (
    <p className="mt-6 border-t border-line pt-4 text-ui text-muted">
      {dict.common.empty}
    </p>
  );
}

const ghLabel = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Hero (owner's pick, option D): a light lilac panel holding the statement, intro and actions,
 * with a small framed portrait on the right from 1024px and three summary chips underneath.
 */
export function Identity({ content, dict, locale }: Props) {
  const p = content.profile;
  if (!p) return null;
  const other: Locale = locale === "ko" ? "en" : "ko";
  const { github } = p.connect;
  const career = content.education.career[0];
  const edu = content.education.items.find((e) => e.status === "enrolled");
  const chips: {
    icon: IconName;
    label: string;
    value: string;
    href?: string;
  }[] = [];
  if (edu)
    chips.push({
      icon: "school",
      label: dict.about.facts.affiliation,
      value:
        locale === "ko"
          ? [
              t(edu.school, locale),
              edu.major && t(edu.major, locale),
              dict.education.status.enrolled,
            ]
              .filter(Boolean)
              .join(" ")
          : `${[edu.major && t(edu.major, locale), t(edu.school, locale)].filter(Boolean).join(", ")} (${dict.education.status.enrolled.toLowerCase()})`,
    });
  if (career)
    chips.push({
      icon: "briefcase",
      label: dict.education.career,
      value: fill(dict.education.careerLine, {
        organization: t(career.organization, locale),
        role: t(career.role, locale),
      }),
      href: "#education",
    });
  if (content.projects.length)
    chips.push({
      icon: "folder",
      label: dict.nav.projects,
      value: fill(dict.common.count, { n: content.projects.length }),
      href: "#projects",
    });
  return (
    <section id="about" aria-labelledby="about-title" className="bg-white">
      <div className="shell py-8 lg:py-14">
        <div className="grid items-center gap-10 rounded-hero bg-primary-50 p-6 ring-1 ring-primary-100 sm:p-10 lg:grid-cols-12 lg:p-14">
          <div className="min-w-0 lg:col-span-8">
            <h1
              id="about-title"
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <span
                translate="no"
                className="text-h2 font-bold text-primary-700"
              >
                {t(p.name, locale)}
              </span>
              {p.name[other] !== p.name[locale] && (
                <span
                  lang={other}
                  translate="no"
                  className="text-lead font-medium text-muted"
                >
                  {p.name[other]}
                </span>
              )}
            </h1>
            <p className="mt-4 text-title-sm font-extrabold text-balance text-ink sm:text-display-sm">
              {t(p.headline, locale)}
            </p>
            <p className="mt-5 max-w-160 text-base leading-prose text-ink-2">
              {t(p.intro, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className={BUTTON_PRIMARY}>
                {dict.about.ctaProjects}
              </a>
              <a href="#connect" className={BUTTON}>
                {dict.about.ctaContact}
              </a>
              {github && (
                <ExternalLink
                  href={github}
                  newTab={dict.common.newTab}
                  className={BUTTON}
                >
                  <GitHubMark />
                  <span translate="no">GitHub</span>
                </ExternalLink>
              )}
            </div>
          </div>
          {p.avatar && (
            // the portrait stays small (owner: a large photo felt heavy); phones skip it
            <div className="hidden lg:col-span-4 lg:flex lg:justify-end">
              <div className="relative aspect-3/4 w-56 overflow-hidden rounded-card bg-white ring-4 ring-white">
                <Image
                  src={p.avatar}
                  alt={`${t(p.name, locale)} ${dict.about.photo}`}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="14rem"
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {chips.length > 0 && (
            <dl className="flex flex-wrap gap-2 text-sm lg:col-span-12">
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  className="relative inline-flex min-h-10 max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-primary-100"
                >
                  <Icon name={chip.icon} className="text-primary" />
                  <dt className="shrink-0 text-muted">{chip.label}</dt>
                  <dd className="min-w-0 font-medium text-ink">
                    {chip.href ? (
                      // the whole chip is the hit area, not just the 16px line of text
                      <a
                        href={chip.href}
                        className={cx(
                          "after:absolute after:inset-0 after:rounded-full",
                          LINK,
                        )}
                      >
                        {chip.value}
                      </a>
                    ) : (
                      chip.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

const HOME_LIMIT = 6; // two rows of three, in the owner's order (content/project-order.json); the rest live on the list page

export function ProjectsSection({ content, dict, locale }: Props) {
  const all = content.projects;
  const shown = all.slice(0, HOME_LIMIT);
  return (
    <section id="projects" aria-labelledby="projects-title" className="min-w-0">
      <SectionHead
        id="projects"
        title={dict.nav.projects}
        count={all.length}
        countLabel={dict.common.count}
        action={
          all.length > 0 && (
            <a
              href={`/${locale}/projects/`}
              className={cx(
                "inline-flex min-h-6 items-center text-ui font-semibold",
                LINK,
              )}
            >
              {all.length > HOME_LIMIT
                ? fill(dict.projects.viewAll, { n: all.length })
                : dict.projects.listLink}
            </a>
          )
        }
      />
      {shown.length ? (
        <>
          <FilterBar
            template={dict.projects.filterStatus}
            clearLabel={dict.projects.filterClear}
            clearedMessage={dict.projects.filterCleared}
            noneMessage={dict.projects.filterNone}
            noneLink={dict.projects.filterNoneLink}
            listHref={`/${locale}/projects/`}
          />
          <ol
            data-project-list
            className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
          >
            {shown.map((p) => (
              <ProjectEntry
                key={p.id}
                project={p}
                dict={dict}
                locale={locale}
                onHome
              />
            ))}
          </ol>
          {snapshotDate && (
            <p className="mt-4 border-t border-line pt-4 text-ui text-muted">
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
    </section>
  );
}

const ROW_DATE =
  "mt-0.5 text-sm text-muted tabular-nums sm:col-start-2 sm:row-start-1 sm:mt-0 sm:whitespace-nowrap";

function PlainRow({
  id,
  title,
  prize,
  sub,
  date,
  dict,
  locale,
}: {
  id: string;
  title: string;
  prize?: string;
  sub: string[];
  date: string;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    // below 640px the date goes under the title; above it sits on the title baseline
    <li
      id={id}
      className="grid gap-x-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
    >
      <h3 className="min-w-0 text-base font-semibold text-ink sm:col-start-1">
        {title}
        {prize && <span className="font-semibold text-award"> {prize}</span>}
      </h3>
      <p className={ROW_DATE}>{date}</p>
      <p className="mt-1 flex min-w-0 flex-wrap gap-x-3 text-sm text-muted sm:col-start-1">
        {sub.map((x) => (
          <span key={x}>{x}</span>
        ))}
      </p>
      <RelatedLinks
        id={id}
        dict={dict}
        locale={locale}
        onHome
        className="mt-1.5 sm:col-start-1"
      />
    </li>
  );
}

const byStartDesc = (a: string, b: string) => b.localeCompare(a);

export function ActivitiesSection({ content, dict, locale }: Props) {
  const items = [...content.activities].sort((a, b) =>
    byStartDesc(a.period.start, b.period.start),
  );
  return (
    <section
      id="activities"
      aria-labelledby="activities-title"
      className="min-w-0"
    >
      <SectionHead
        id="activities"
        title={dict.nav.activities}
        count={items.length}
        countLabel={dict.common.count}
      />
      {items.length ? (
        <ul className="mt-6 divide-y divide-line border-t border-line">
          {items.map((a) => (
            <PlainRow
              key={a.id}
              id={a.id}
              title={t(a.title, locale)}
              sub={[t(a.organization, locale), t(a.role, locale)]}
              date={formatPeriod(a.period, dict.common.present)}
              dict={dict}
              locale={locale}
            />
          ))}
        </ul>
      ) : (
        <Empty dict={dict} />
      )}
    </section>
  );
}

export function AwardsSection({ content, dict, locale }: Props) {
  const items = [...content.awards].sort((a, b) => byStartDesc(a.date, b.date));
  return (
    <section id="awards" aria-labelledby="awards-title" className="min-w-0">
      <SectionHead
        id="awards"
        title={dict.nav.awards}
        count={items.length}
        countLabel={dict.common.count}
      />
      {items.length ? (
        <ul className="mt-6 divide-y divide-line border-t border-line">
          {items.map((a) => (
            <PlainRow
              key={a.id}
              id={a.id}
              title={t(a.title, locale)}
              prize={t(a.prize, locale)}
              sub={[t(a.organizer, locale)]}
              date={formatYm(a.date)}
              dict={dict}
              locale={locale}
            />
          ))}
        </ul>
      ) : (
        <Empty dict={dict} />
      )}
    </section>
  );
}

function TimelineRow({
  id,
  title,
  sub,
  date,
}: {
  id: string;
  title: string;
  sub?: string;
  date?: string;
}) {
  return (
    <li
      id={id}
      className="grid gap-x-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
    >
      <h4 className="min-w-0 text-base font-semibold text-ink sm:col-start-1">
        {title}
      </h4>
      {date && <p className={ROW_DATE}>{date}</p>}
      {sub && <p className="mt-1 text-sm text-muted sm:col-start-1">{sub}</p>}
    </li>
  );
}

function TimelineGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-ui font-semibold text-primary">{title}</h3>
      <ul className="mt-3 divide-y divide-line border-t border-line">
        {children}
      </ul>
    </div>
  );
}

export function EducationSection({ content, dict, locale }: Props) {
  const { items, career } = content.education;
  const eduDate = (e: (typeof items)[number]) => {
    const status = e.status && dict.education.status[e.status];
    if (e.period) return formatPeriod(e.period, status ?? dict.common.present);
    return status;
  };
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="min-w-0"
    >
      <SectionHead id="education" title={dict.nav.education} />
      {items.length || career.length ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
          {items.length > 0 && (
            <TimelineGroup title={dict.education.school}>
              {items.map((e) => (
                <TimelineRow
                  key={e.id}
                  id={e.id}
                  title={t(e.school, locale)}
                  sub={
                    [e.major, e.degree]
                      .filter((x) => !!x)
                      .map((x) => t(x!, locale))
                      .join(" ") || undefined
                  }
                  date={eduDate(e)}
                />
              ))}
            </TimelineGroup>
          )}
          {career.length > 0 && (
            <TimelineGroup title={dict.education.career}>
              {career.map((c) => (
                <TimelineRow
                  key={c.id}
                  id={c.id}
                  title={t(c.organization, locale)}
                  sub={t(c.role, locale)}
                  date={c.period && formatPeriod(c.period, dict.common.present)}
                />
              ))}
            </TimelineGroup>
          )}
        </div>
      ) : (
        <Empty dict={dict} />
      )}
    </section>
  );
}

/**
 * Closing band on a light lilac field: one tile per channel (email first), each with its icon,
 * name, value and — for email and a Discord username — a copy button.
 */
export function ContactSection({ content, dict }: Props) {
  const c = content.profile?.connect ?? {};
  const tiles: {
    label: string;
    icon: IconName;
    brand: boolean;
    node: React.ReactNode;
    button?: React.ReactNode;
  }[] = [];
  if (c.email)
    tiles.push({
      label: dict.about.facts.email,
      icon: "mail",
      brand: false,
      node: (
        <a
          href={`mailto:${c.email}`}
          translate="no"
          className={cx("min-w-0", LINK)}
        >
          <span data-copy-value="email" className="wrap-anywhere">
            {c.email}
          </span>
        </a>
      ),
      button: (
        <CopyButton
          value={c.email}
          valueId="email"
          text={dict.copy}
          doneMessage={dict.copy.emailDone}
          sr={dict.copy.emailSr}
        />
      ),
    });
  if (c.github)
    tiles.push({
      label: "GitHub",
      icon: "github",
      brand: true,
      node: (
        <ExternalLink
          href={c.github}
          newTab={dict.common.newTab}
          className={cx("min-w-0 wrap-anywhere", LINK)}
        >
          <span translate="no">{ghLabel(c.github)}</span>
        </ExternalLink>
      ),
    });
  if (c.instagram)
    tiles.push({
      label: "Instagram",
      icon: "instagram",
      brand: true,
      node: (
        <ExternalLink
          href={c.instagram}
          newTab={dict.common.newTab}
          className={cx("min-w-0 wrap-anywhere", LINK)}
        >
          <span translate="no">
            @
            {c.instagram
              .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
              .replace(/\/$/, "")}
          </span>
        </ExternalLink>
      ),
    });
  if (c.discord)
    tiles.push(
      /^https?:/.test(c.discord)
        ? {
            label: "Discord",
            icon: "discord",
            brand: true,
            node: (
              <ExternalLink
                href={c.discord}
                newTab={dict.common.newTab}
                className={cx("min-w-0 wrap-anywhere", LINK)}
              >
                <span translate="no">{ghLabel(c.discord)}</span>
              </ExternalLink>
            ),
          }
        : {
            label: "Discord",
            icon: "discord",
            brand: true,
            node: (
              <span
                translate="no"
                data-copy-value="discord"
                className="min-w-0 wrap-anywhere text-ink"
              >
                {c.discord}
              </span>
            ),
            button: (
              <CopyButton
                value={c.discord}
                valueId="discord"
                text={dict.copy}
                doneMessage={dict.copy.discordDone}
                sr={dict.copy.discordSr}
              />
            ),
          },
    );
  return (
    <section
      id="connect"
      aria-labelledby="connect-title"
      className="bg-primary-50"
    >
      <div className="shell py-16 lg:py-24">
        <h2
          id="connect-title"
          className="text-display-sm font-extrabold text-ink"
        >
          {dict.nav.connect}
        </h2>
        {tiles.length ? (
          <>
            <p className="mt-4 max-w-136 text-base leading-prose text-ink-2 sm:text-lead">
              {dict.about.contactLead}
            </p>
            <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tiles.map((tile) => (
                <div
                  key={tile.label}
                  className="flex min-w-0 flex-col gap-3 rounded-card bg-white p-5 ring-1 ring-primary-100"
                >
                  <dt
                    translate={tile.brand ? "no" : undefined}
                    className="flex items-center gap-2 text-sm font-semibold text-muted"
                  >
                    <Icon name={tile.icon} className="size-5 text-primary" />
                    {tile.label}
                  </dt>
                  {/* the dd keeps CopyButton's same-row lookup and its hint line working */}
                  <dd className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-ui font-semibold">
                    {tile.node}
                    {tile.button}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="mt-6 text-ui text-muted">{dict.common.empty}</p>
        )}
      </div>
    </section>
  );
}
