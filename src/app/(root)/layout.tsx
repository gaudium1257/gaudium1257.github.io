import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { robots: { index: false } };

/** Layout for `/` only, which just forwards to a locale. Real pages live under `[locale]`. */
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
