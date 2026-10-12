import { notFound } from "next/navigation";
import {
  ActivitiesSection,
  AwardsSection,
  ContactSection,
  EducationSection,
  Identity,
  ProjectsSection,
} from "@/components/home-sections";
import { StackMap } from "@/components/tech";
import { getContent } from "@/content/load";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { techUsage } from "@/lib/tech";

/**
 * Full-bleed bands. Background contrast (white / surface) separates chapters
 * instead of hairlines, so the page reads as a portfolio rather than a document.
 */
function Band({
  children,
  className = "",
  tone = "white",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "white" | "surface";
}) {
  return (
    <div className={tone === "surface" ? "bg-surface" : "bg-white"}>
      <div className={`shell py-14 lg:py-20 ${className}`}>{children}</div>
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const content = getContent();
  const usage = techUsage(content.projects);
  const props = { content, dict, locale };

  return (
    <main id="main">
      <Identity {...props} />
      <Band tone="surface">
        <StackMap
          skills={content.skills}
          usage={usage}
          dict={dict}
          locale={locale}
          title={dict.nav.skills}
        />
      </Band>
      <Band>
        <ProjectsSection {...props} />
      </Band>
      <Band
        tone="surface"
        className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-12"
      >
        <div className="min-w-0 lg:col-span-7">
          <ActivitiesSection {...props} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <AwardsSection {...props} />
        </div>
      </Band>
      <Band>
        <EducationSection {...props} />
      </Band>
      <ContactSection {...props} />
    </main>
  );
}
