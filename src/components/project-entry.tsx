import type { Project } from "@/content/schema";
import { getRelated } from "@/content/load";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatPeriod } from "@/lib/format";
import { itemHref } from "@/lib/href";
import { heroShots } from "@/lib/media";
import { projectTechSlugs } from "@/lib/tech";
import { Capture } from "./media";
import { RepoLine } from "./repo";
import { TechList } from "./tech";
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
}: {
  project: Project;
  dict: Dictionary;
}) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
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

/** One project in a list (home, project list). Featured: highlights + lead capture. */
export function ProjectEntry({
  project,
  dict,
  locale,
  featured = false,
  heading: Heading = "h3",
  onHome,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  featured?: boolean;
  heading?: "h2" | "h3";
  onHome: boolean;
}) {
  const title = (
    <div>
      <Heading className="text-h3 font-bold text-ink">
        <a
          href={`/${locale}/projects/${project.id}/`}
          data-stretch
          className={cx(STRETCH, "group-hover/p:text-primary")}
        >
          {t(project.title, locale)}
        </a>
      </Heading>
      <p className="mt-1 text-base leading-copy text-ink-2">
        {t(project.tagline, locale)}
      </p>
    </div>
  );
  const side = (
    <>
      <TechList project={project} dict={dict} locale={locale} />
      <RepoLine project={project} dict={dict} newTab={dict.common.newTab} />
    </>
  );
  // every entry shows its lead capture (owner request 2026.10); only the featured one adds highlights
  const { wide, phone } = heroShots(project);
  const lead = Boolean(wide || phone);
  return (
    <li
      data-project={project.id}
      data-techs={projectTechSlugs(project).join(" ")}
      data-show="true"
      className="data-[show=false]:hidden"
    >
      <article
        className={cx(
          "group/p relative -mx-3 grid gap-x-10 rounded-panel px-3 py-5 transition-colors hover:bg-surface md:grid-cols-12",
          lead ? "gap-y-4 md:grid-rows-[auto_1fr]" : "gap-y-3",
          ENTRY_FOCUS,
        )}
      >
        <div
          className={cx(
            "flex min-w-0 flex-col md:col-span-7",
            lead ? "gap-3 md:row-span-2 md:row-start-1" : "gap-2",
          )}
        >
          {title}
          <ProjectMeta project={project} dict={dict} />
          {featured && project.highlights.length > 0 && (
            <ul
              aria-label={dict.projects.highlights}
              className="grid gap-1 text-ui text-ink-2"
            >
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-edge"
                  />
                  {t(h, locale)}
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
        {lead && (
          <div
            className={cx(
              "grid min-w-0 gap-3 md:col-span-5 md:col-start-8 md:row-start-1",
              wide && phone && "grid-cols-[minmax(0,208fr)_minmax(0,60fr)]",
            )}
          >
            {wide && (
              <Capture
                src={wide.src}
                alt={t(wide.alt, locale)}
                kind={wide.kind}
              />
            )}
            {phone && (
              // a lone phone never stretches to the column
              <div className={cx(!wide && "w-36 sm:w-40")}>
                <Capture
                  src={phone.src}
                  alt={t(phone.alt, locale)}
                  kind="mobile"
                />
              </div>
            )}
          </div>
        )}
        <div
          className={cx(
            "flex min-w-0 flex-col gap-2.5 md:col-span-5 md:col-start-8",
            lead ? "md:row-start-2" : "md:row-start-1 md:pt-1",
          )}
        >
          {side}
        </div>
      </article>
    </li>
  );
}
