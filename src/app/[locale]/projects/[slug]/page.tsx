import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getRelated } from "@/content/load";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

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

function findProject(slug: string) {
  return getContent().projects.find((p) => p.id === slug);
}

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

// NOTE: unstyled placeholder — replaced once the Variant design is delivered.
export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = findProject(slug);
  if (!hasLocale(locale) || !project) notFound();
  const dict = getDictionary(locale);
  const related = getRelated(project.id);

  return (
    <main>
      <Link href={`/${locale}/#projects`}>{dict.common.backToHome}</Link>
      <h1>{t(project.title, locale)}</h1>
      <p>{t(project.tagline, locale)}</p>

      <h2>{dict.project.summary}</h2>
      <p>{t(project.summary, locale)}</p>

      <h2>{dict.project.status}</h2>
      <p>
        {dict.projectStatus[project.status]} ·{" "}
        {dict.deploymentStatus[project.deployment.status]}
        {project.deployment.platform && ` · ${project.deployment.platform}`}
      </p>

      <h2>{dict.project.features}</h2>
      <ul>
        {project.features.map((f, i) => (
          <li key={i}>
            <strong>{t(f.title, locale)}</strong> — {t(f.description, locale)}
          </li>
        ))}
      </ul>

      <h2>{dict.project.contributions}</h2>
      <ul>
        {project.contributions.map((c, i) => (
          <li key={i}>{t(c, locale)}</li>
        ))}
      </ul>

      <h2>{dict.project.techStack}</h2>
      <ul>
        {project.techStack.map((s) => (
          <li key={s.category}>
            {s.category}: {s.items.join(", ")}
          </li>
        ))}
      </ul>

      {project.outcomes.length > 0 && (
        <>
          <h2>{dict.project.outcomes}</h2>
          <ul>
            {project.outcomes.map((o, i) => (
              <li key={i}>{t(o, locale)}</li>
            ))}
          </ul>
        </>
      )}

      {project.links.length > 0 && (
        <>
          <h2>{dict.project.links}</h2>
          <ul>
            {project.links.map((l) => (
              <li key={l.url}>
                <a href={l.url}>{l.label ? t(l.label, locale) : l.type}</a>
              </li>
            ))}
          </ul>
        </>
      )}

      {related.length > 0 && (
        <>
          <h2>{dict.common.related}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                {r.kind}: {t(r.title, locale)}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
