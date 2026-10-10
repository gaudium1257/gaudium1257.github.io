import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content/load";
import { hasLocale, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// NOTE: unstyled placeholder that only proves the content pipeline works.
// The real layout comes from the chosen design.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const {
    profile,
    projects,
    activities,
    awards,
    societies,
    skills,
    education,
  } = getContent();

  return (
    <main>
      <section id="about">
        <h2>{dict.nav.about}</h2>
        {profile && (
          <>
            <h1>{t(profile.name, locale)}</h1>
            <p>{t(profile.headline, locale)}</p>
            <p>{t(profile.intro, locale)}</p>
            {profile.about.map((p, i) => (
              <p key={i}>{t(p, locale)}</p>
            ))}
          </>
        )}
      </section>

      <section id="projects">
        <h2>{dict.nav.projects}</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/${locale}/projects/${p.id}/`}>
                {t(p.title, locale)}
              </Link>{" "}
              — {t(p.tagline, locale)}
            </li>
          ))}
        </ul>
      </section>

      <section id="activities">
        <h2>{dict.nav.activities}</h2>
        <ul>
          {activities.map((a) => (
            <li key={a.id}>{t(a.title, locale)}</li>
          ))}
        </ul>
      </section>

      <section id="awards">
        <h2>{dict.nav.awards}</h2>
        <ul>
          {awards.map((a) => (
            <li key={a.id}>
              {t(a.title, locale)} — {t(a.prize, locale)}
            </li>
          ))}
        </ul>
      </section>

      <section id="society">
        <h2>{dict.nav.society}</h2>
        <ul>
          {societies.map((s) => (
            <li key={s.id}>{t(s.name, locale)}</li>
          ))}
        </ul>
      </section>

      <section id="skills">
        <h2>{dict.nav.skills}</h2>
        {skills.groups.map((g) => (
          <p key={g.category}>
            {t(g.label, locale)}: {g.items.map((i) => i.name).join(", ")}
          </p>
        ))}
      </section>

      <section id="education">
        <h2>{dict.nav.education}</h2>
        <ul>
          {education.items.map((e) => (
            <li key={e.id}>{t(e.school, locale)}</li>
          ))}
        </ul>
      </section>

      <section id="connect">
        <h2>{dict.nav.connect}</h2>
        {profile && (
          <ul>
            {profile.connect.github && (
              <li>
                <a href={profile.connect.github}>GitHub</a>
              </li>
            )}
            {profile.connect.email && (
              <li>
                <a href={`mailto:${profile.connect.email}`}>Email</a>
              </li>
            )}
            {profile.connect.instagram && (
              <li>
                <a href={profile.connect.instagram}>Instagram</a>
              </li>
            )}
            {profile.connect.discord && (
              <li>Discord: {profile.connect.discord}</li>
            )}
          </ul>
        )}
      </section>
    </main>
  );
}
