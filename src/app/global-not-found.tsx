import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { NotFoundBody } from "@/components/not-found-body";
import "./globals.css";

export const metadata: Metadata = { title: "404" };

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body>
        <NotFoundBody />
      </body>
    </html>
  );
}
