import Link from "next/link";
import { LocaleRedirect } from "@/components/locale-redirect";
import { defaultLocale } from "@/i18n/config";

export default function RootPage() {
  return (
    <main>
      <LocaleRedirect />
      <noscript>
        <Link href={`/${defaultLocale}/`}>한국어</Link> ·{" "}
        <Link href="/en/">English</Link>
      </noscript>
    </main>
  );
}
