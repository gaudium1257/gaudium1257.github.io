import type { Metadata } from "next";
import { verificationMeta } from "@/config/verification";
import "../globals.css";

export const metadata: Metadata = {
  robots: { index: false },
  other: verificationMeta,
};

/** Layout for `/` only, which just forwards to a locale. Real pages live under `[locale]`. */
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
