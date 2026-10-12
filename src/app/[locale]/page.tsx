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

function Band({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="border-t border-line">
      <div className={`shell py-8 lg:py-12 ${className}`}>{children}</div>
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
      <div className="shell grid gap-x-12 gap-y-10 py-8 lg:grid-cols-12 lg:py-12">
        <div className="min-w-0 lg:col-span-7">
          <Identity {...props} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <StackMap
            skills={content.skills}
            usage={usage}
            dict={dict}
            locale={locale}
            title={dict.nav.skills}
          />
        </div>
      </div>
      <Band>
        <ProjectsSection {...props} />
      </Band>
      {/* every paired band sits on the hero's 7/5 axis */}
      <Band className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="min-w-0 lg:col-span-7">
          <ActivitiesSection {...props} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <AwardsSection {...props} />
        </div>
      </Band>
      <Band className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="min-w-0 lg:col-span-7">
          <EducationSection {...props} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <ContactSection {...props} />
        </div>
      </Band>
    </main>
  );
}
