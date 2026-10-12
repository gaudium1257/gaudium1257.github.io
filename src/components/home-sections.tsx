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
import { Icon } from "./icons";
import { ExternalLink, GitHubMark } from "./repo";
import { cx, LABEL_COLS, LINK } from "./ui";

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
        className="flex items-baseline gap-2.5 text-h2 font-semibold text-ink"
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
    <p className="mt-4 border-t border-line pt-4 text-ui text-muted">
      {dict.common.empty}
    </p>
  );
}

function FactRow({
  label,
  children,
  last,
  brand,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
  /** label is a brand name (GitHub…): keep auto-translate off it */
  brand?: boolean;
}) {
  return (
    <div
      className={cx(
        LABEL_COLS,
        "items-baseline border-t border-line py-2.5",
        last && "border-b",
      )}
    >
      <dt translate={brand ? "no" : undefined} className="text-sm text-muted">
        {label}
      </dt>
      <dd className="min-w-0 text-ui font-medium text-ink">{children}</dd>
    </div>
  );
}

const ghLabel = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function Identity({ content, dict, locale }: Props) {
  const p = content.profile;
  if (!p) return null;
  const other: Locale = locale === "ko" ? "en" : "ko";
  const { email, github } = p.connect;
  const career = content.education.career[0];
  const intro = t(p.intro, locale);
  const facts: { label: string; node: React.ReactNode; brand?: boolean }[] = [];
  const edu = content.education.items.find((e) => e.status === "enrolled");
  if (edu)
    facts.push({
      label: dict.about.facts.affiliation,
      node:
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
    facts.push({
      label: dict.education.career,
      node: (
        <a href="#education" className={LINK}>
          {fill(dict.education.careerLine, {
            organization: t(career.organization, locale),
            role: t(career.role, locale),
          })}
        </a>
      ),
    });
  if (email)
    facts.push({
      label: dict.about.facts.email,
      node: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={`mailto:${email}`}
            translate="no"
            className={cx(
              "inline-flex min-w-0 items-baseline gap-1.5 [&>svg]:self-center",
              LINK,
            )}
          >
            <Icon name="mail" />
            <span data-copy-value="email" className="min-w-0 wrap-anywhere">
              {email}
            </span>
          </a>
          <CopyButton
            value={email}
            valueId="email"
            text={dict.copy}
            doneMessage={dict.copy.emailDone}
            sr={dict.copy.emailSr}
          />
        </span>
      ),
    });
  if (github)
    facts.push({
      label: dict.about.facts.github,
      brand: true,
      node: (
        <ExternalLink
          href={github}
          newTab={dict.common.newTab}
          className={cx(
            "inline-flex items-baseline gap-1.5 [&>svg]:self-center",
            LINK,
          )}
        >
          <GitHubMark />
          <span translate="no">{ghLabel(github)}</span>
        </ExternalLink>
      ),
    });
  return (
    <section id="about" aria-labelledby="about-title" className="min-w-0">
      <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[8rem_minmax(0,1fr)] xl:grid-cols-[12.5rem_minmax(0,1fr)]">
        <div className="relative aspect-3/4 self-start overflow-hidden rounded-node bg-surface ring-1 ring-line ring-inset sm:row-span-2">
          {p.avatar && (
            <Image
              src={p.avatar}
              alt={`${t(p.name, locale)} ${dict.about.photo}`}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="200px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 self-center sm:self-start">
          <h1
            id="about-title"
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span
              translate="no"
              className="text-name-sm font-bold text-ink sm:text-name"
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
          <p className="mt-2 text-ui font-medium text-pretty text-ink sm:text-lead">
            {t(p.headline, locale)}
          </p>
          <p className="mt-4 hidden max-w-136 text-base leading-prose text-ink-2 sm:block">
            {intro}
          </p>
        </div>
        <p className="col-span-2 text-base leading-prose text-ink-2 sm:hidden">
          {intro}
        </p>
        {facts.length > 0 && (
          <dl className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
            {facts.map((f, i) => (
              <FactRow
                key={f.label}
                label={f.label}
                brand={f.brand}
                last={i === facts.length - 1}
              >
                {f.node}
              </FactRow>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

const HOME_LIMIT = 6; // two rows of three; featured first, the rest live on the list page

export function ProjectsSection({ content, dict, locale }: Props) {
  const all = [...content.projects].sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1,
  );
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
            className="mt-4 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
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
        <ul className="mt-4 divide-y divide-line border-t border-line">
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
        <ul className="mt-4 divide-y divide-line border-t border-line">
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
      <h3 className="pt-3 text-sm font-semibold text-muted">{title}</h3>
      <ul className="divide-y divide-line">{children}</ul>
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
        <div className="mt-4 divide-y divide-line border-t border-line">
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

export function ContactSection({ content, dict }: Props) {
  const c = content.profile?.connect ?? {};
  // the other labels are service names, kept away from auto-translate
  const BRANDS = ["GitHub", "Instagram", "Discord"];
  // the same label/value row as the intro facts; Copy sits beside its value
  const row = (
    label: string,
    value: React.ReactNode,
    button?: React.ReactNode,
    brand = BRANDS.includes(label),
  ) => (
    <FactRow key={label} label={label} brand={brand}>
      {button ? (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {value}
          {button}
        </span>
      ) : (
        value
      )}
    </FactRow>
  );
  // the icon sits inside the value, before the text, on the text baseline
  const withIcon =
    "inline-flex min-w-0 items-baseline gap-1.5 [&>svg]:self-center";
  const rows = [
    c.email &&
      row(
        dict.about.facts.email,
        <a
          href={`mailto:${c.email}`}
          translate="no"
          className={cx(withIcon, LINK)}
        >
          <Icon name="mail" />
          <span data-copy-value="email" className="min-w-0 wrap-anywhere">
            {c.email}
          </span>
        </a>,
        <CopyButton
          value={c.email}
          valueId="email"
          text={dict.copy}
          doneMessage={dict.copy.emailDone}
          sr={dict.copy.emailSr}
        />,
      ),
    c.github &&
      row(
        "GitHub",
        <ExternalLink
          href={c.github}
          newTab={dict.common.newTab}
          className={cx(withIcon, LINK)}
        >
          <Icon name="github" />
          <span translate="no" className="min-w-0 wrap-anywhere">
            {ghLabel(c.github)}
          </span>
        </ExternalLink>,
      ),
    c.instagram &&
      row(
        "Instagram",
        <ExternalLink
          href={c.instagram}
          newTab={dict.common.newTab}
          className={cx(withIcon, LINK)}
        >
          <Icon name="instagram" />
          <span translate="no" className="min-w-0 wrap-anywhere">
            @
            {c.instagram
              .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
              .replace(/\/$/, "")}
          </span>
        </ExternalLink>,
      ),
    c.discord &&
      (/^https?:/.test(c.discord)
        ? row(
            "Discord",
            <ExternalLink
              href={c.discord}
              newTab={dict.common.newTab}
              className={cx(withIcon, LINK)}
            >
              <Icon name="discord" />
              <span translate="no" className="min-w-0 wrap-anywhere">
                {ghLabel(c.discord)}
              </span>
            </ExternalLink>,
          )
        : row(
            "Discord",
            <span className={cx(withIcon, "text-ink")}>
              <Icon name="discord" />
              <span
                translate="no"
                data-copy-value="discord"
                className="min-w-0 wrap-anywhere"
              >
                {c.discord}
              </span>
            </span>,
            <CopyButton
              value={c.discord}
              valueId="discord"
              text={dict.copy}
              doneMessage={dict.copy.discordDone}
              sr={dict.copy.discordSr}
            />,
          )),
  ].filter(Boolean);
  return (
    <section id="connect" aria-labelledby="connect-title" className="min-w-0">
      <SectionHead id="connect" title={dict.nav.connect} />
      {rows.length ? <dl className="mt-4">{rows}</dl> : <Empty dict={dict} />}
    </section>
  );
}
