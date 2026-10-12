import Link from "next/link";
import { LocaleRedirect } from "@/components/locale-redirect";
import { cx, LINK } from "@/components/ui";
import { defaultLocale } from "@/i18n/config";

export default function RootPage() {
  return (
    <main className="shell py-12">
      <LocaleRedirect />
      <noscript>
        <p className="flex gap-6 text-base">
          <Link
            href={`/${defaultLocale}/`}
            lang="ko"
            className={cx("font-semibold", LINK)}
          >
            한국어
          </Link>
          <Link href="/en/" lang="en" className={cx("font-semibold", LINK)}>
            English
          </Link>
        </p>
      </noscript>
    </main>
  );
}
