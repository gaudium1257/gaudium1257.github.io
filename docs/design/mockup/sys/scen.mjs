// node scen.mjs — media edge cases (proto/_scen-*): exact ratios, square spines, no overflow, screenshots
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/home/user/gaudium1257.github.io/package.json");
const { chromium } = require("playwright");
const here = path.dirname(new URL(import.meta.url).pathname);
const proto = path.resolve(here, "../proto");
const out = path.join(here, "scen");
fs.mkdirSync(out, { recursive: true });
const WANT = { web: 1.6, mobile: 6 / 13, photo: 4 / 3 };
const dirs = fs
  .readdirSync(proto)
  .filter(
    (d) =>
      d.startsWith("_scen-") && fs.statSync(path.join(proto, d)).isDirectory(),
  );
const b = await chromium.launch();
const fails = [];
for (const d of dirs)
  for (const w of [375, 768, 1024, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto("file://" + path.join(proto, d, "index.html"));
    const r = await p.evaluate((WANT) => {
      const bad = [];
      for (const el of document.querySelectorAll("[data-slot]")) {
        const rc = el.getBoundingClientRect();
        if (!rc.width || el.dataset.fit === "cover") continue;
        const ratio = rc.width / rc.height;
        if (Math.abs(ratio / WANT[el.dataset.slot] - 1) > 0.02)
          bad.push(`${el.dataset.slot} ${ratio.toFixed(3)}`);
      }
      for (const u of document.querySelectorAll(".aspect-29\\/15")) {
        const rc = u.getBoundingClientRect();
        if (Math.abs(rc.width / rc.height - 29 / 15) > 0.03)
          bad.push(`unit ${(rc.width / rc.height).toFixed(3)}`);
        const sp = u.children[1];
        if (sp && sp.classList.contains("grid-rows-3"))
          for (const c of sp.children) {
            const cr = c.getBoundingClientRect();
            if (Math.abs(cr.width / cr.height - 1) > 0.03)
              bad.push(`spine ${cr.width.toFixed(0)}x${cr.height.toFixed(0)}`);
          }
      }
      const toc = [...document.querySelectorAll("[data-toc]")].map(
        (a) => a.dataset.toc,
      );
      const missing = toc.filter((id) => !document.getElementById(id));
      return {
        bad,
        over: document.documentElement.scrollWidth - innerWidth,
        missing,
        screens: !!document.getElementById("screens"),
      };
    }, WANT);
    if (r.bad.length) fails.push(`${d}@${w}: ${r.bad.join("; ")}`);
    if (r.over > 0) fails.push(`${d}@${w}: overflow ${r.over}`);
    if (r.missing.length) fails.push(`${d}@${w}: toc → missing ${r.missing}`);
    if (w === 1440) console.log(d, "screens section:", r.screens);
    if (w === 1440 || w === 375) {
      const sel = d.endsWith("-home") ? "#projects" : "main";
      await p
        .locator(sel)
        .screenshot({ path: path.join(out, `${d}-${w}.png`) });
    }
    await p.close();
  }
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(
    "file://" + path.join(proto, "_scen-mixed-detail", "index.html"),
  );
  const before = await p.evaluate(
    () => document.querySelector("#screens details")?.open,
  );
  await p.click('a[href="#screens"]');
  const after = await p.evaluate(
    () => document.querySelector("#screens details")?.open,
  );
  if (before !== false || after !== true)
    fails.push(`all-screens link: details ${before} -> ${after}`);
  await p.close();
}
await b.close();
console.log(fails.length ? "FAIL\n- " + fails.join("\n- ") : "SCENARIOS OK");
