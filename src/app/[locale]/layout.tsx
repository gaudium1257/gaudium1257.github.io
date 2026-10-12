import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { LanguageToggle } from "@/components/language-toggle";
import { ScrollSpy } from "@/components/scroll-spy";
import { cx, LINK } from "@/components/ui";
import { sections } from "@/config/sections";
import { getContent } from "@/content/load";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#ffffff" };

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

const DESK =
  "relative flex h-16 items-center px-2.5 text-ui font-medium text-muted transition-colors hover:text-ink active:bg-primary-50 focus-visible:z-10 focus-visible:-outline-offset-2 data-[current=true]:text-ink after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 data-[current=true]:after:opacity-100 forced-colors:after:bg-[CanvasText] xl:px-3 xl:after:inset-x-3";
const MOB =
  "relative flex h-9 items-center justify-center text-sm font-medium text-muted transition-colors hover:text-ink active:bg-primary-50 focus-visible:z-10 focus-visible:-outline-offset-2 data-[current=true]:text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 data-[current=true]:after:opacity-100 forced-colors:after:bg-[CanvasText] whitespace-nowrap md:h-11 md:px-3 md:text-ui";

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { profile } = getContent();
  const name = profile ? t(profile.name, locale) : dict.meta.title;
  const year = new Date().getFullYear();
  // Nav links always point at the home sections; the home page's ScrollSpy marks the current one.
  const nav = (cls: string) =>
    sections.map((s) => (
      <li key={s.id} className={"wide" in s ? "col-span-2" : undefined}>
        <a href={`/${locale}/#${s.id}`} data-nav={s.id} className={cls}>
          {dict.nav[s.label]}
        </a>
      </li>
    ));

  return (
    <html
      lang={locale}
      className="scroll-pt-32 md:scroll-pt-24 lg:scroll-pt-20 tiny:scroll-pt-0"
    >
      <body>
        <a
          href="#main"
          className="sr-only z-60 rounded-node bg-ink px-4 py-2 text-ui text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {dict.common.skip}
        </a>
        <header className="sticky top-0 z-50 border-b border-line bg-white tiny:static">
          <div className="shell flex h-11 items-center gap-4 lg:h-16">
            <a
              href={`/${locale}/`}
              translate="no"
              className="text-lead font-bold tracking-tight text-ink decoration-2 underline-offset-[6px] hover:underline active:text-primary-700"
            >
              {name}
            </a>
            <nav
              aria-label={dict.common.navLabel}
              className="ml-auto hidden lg:block"
            >
              <ul className="flex">{nav(DESK)}</ul>
            </nav>
            <LanguageToggle
              locale={locale}
              label={dict.common.langLabel}
              names={dict.common.langNames}
            />
          </div>
          <nav
            aria-label={dict.common.navLabel}
            className="border-t border-line lg:hidden"
          >
            <ul className="shell grid grid-cols-4 md:flex md:justify-between">
              {nav(MOB)}
            </ul>
          </nav>
        </header>
        {children}
        <footer className="border-t border-line">
          <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted">
            <p>
              {"©\u00a0"}
              {year} <span translate="no">{name}</span>
            </p>
            <a
              href="#main"
              className={cx(
                "inline-flex min-h-6 items-center font-medium",
                LINK,
              )}
            >
              {dict.common.backToTop}
            </a>
          </div>
        </footer>
        <p role="status" aria-live="polite" className="sr-only" data-status />
        <ScrollSpy />
      </body>
    </html>
  );
}
