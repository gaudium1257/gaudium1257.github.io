// node shoot.mjs [outDir] [pages=home-ko,...] [widths=1440,390]
// Screenshots (reduced motion = the static composition) + objective checks from the spec (§11).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/home/user/gaudium1257.github.io/package.json");
const { chromium } = require("playwright");

const here = path.dirname(new URL(import.meta.url).pathname);
const proto = path.resolve(here, "../proto");
const out = path.resolve(process.argv[2] || path.join(here, "shots"));
const pages = (
  process.argv[3] || "home-ko,home-en,detail-ko,detail-en,list-ko,list-en"
).split(",");
const widths = (process.argv[4] || "1440,390").split(",").map(Number);
fs.mkdirSync(out, { recursive: true });

const b = await chromium.launch();
const results = {};
for (const pg of pages) {
  for (const w of widths) {
    const h = w >= 1024 ? 900 : w >= 768 ? 1024 : 844;
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto("file://" + path.join(proto, `sys-${pg}`, "index.html"), {
      waitUntil: "networkidle",
    });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const de = document.documentElement;
      const res = {
        overflowX: de.scrollWidth - innerWidth,
        height: de.scrollHeight,
      };
      const hdr = document.querySelector("header");
      res.header = Math.round(hdr.getBoundingClientRect().height);
      const photo = document.querySelector('[role="img"]');
      if (photo) {
        const pr = photo.getBoundingClientRect();
        res.photo = {
          ratio: +(pr.width / pr.height).toFixed(4),
          top: Math.round(pr.top),
          bottom: Math.round(pr.bottom),
          inFirstScreen: pr.top >= 0 && pr.bottom <= innerHeight,
        };
      }
      // nav: visible + hit-testable without scrolling
      const navLinks = [...document.querySelectorAll("header nav a")].filter(
        (a) => a.offsetParent,
      );
      res.navVisible = navLinks.filter((a) => {
        const q = a.getBoundingClientRect();
        const e = document.elementFromPoint(
          q.left + q.width / 2,
          q.top + q.height / 2,
        );
        return (
          q.right <= innerWidth &&
          q.bottom <= innerHeight &&
          e &&
          (e === a || a.contains(e))
        );
      }).length;
      res.ariaCurrent = [
        ...document.querySelectorAll("header nav a[aria-current]"),
      ].filter((a) => a.offsetParent).length;
      // type floor
      const small = new Set();
      const longLow = new Set();
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (el.closest(".sr-only, [aria-hidden=true]")) continue;
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === 3 && n.textContent.trim())
          .map((n) => n.textContent.trim())
          .join(" ");
        if (!own) continue;
        const fs_ = parseFloat(cs.fontSize);
        if (fs_ < 14) small.add(`${fs_}px "${own.slice(0, 30)}"`);
        if (
          ["P", "LI", "DD"].includes(el.tagName) &&
          el.innerText.length > 40
        ) {
          const lh =
            cs.lineHeight === "normal" ? 1.2 * fs_ : parseFloat(cs.lineHeight);
          if (fs_ < 15 || lh < 1.6 * fs_ - 0.01)
            longLow.add(
              `${fs_}/${(lh / fs_).toFixed(2)} "${el.innerText.slice(0, 30)}"`,
            );
        }
      }
      res.small = [...small];
      res.longLow = [...longLow];
      // dates
      const txt = document.body.innerText;
      res.badDates =
        txt.match(
          /\d{4}-\d{2}|\d{4}년|\d+월|\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b/g,
        ) || [];
      res.dates = [...new Set(txt.match(/\d{4}\.\d{2}/g) || [])];
      // text over decorative shapes
      const shapes = [...document.querySelectorAll("[aria-hidden=true]")]
        .filter(
          (e) => e.offsetParent || getComputedStyle(e).position === "fixed",
        )
        .map((e) => [e, e.getBoundingClientRect()]);
      const texts = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (!n.textContent.trim()) continue;
        const el = n.parentElement;
        if (el.closest("[aria-hidden=true], .sr-only") || !el.offsetParent)
          continue;
        const rg = document.createRange();
        rg.selectNodeContents(n);
        for (const q of rg.getClientRects())
          texts.push([el, q, n.textContent.trim().slice(0, 20)]);
      }
      const ov = [];
      for (const [el, q, s] of texts)
        for (const [sh, r] of shapes) {
          if (sh.contains(el) || el.contains(sh)) continue;
          if (sh.closest('[role="img"]') && el.closest('[role="img"]'))
            continue;
          const x = Math.max(
              0,
              Math.min(q.right, r.right) - Math.max(q.left, r.left),
            ),
            y = Math.max(
              0,
              Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top),
            );
          if (
            x * y > 1 &&
            getComputedStyle(sh).backgroundColor !== "rgba(0, 0, 0, 0)"
          )
            ov.push(`"${s}" × ${sh.className.slice(0, 40)}`);
        }
      res.textOnShape = [...new Set(ov)].slice(0, 8);
      // section rects (home)
      res.sections = Object.fromEntries(
        [
          ...document.querySelectorAll("main section[id], main > div, footer"),
        ].map((s) => [
          s.id ||
            s.tagName.toLowerCase() +
              ":" +
              (s.querySelector("section")?.id || ""),
          Math.round(s.getBoundingClientRect().height),
        ]),
      );
      const h1 = document.querySelector("h1").getBoundingClientRect();
      res.h1Bottom = Math.round(h1.bottom);
      return res;
    });
    results[`${pg}-${w}`] = r;
    await p.screenshot({
      path: path.join(out, `${pg}-${w}.png`),
      fullPage: true,
    });
    await p.screenshot({ path: path.join(out, `${pg}-${w}.fold.png`) });
    await p.close();
  }
}
await b.close();
fs.writeFileSync(
  path.join(out, "report.json"),
  JSON.stringify(results, null, 1),
);
for (const [k, r] of Object.entries(results)) {
  const flags = [];
  if (r.overflowX) flags.push(`overflowX=${r.overflowX}`);
  if (r.small.length) flags.push(`small:${r.small.length}`);
  if (r.longLow.length) flags.push(`longLow:${r.longLow.length}`);
  if (r.badDates.length) flags.push(`badDates:${r.badDates}`);
  if (r.textOnShape.length) flags.push(`textOnShape:${r.textOnShape.length}`);
  console.log(
    k.padEnd(16),
    `h=${r.height}`,
    `hdr=${r.header}`,
    r.photo
      ? `photo=${r.photo.ratio} ${r.photo.top}-${r.photo.bottom} in=${r.photo.inFirstScreen}`
      : "",
    `nav=${r.navVisible} cur=${r.ariaCurrent}`,
    flags.join(" "),
  );
}
