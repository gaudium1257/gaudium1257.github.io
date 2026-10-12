import Link from "next/link";
import en from "@/i18n/dictionaries/en";
import ko from "@/i18n/dictionaries/ko";
import { cx, LINK } from "./ui";

/** 404 body. Not-found pages get no locale, so every line comes in both languages, each with a way home. */
export function NotFoundBody() {
  return (
    <main id="main" className="shell py-12 lg:py-16">
      <h1 className="text-title-sm font-bold text-ink sm:text-title">404</h1>
      <div className="mt-4 grid max-w-160 gap-3">
        {(
          [
            ["ko", ko],
            ["en", en],
          ] as const
        ).map(([lc, d]) => (
          <p key={lc} lang={lc} className="text-base leading-prose text-ink-2">
            {d.common.notFound}{" "}
            <Link
              href={`/${lc}/`}
              className={cx("font-semibold whitespace-nowrap", LINK)}
            >
              {d.common.goHome}
            </Link>
          </p>
        ))}
      </div>
    </main>
  );
}
