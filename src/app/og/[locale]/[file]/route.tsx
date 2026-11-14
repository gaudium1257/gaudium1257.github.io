import { getContent, getRelated } from "@/content/load";
import { hasLocale, locales, t, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fill, formatPeriod } from "@/lib/format";
import { heroShots } from "@/lib/media";
import { personImage, projectImage } from "@/lib/og";

/**
 * Link-preview images as real `.png` files: `/og/<locale>/home.png` and `/og/<locale>/<id>.png`.
 * A route handler (not `opengraph-image.tsx`) because GitHub Pages picks the content type from
 * the file extension, and metadata image routes are exported without one. Pages point at these
 * from their `openGraph.images` (see `ogImage` in src/lib/og-meta.ts).
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const files = ["home", ...getContent().projects.map((p) => p.id)];
  return locales.flatMap((locale) =>
    files.map((id) => ({ locale, file: `${id}.png` })),
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; file: string }> },
) {
  const { locale: raw, file } = await params;
  const locale = (hasLocale(raw) ? raw : "ko") as Locale;
  const dict = getDictionary(locale);
  const { profile, projects } = getContent();
  const name = t(profile!.name, locale);
  const footer = fill(dict.meta.ogFooter, { name });
  const id = file.replace(/\.png$/, "");

  if (id === "home")
    return personImage({
      name,
      altName: t(profile!.name, locale === "ko" ? "en" : "ko"),
      headline: t(profile!.headline, locale),
      footer,
    });

  const p = projects.find((x) => x.id === id)!;
  const award = getRelated(p.id).find((r) => r.kind === "award");
  const { wide, phone } = heroShots(p);
  const shot = wide ?? phone;
  const status = p.deployment.status;
  return projectImage({
    title: t(p.title, locale),
    tagline: t(p.tagline, locale),
    meta: [
      dict.category[p.category],
      formatPeriod(p.period, dict.common.present),
      status === "live" || status === "released"
        ? dict.deploymentStatus[status]
        : null,
    ].filter((x): x is string => !!x),
    award:
      award?.prize && `${t(award.title, locale)} ${t(award.prize, locale)}`,
    logo: p.logo,
    shot: shot && { src: shot.src, kind: shot.kind },
    footer,
  });
}
