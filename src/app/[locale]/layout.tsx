import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { sections } from "@/config/sections";
import { getContent } from "@/content/load";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  const { profile } = getContent();
  const name = profile ? t(profile.name, locale) : dict.meta.title;
  return {
    title: {
      default: `${name} | ${dict.meta.title}`,
      template: `%s | ${name}`,
    },
    description: profile ? t(profile.intro, locale) : dict.meta.description,
    alternates: { languages: { ko: "/ko/", en: "/en/" } },
  };
}

// NOTE: placeholder shell — replaced once the Variant design is delivered.
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { profile } = getContent();
  const year = new Date().getFullYear();

  return (
    <html lang={locale}>
      <body>
        <header>
          <nav aria-label="Sections">
            {sections.map((s) => (
              <a key={s.id} href={`/${locale}/#${s.id}`}>
                {dict.nav[s.label]}
              </a>
            ))}
          </nav>
          <LanguageToggle locale={locale} label={dict.common.languageToggle} />
        </header>
        {children}
        <footer>
          © {year} {profile ? t(profile.name, locale) : ""}.{" "}
          {dict.footer.rights}
        </footer>
      </body>
    </html>
  );
}
