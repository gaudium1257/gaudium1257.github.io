import "server-only";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Link-preview images (Open Graph, 1200×630) built at export time: what KakaoTalk, Discord,
 * LinkedIn and mail clients show when a page's address is pasted. Satori draws plain CSS, so the
 * site tokens from globals.css are repeated here as literal values.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  white: "#ffffff",
  ink: "#1c1626",
  ink2: "#3b3546",
  muted: "#5d5670",
  line: "#e5e0ee",
  primary: "#6d28d9",
  primary50: "#f5f3ff",
  primary100: "#ede9fe",
  award: "#8a3b0b",
  live: "#15803d",
};

const FONT_DIR = "node_modules/pretendard/dist/public/static/alternative";
const fontFile = (w: string) =>
  readFile(join(process.cwd(), FONT_DIR, `Pretendard-${w}.ttf`));

async function fonts() {
  const [regular, semibold, bold] = await Promise.all(
    ["Regular", "SemiBold", "Bold"].map(fontFile),
  );
  return [
    { name: "Pretendard", data: regular, weight: 400 as const },
    { name: "Pretendard", data: semibold, weight: 600 as const },
    { name: "Pretendard", data: bold, weight: 700 as const },
  ];
}

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

/** A file under public/ as a data URI (Satori cannot fetch site-relative paths). */
async function dataUri(publicPath: string) {
  const type = MIME[extname(publicPath).toLowerCase()];
  if (!type) return undefined;
  const buf = await readFile(join(process.cwd(), "public", publicPath));
  return `data:${type};base64,${buf.toString("base64")}`;
}

/** The site's TH mark, drawn at `size` px. */
const Mark = ({ src, size }: { src: string; size: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} width={size} height={size} alt="" />
);

function Frame({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: C.primary50,
        padding: 48,
        fontFamily: "Pretendard",
        color: C.ink,
        // Korean wraps between words, not inside them
        wordBreak: "keep-all",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          background: C.white,
          borderRadius: 32,
          border: `2px solid ${C.primary100}`,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: C.muted,
        }}
      >
        <span>{footer}</span>
        <span>gaudium1257.github.io</span>
      </div>
    </div>
  );
}

/** Home / list preview: mark, name and the profile headline. */
export async function personImage({
  name,
  altName,
  headline,
  footer,
}: {
  name: string;
  altName: string;
  headline: string;
  footer: string;
}) {
  const mark = (await dataUri("/brand/th-mark.svg"))!;
  return new ImageResponse(
    <Frame footer={footer}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 72px",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Mark src={mark} size={88} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontSize: 64, fontWeight: 700, color: C.primary }}>
              {name}
            </span>
            <span style={{ fontSize: 34, fontWeight: 600, color: C.muted }}>
              {altName}
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: -1.5,
            maxWidth: 940,
          }}
        >
          {headline}
        </div>
      </div>
    </Frame>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** Project preview: identity on the left, its lead capture on the right. */
export async function projectImage({
  title,
  tagline,
  meta,
  award,
  logo,
  shot,
  footer,
}: {
  title: string;
  tagline: string;
  meta: string[];
  award?: string;
  logo?: string;
  shot?: { src: string; kind: string };
  footer: string;
}) {
  const [logoUri, shotUri] = await Promise.all([
    logo ? dataUri(logo) : undefined,
    shot ? dataUri(shot.src) : undefined,
  ]);
  const phone = shot?.kind === "mobile";
  return new ImageResponse(
    <Frame footer={footer}>
      <div
        style={{
          width: shotUri ? 600 : "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 44px 0 52px",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {logoUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUri}
              width={76}
              height={76}
              alt=""
              style={{ borderRadius: 18, border: `2px solid ${C.line}` }}
            />
          ) : (
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                background: C.primary50,
                color: C.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              {title.slice(0, 1)}
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 16 ? 38 : title.length > 10 ? 42 : 52,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              flex: 1,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: C.ink2,
            fontWeight: 600,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: 22,
            rowGap: 4,
            fontSize: 24,
            color: C.muted,
          }}
        >
          {meta.map((m) => (
            <span key={m} style={{ whiteSpace: "nowrap" }}>
              {m}
            </span>
          ))}
        </div>
        {award && (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 4,
              padding: "8px 18px",
              borderRadius: 999,
              background: C.primary50,
              color: C.award,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {award}
          </div>
        )}
      </div>
      {shotUri && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: phone ? "center" : "flex-start",
            background: C.primary50,
            paddingLeft: phone ? 0 : 36,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shotUri}
            alt=""
            width={phone ? 200 : 620}
            height={phone ? 433 : 388}
            style={{
              objectFit: "cover",
              objectPosition: "top left",
              borderRadius: phone ? 24 : 16,
              border: `2px solid ${C.line}`,
            }}
          />
        </div>
      )}
    </Frame>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
