import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "404" };

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body>
        <main>
          <h1>404</h1>
          <p>페이지를 찾을 수 없습니다. · Page not found.</p>
          <p>
            <Link href="/ko/">한국어</Link> · <Link href="/en/">English</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
