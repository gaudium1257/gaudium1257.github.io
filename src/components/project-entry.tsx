import type { Project } from "@/content/schema";
import { getRelated } from "@/content/load";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatPeriod } from "@/lib/format";
import { itemHref } from "@/lib/href";
import { heroShots } from "@/lib/media";
import { groupedStack, projectTechSlugs } from "@/lib/tech";
import { Capture } from "./media";
import { RepoLine } from "./repo";
import { TechChip } from "./tech";
import { cx, ENTRY_FOCUS, LINK, STRETCH } from "./ui";

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-live">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-live forced-colors:bg-[CanvasText]"
      />
      {label}
    </span>
  );
}

export function RelatedLinks({
  id,
  dict,
  locale,
  onHome,
  className,
}: {
  id: string;
  dict: Dictionary;
  locale: Locale;
  onHome: boolean;
  className?: string;
}) {
  const rel = getRelated(id);
  if (!rel.length) return null;
  return (
    <p
      className={cx(
        "flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm leading-copy",
        className,
      )}
    >
      <span className="text-muted">{dict.common.related}</span>
      {rel.map((r) => (
        <a
          key={r.id}
          href={itemHref(locale, r.id, r.kind, onHome)}
          className={cx("relative z-10 font-medium", LINK)}
        >
          <span className="sr-only">{dict.kind[r.kind]}: </span>
          {t(r.title, locale)}
          {r.prize && <span className="text-award"> {t(r.prize, locale)}</span>}
        </a>
      ))}
    </p>
  );
}

export function ProjectMeta({
  project,
  dict,
  className,
}: {
  project: Project;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted",
        className,
      )}
    >
      <span>{dict.category[project.category]}</span>
      <span className="tabular-nums">
        {formatPeriod(project.period, dict.common.present)}
      </span>
      {project.deployment.status === "live" && (
        <LiveBadge label={dict.deploymentStatus.live} />
      )}
    </p>
  );
}

/** Opening a card lifts its picture (pointer hover, or press on touch); no motion under reduced-motion. */
const LIFT =
  "transition-[translate] duration-300 group-hover/p:shadow-lift group-has-[[data-stretch]:active]/p:shadow-lift motion-safe:group-hover/p:-translate-y-1";

/** Chips shown on a card before "+N"; the full stack lives on the detail page. */
const CARD_CHIPS = 6;

/**
 * One project card (home, project list): lead capture → identity (title, one-liner, meta) →
 * evidence (role, highlights, relations) → tech chips and repo pinned to the bottom so cards in a
 * row line up.
 * `featured` only sorts first (decided by the caller); every card has the same shape.
 */
export function ProjectEntry({
  project,
  dict,
  locale,
  heading: Heading = "h3",
  onHome,
  eager,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  heading?: "h2" | "h3";
  onHome: boolean;
  /** first row of a page that opens on the list: load the capture now ("high" = the LCP candidate) */
  eager?: "eager" | "high";
}) {
  const { wide, phone } = heroShots(project);
  const names = groupedStack(project).flatMap((g) => g.items);
  const more = Math.max(0, names.length - CARD_CHIPS);
  return (
    <li
      data-project={project.id}
      data-techs={projectTechSlugs(project).join(" ")}
      data-show="true"
      className="min-w-0 data-[show=false]:hidden"
    >
      <article
        className={cx(
          // -m-3 + p-3 gives the hover surface room; the height adds those 1.5rem back so the card fills its row
          "group/p relative -m-3 flex h-[calc(100%+1.5rem)] flex-col gap-4 rounded-panel p-3",
          ENTRY_FOCUS,
        )}
      >
        {/* one 16:10 box per card so a row lines up; a phone-only project sits centred in it */}
        {wide ? (
          <Capture
            src={wide.src}
            alt={t(wide.alt, locale)}
            kind={wide.kind}
            radius="rounded-card"
            className={cx("shrink-0", LIFT)}
            load={eager}
          />
        ) : (
          phone && (
            <div
              className={cx(
                "flex aspect-16/10 shrink-0 justify-center rounded-card bg-surface py-3 ring-1 ring-line ring-inset",
                LIFT,
              )}
            >
              <Capture
                src={phone.src}
                alt={t(phone.alt, locale)}
                kind="mobile"
                className="h-full w-auto"
                load={eager}
              />
            </div>
          )
        )}
        <div>
          <Heading className="text-h3 font-bold text-balance text-ink">
            <a
              href={`/${locale}/projects/${project.id}/`}
              data-stretch
              className={cx(STRETCH, "group-hover/p:text-primary")}
            >
              {t(project.title, locale)}
            </a>
          </Heading>
          <p className="mt-1.5 text-ui leading-copy text-pretty text-ink-2">
            {t(project.tagline, locale)}
          </p>
          <ProjectMeta project={project} dict={dict} className="mt-2" />
        </div>
        {/* evidence: the owner’s role first, then highlights and relations */}
        <div className="grid gap-2.5">
          {/* label/value grid: a long role wraps beside "Role", never under it */}
          <p className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 text-sm leading-copy">
            <span className="text-muted">{dict.project.facts.role}</span>
            <span className="min-w-0 font-medium text-ink-2">
              {t(project.team.role, locale)}
            </span>
          </p>
          {project.highlights.length > 0 && (
            <ul
              aria-label={dict.projects.highlights}
              className="grid gap-1.5 text-ui leading-copy text-ink-2"
            >
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-edge"
                  />
                  <span className="min-w-0">{t(h, locale)}</span>
                </li>
              ))}
            </ul>
          )}
          <RelatedLinks
            id={project.id}
            dict={dict}
            locale={locale}
            onHome={onHome}
          />
        </div>
        <div className="mt-auto flex min-w-0 flex-col gap-2.5 pt-1">
          <ul
            aria-label={dict.skills.label}
            className="flex flex-wrap items-center gap-1.5"
          >
            {/* every chip is rendered so a filter match past the first few can still light up */}
            {names.map((name, i) => (
              <TechChip key={name} name={name} extra={i >= CARD_CHIPS} />
            ))}
            {more > 0 && (
              <li className="text-sm font-medium text-muted tabular-nums">
                <span aria-hidden="true">+{more}</span>
                <span className="sr-only">
                  {fill(dict.projects.moreTechSr, { n: more })}
                </span>
              </li>
            )}
          </ul>
          <RepoLine
            project={project}
            dict={dict}
            locale={locale}
            newTab={dict.common.newTab}
          />
        </div>
      </article>
    </li>
  );
}
