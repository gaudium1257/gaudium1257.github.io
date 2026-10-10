// Render a .dc.html board as plain HTML (holes -> initial state, blobs -> local files) and screenshot it.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/home/user/gaudium1257.github.io/package.json");
const { chromium } = require("playwright");
const here = path.dirname(new URL(import.meta.url).pathname);
const [file, w, outPng] = process.argv.slice(2);
let html = fs.readFileSync(file, "utf8");
const first = (html.match(/data-nav="(\w+)"/) || [])[1];
const firstToc = (html.match(/data-toc="(\w+)"/) || [])[1];
html = html
  .replace('<script src="./support.js"></script>', "")
  .replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/, "")
  .replace(/<\/?x-dc>|<\/?helmet>/g, "")
  .replace(
    /<link rel="stylesheet" href="\/_blob\/\w+">/,
    `<link rel="stylesheet" href="file://${path.join(here, "moving-poster.flat.css")}">`,
  )
  .replace(
    "/_blob/76760fbe63bd614486cd18b85bb00898",
    "file://" + path.resolve(here, "../design/fonts/PretendardVariable.woff2"),
  )
  .replace(/\s+on[A-Z]\w*="\{\{[^}]+\}\}"/g, "")
  .replace(/\{\{nav\.(\w+)\.cur\}\}/g, (m, id) =>
    id === first ? "true" : "false",
  )
  .replace(/\{\{nav\.(\w+)\.aria\}\}/g, (m, id) =>
    id === first ? "location" : "false",
  )
  .replace(/\{\{toc\.(\w+)\.aria\}\}/g, (m, id) =>
    id === firstToc ? "location" : "false",
  )
  .replace(/\{\{gates\.\w+\}\}/g, "true")
  .replace(
    /\{\{copy\.\w+\.label\}\}/g,
    /<html lang="ko"/.test(html) ? "복사" : "Copy",
  )
  .replace(/\{\{copy\.\w+\.done\}\}/g, "false")
  .replace("{{motion.state}}", "on")
  .replace("{{motion.pressed}}", "false")
  .replace("{{status}}", "");
const left = html.match(/\{\{[^}]+\}\}/g);
if (left) console.log("UNFILLED", [...new Set(left)]);
const tmp = path.resolve(outPng).replace(/\.png$/, ".html");
fs.writeFileSync(tmp, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.emulateMedia({ reducedMotion: "reduce" });
await p.goto("file://" + tmp);
await p.evaluate(() => document.fonts.ready);
console.log(
  path.basename(file),
  w,
  "h=" + (await p.evaluate(() => document.documentElement.scrollHeight)),
  "overflowX=" +
    (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)),
);
await p.screenshot({ path: outPng, fullPage: true });
await b.close();
