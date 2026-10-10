/**
 * Responsive screenshots of the static build for visual review.
 *
 *   npm run build && npm run screenshot [-- /ko/ /en/projects/foo/]
 *
 * Serves `out/` on a local port, captures each path at mobile / tablet /
 * desktop widths, and writes PNGs to `screenshots/` (git-ignored).
 * Locally you may need `npx playwright install chromium` once.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const OUT = path.resolve("out");
const DEST = path.resolve("screenshots");
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];
const paths = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/ko/", "/en/"];

if (!fs.existsSync(OUT)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};
const server = http.createServer((req, res) => {
  let file = path.join(
    OUT,
    decodeURIComponent(new URL(req.url, "http://x").pathname),
  );
  if (fs.existsSync(file) && fs.statSync(file).isDirectory())
    file = path.join(file, "index.html");
  if (!file.startsWith(OUT) || !fs.existsSync(file)) {
    res.writeHead(404, { "content-type": "text/html" });
    return res.end(
      fs.existsSync(path.join(OUT, "404.html"))
        ? fs.readFileSync(path.join(OUT, "404.html"))
        : "404",
    );
  }
  res.writeHead(200, {
    "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

fs.mkdirSync(DEST, { recursive: true });
const browser = await chromium.launch();
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    for (const p of paths) {
      await page.goto(base + p, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      const name = `${p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "root"}.${vp.name}.png`;
      await page.screenshot({ path: path.join(DEST, name), fullPage: true });
      console.log(
        `${overflow ? "⚠ horizontal overflow  " : ""}screenshots/${name}`,
      );
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
