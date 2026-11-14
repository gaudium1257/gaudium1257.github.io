import type { Metadata } from "next";
import { getContent } from "@/content/load";
import { t, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fill } from "@/lib/format";

export const SITE_URL = "https://gaudium1257.github.io";

/**
 * Open Graph fields for one page. A page's `openGraph` replaces the layout's instead of merging,
 * so every page builds the whole set here: title, description, URL and its preview image
 * (`/og/<locale>/<image>.png`, drawn by src/app/og/[locale]/[file]/route.tsx).
 */
export function openGraph({
  locale,
  title,
  description,
  path,
  image,
  alt,
  type = "website",
}: {
  locale: Locale;
  title: string;
  description: string;
  /** page path without the locale, e.g. "" or "projects/gudory/" */
  path: string;
  /** image id: "home" or a project id */
  image: string;
  alt: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const name = t(getContent().profile!.name, locale);
  const images = [
    { url: `/og/${locale}/${image}.png`, width: 1200, height: 630, alt },
  ];
  return {
    openGraph: {
      type,
      siteName: fill(getDictionary(locale).meta.ogFooter, { name }),
      locale: locale === "ko" ? "ko_KR" : "en_US",
      title,
      description,
      url: `/${locale}/${path}`,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
