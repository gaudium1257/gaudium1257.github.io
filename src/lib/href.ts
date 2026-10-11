import type { ContentKind } from "@/content/collect";
import type { Locale } from "@/i18n/config";

/** Projects → their page; everything else → its row on the home page (DOM id = content id). */
export function itemHref(
  locale: Locale,
  id: string,
  kind: ContentKind,
  onHome = false,
) {
  if (kind === "project") return `/${locale}/projects/${id}/`;
  const hash = kind === "society" ? "society" : id;
  return onHome ? `#${hash}` : `/${locale}/#${hash}`;
}
