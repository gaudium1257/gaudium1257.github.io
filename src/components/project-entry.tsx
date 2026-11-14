import type { Project } from "@/content/schema";
import {
  getActivitiesOf,
  getRelated,
  getSupportingTechs,
} from "@/content/load";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatPeriod } from "@/lib/format";
import { itemHref } from "@/lib/href";
import { heroShots } from "@/lib/media";
import { groupedStack, projectTechSlugs } from "@/lib/tech";
import { Capture, ProjectMark } from "./media";
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
      {/* an installer on GitHub Releases: said plainly, without the green "live" dot */}
      {project.deployment.status === "released" && (
        <span>{dict.deploymentStatus.released}</span>
      )}
    </p>
  );
}

/**
 * Opening a card lifts its picture and zooms the image inside a little (pointer hover, or press on
 * touch); no motion under reduced-motion.
 */
const LIFT =
  "transition-[translate] duration-300 group-hover/p:shadow-lift group-has-[[data-stretch]:active]/p:shadow-lift motion-safe:group-hover/p:-translate-y-1 [&_img]:transition-transform [&_img]:duration-500 motion-safe:group-hover/p:[&_img]:scale-[1.04]";

/** Chips shown on a card before "+N"; the full stack lives on the detail page. */
const CARD_CHIPS = 3;

/**
 * One project card (home, project list), kept short so the grid reads as a gallery (owner's pick
 * 2026.11, option B): lead capture → identity (title, one-liner, meta) → the first highlight →
 * a few tech chips pinned to the bottom so cards in a row line up. Role, the other highlights,
 * relations and the repository live on the detail page.
 * Order comes from content/project-order.json (applied by the loader); every card has the same shape.
 */
export function ProjectEntry({
  project,
  dict,
  locale,
  heading: Heading = "h3",
  eager,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  heading?: "h2" | "h3";
  /** first row of a page that opens on the list: load the capture now ("high" = the LCP candidate) */
  eager?: "eager" | "high";
}) {
  const { wide, phone } = heroShots(project);
  // core tech only, like the home stack; supporting libraries are on the detail page
  const supporting = getSupportingTechs();
  const names = groupedStack(project)
    .flatMap((g) => g.items)
    .filter((n) => !supporting.has(n));
  const more = Math.max(0, names.length - CARD_CHIPS);
  return (
    <li
      data-project={project.id}
      data-techs={projectTechSlugs(project).join(" ")}
      data-activities={getActivitiesOf(project.id)
        .map((a) => a.id)
        .join(" ")}
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
          <div className="flex items-center gap-3">
            <ProjectMark
              logo={project.logo}
              name={project.title.en}
              className="size-9 rounded-node"
              letterClass="text-lead"
            />
            <Heading className="min-w-0 text-h3 font-bold text-balance text-ink">
              <a
                href={`/${locale}/projects/${project.id}/`}
                data-stretch
                className={cx(STRETCH, "group-hover/p:text-primary")}
              >
                {t(project.title, locale)}
              </a>
            </Heading>
          </div>
          <p className="mt-1.5 text-ui leading-copy text-pretty text-ink-2">
            {t(project.tagline, locale)}
          </p>
          <ProjectMeta project={project} dict={dict} className="mt-2" />
        </div>
        {/* evidence: the first highlight only (the strongest, by the owner's order) */}
        {project.highlights[0] && (
          <p className="flex gap-2 text-ui leading-copy text-ink-2">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-edge"
            />
            <span className="min-w-0">
              <span className="sr-only">{dict.projects.highlights}: </span>
              {t(project.highlights[0], locale)}
            </span>
          </p>
        )}
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
        </div>
      </article>
    </li>
  );
}
