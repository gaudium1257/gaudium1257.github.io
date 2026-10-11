// node verify.mjs — every objective check of the "Clean Stack" mockup, on proto/sys-*/index.html
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/home/user/gaudium1257.github.io/package.json");
const { chromium } = require("playwright");
const AXE = fs.readFileSync(
  "/home/user/gaudium1257.github.io/node_modules/axe-core/axe.min.js",
  "utf8",
);
const proto = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../proto",
);
const url = (pg, q = "") =>
  "file://" + path.join(proto, `sys-${pg}`, "index.html") + q;
const PAGES = ["home", "detail", "detail2", "list"].flatMap((p) => [
  `${p}-ko`,
  `${p}-en`,
]);
const fails = [];
const ok = (cond, msg) => {
  if (!cond) fails.push(msg);
  return cond;
};

// ── code gate on the generated markup
for (const pg of PAGES) {
  const html = fs
    .readFileSync(path.join(proto, `sys-${pg}`, "index.html"), "utf8")
    .replace(/<script>[\s\S]*?<\/script>/, "")
    .replace(/<style>[\s\S]*?<\/style>/, "")
    .replace(/<meta name="theme-color"[^>]*>/, "");
  const classes = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) =>
    m[1].split(/\s+/),
  );
  ok(
    !/#[0-9a-fA-F]{3,8}\b/.test(html.replace(/href="[^"]*"/g, "")),
    `${pg}: raw hex in markup`,
  );
  ok(!/\sstyle=/.test(html), `${pg}: inline style`);
  ok(!classes.some((c) => /(^|:)text-xs$/.test(c)), `${pg}: text-xs`);
  ok(
    !classes.some((c) => /gradient|blur|backdrop|(^|:)shadow-/.test(c)),
    `${pg}: gradient/blur/shadow`,
  );
  const motion = classes.filter((c) =>
    /(^|:)(animate-|transition-transform|transition-all)|hover:-?(rotate|translate|scale)/.test(
      c,
    ),
  );
  ok(!motion.length, `${pg}: motion classes ${[...new Set(motion)]}`);
}

const b = await chromium.launch();

// ── axe
for (const pg of PAGES)
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url(pg));
    await p.addScriptTag({ content: AXE });
    const v = await p.evaluate(async () =>
      (
        await axe.run(document, {
          runOnly: [
            "wcag2a",
            "wcag2aa",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ],
        })
      ).violations.map(
        (x) =>
          `${x.id}(${x.nodes.length}): ${x.nodes
            .slice(0, 2)
            .map((n) => n.target.join(" "))
            .join(" | ")}`,
      ),
    );
    ok(!v.length, `axe ${pg}@${w}: ${v.join(" ;; ")}`);
    await p.close();
  }

// ── layout floor: no horizontal scroll, type >= 14px, long paragraphs >= 15px / 1.6, no animations at all
for (const pg of PAGES)
  for (const w of [320, 375, 390, 768, 1024, 1280, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url(pg));
    const r = await p.evaluate(() => {
      const small = [],
        low = [];
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || el.closest(".sr-only,[aria-hidden=true]"))
          continue;
        const own = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim(),
        );
        if (!own || !el.offsetParent) continue;
        const fs_ = parseFloat(cs.fontSize);
        if (fs_ < 14) small.push(el.textContent.trim().slice(0, 20));
        if (
          ["P", "LI", "DD"].includes(el.tagName) &&
          el.innerText.length > 40
        ) {
          const lh =
            cs.lineHeight === "normal" ? 1.2 * fs_ : parseFloat(cs.lineHeight);
          if (fs_ < 15 || lh < 1.6 * fs_ - 0.01)
            low.push(el.innerText.slice(0, 24));
        }
      }
      return {
        over: document.documentElement.scrollWidth - innerWidth,
        small,
        low,
        anims: document.getAnimations().length,
      };
    });
    ok(r.over <= 0, `${pg}@${w}: horizontal overflow ${r.over}px`);
    ok(!r.small.length, `${pg}@${w}: text < 14px ${r.small.slice(0, 3)}`);
    ok(!r.low.length, `${pg}@${w}: long text < 15px/1.6 ${r.low.slice(0, 3)}`);
    ok(!r.anims, `${pg}@${w}: ${r.anims} animations running`);
    await p.close();
  }

// ── first screen: the 3:4 photo is fully visible; nav + KO/EN reachable without scrolling
for (const pg of ["home-ko", "home-en"])
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
    [375, 667],
  ]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url(pg));
    const r = await p.evaluate(() => {
      const ph = document
        .querySelector('#about [role="img"]')
        .getBoundingClientRect();
      const nav = [...document.querySelectorAll("header nav a")].filter(
        (a) => a.offsetParent,
      );
      const hit = nav.filter((a) => {
        const q = a.getBoundingClientRect();
        const e = document.elementFromPoint(
          q.left + q.width / 2,
          q.top + q.height / 2,
        );
        return e && (e === a || a.contains(e)) && q.bottom <= innerHeight;
      }).length;
      return {
        ratio: ph.width / ph.height,
        inside: ph.top >= 0 && ph.bottom <= innerHeight,
        nav: nav.length,
        hit,
        hdr: document.querySelector("header").getBoundingClientRect().height,
      };
    });
    ok(Math.abs(r.ratio - 0.75) < 0.01, `${pg}@${w}: photo ratio ${r.ratio}`);
    ok(r.inside, `${pg}@${w}x${h}: photo not on the first screen`);
    ok(r.nav === 8 && r.hit === 8, `${pg}@${w}: nav ${r.hit}/${r.nav}`);
    ok(r.hdr <= (w >= 1024 ? 66 : 120), `${pg}@${w}: header ${r.hdr}px`);
    await p.close();
  }

// ── scrollspy: exactly one current link (nav on home, TOC on detail pages), clicked entry wins
for (const [pg, sel, key] of [
  ["home-ko", "header nav a[data-nav]", "nav"],
  ["home-en", "header nav a[data-nav]", "nav"],
  ["detail-ko", "a[data-toc]", "toc"],
  ["detail2-en", "a[data-toc]", "toc"],
])
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
    [1920, 1200],
  ]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url(pg));
    const ids = await p.evaluate(
      ([sel, key]) =>
        [...document.querySelectorAll(sel)]
          .filter((a) => a.offsetParent)
          .map((a) => a.dataset[key]),
      [sel, key],
    );
    const cur = () =>
      p.evaluate((sel) => {
        const vis = [...document.querySelectorAll(sel)].filter(
          (a) => a.offsetParent,
        );
        return {
          aria: vis
            .filter((a) => a.getAttribute("aria-current") === "location")
            .map((a) => a.dataset.nav || a.dataset.toc),
          data: vis
            .filter((a) => a.dataset.current === "true")
            .map((a) => a.dataset.nav || a.dataset.toc),
        };
      }, sel);
    let c = await cur();
    ok(
      c.aria.length === 1 && c.aria[0] === ids[0] && c.data.length === 1,
      `${pg}@${w}: at load ${JSON.stringify(c)}`,
    );
    for (const id of ids) {
      await p
        .locator(`${sel}[data-${key}="${id}"]`)
        .filter({ visible: true })
        .first()
        .click();
      await p.waitForTimeout(1600);
      c = await cur();
      ok(
        c.aria.length === 1 && c.aria[0] === id && c.data.join() === id,
        `${pg}@${w}x${h} click ${id} → ${JSON.stringify(c)}`,
      );
    }
    // free scrolling: always exactly one
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += Math.round(h * 0.7)) {
      await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
      await p.waitForTimeout(80);
      c = await cur();
      ok(
        c.aria.length === 1 && c.data.length === 1,
        `${pg}@${w} y=${y}: ${JSON.stringify(c)}`,
      );
    }
    await p.close();
  }

// ── skip link and in-page jumps land below the sticky header (WCAG 2.4.11)
for (const pg of ["home-ko", "detail-ko", "list-en"])
  for (const [w, h] of [
    [390, 844],
    [1440, 900],
    [844, 390],
  ]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url(pg));
    await p.keyboard.press("Tab");
    await p.keyboard.press("Enter");
    await p.waitForTimeout(400);
    await p.keyboard.press("Tab");
    const r = await p.evaluate(() => ({
      hdr: document.querySelector("header").getBoundingClientRect().bottom,
      top: document.activeElement.getBoundingClientRect().top,
      tag: document.activeElement.tagName,
    }));
    ok(
      r.top >= r.hdr - 1,
      `${pg}@${w}x${h}: focus under header (${r.tag} ${r.top} < ${r.hdr})`,
    );
    await p.close();
  }

// ── tech filter (home + list), the stack map's counts, the unrecorded skill
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url("home-ko"));
  const nodes = await p.evaluate(() =>
    [...document.querySelectorAll("#skills a[data-tech]")].map((a) => ({
      slug: a.dataset.tech,
      label: a.dataset.label,
      count: +a.querySelector("[aria-hidden]").textContent,
      href: a.getAttribute("href"),
      sr: a.querySelector(".sr-only").textContent,
    })),
  );
  ok(nodes.length === 6, `stack map: ${nodes.length} linked nodes`);
  const unrec = await p.evaluate(() =>
    [...document.querySelectorAll("#skills li > span")].map(
      (x) => x.textContent,
    ),
  );
  ok(
    unrec.length === 1 && /TypeScript.*기록된 프로젝트 없음/.test(unrec[0]),
    `unrecorded skill: ${unrec}`,
  );
  for (const n of nodes) {
    ok(
      n.href.includes("sys-list-ko") && n.href.includes(`tech=${n.slug}`),
      `node ${n.slug}: no-JS href ${n.href}`,
    );
    await p.click(`#skills a[data-tech="${n.slug}"]`);
    await p.waitForTimeout(150);
    const r = await p.evaluate((slug) => {
      const vis = [...document.querySelectorAll("[data-project]")].filter(
        (li) => li.offsetParent,
      );
      return {
        shown: vis.map((li) => li.dataset.project),
        uses: vis.every((li) => li.dataset.techs.split(" ").includes(slug)),
        matched: [...document.querySelectorAll('[data-match="true"]')].every(
          (c) => c.dataset.node === slug,
        ),
        nMatched: document.querySelectorAll('[data-match="true"]').length,
        bar: document.querySelector("[data-filter-bar]").offsetParent !== null,
        text: document.querySelector("[data-filter-text]").textContent,
        status: document.querySelector("[data-copy-status]").textContent,
        url: location.search,
        current: document
          .querySelector(`#skills a[data-tech="${slug}"]`)
          .getAttribute("aria-current"),
      };
    }, n.slug);
    ok(
      r.shown.length === n.count &&
        r.uses &&
        r.matched &&
        r.nMatched === n.count &&
        r.bar &&
        r.text === `${n.label} 사용 프로젝트 ${n.count}개` &&
        r.status === r.text &&
        r.url === `?tech=${n.slug}` &&
        r.current === "true",
      `filter ${n.slug}: ${JSON.stringify(r)}`,
    );
    await p.click(`#skills a[data-tech="${n.slug}"]`); // same node again clears
    await p.waitForTimeout(100);
    const cleared = await p.evaluate(() => ({
      n: [...document.querySelectorAll("[data-project]")].filter(
        (li) => li.offsetParent,
      ).length,
      url: location.search,
    }));
    ok(
      cleared.n === 3 && !cleared.url,
      `toggle ${n.slug}: ${JSON.stringify(cleared)}`,
    );
  }
  await p.click('#skills a[data-tech="react"]');
  await p.click("[data-filter-clear]");
  const after = await p.evaluate(() => ({
    n: [...document.querySelectorAll("[data-project]")].filter(
      (li) => li.offsetParent,
    ).length,
    focus: document.activeElement.dataset.tech,
  }));
  ok(
    after.n === 3 && after.focus === "react",
    `clear: ${JSON.stringify(after)}`,
  );
  // list page reads ?tech= on load; EN wording
  await p.goto(url("list-en", "?tech=fastapi"));
  const l = await p.evaluate(() => ({
    shown: [...document.querySelectorAll("[data-project]")]
      .filter((li) => li.offsetParent)
      .map((li) => li.dataset.project),
    text: document.querySelector("[data-filter-text]").textContent,
  }));
  ok(
    l.shown.join() === "lecture-bot" && l.text === "Projects using FastAPI: 1",
    `list ?tech: ${JSON.stringify(l)}`,
  );
  await p.close();
}

// ── relations, hashes, TOC = rendered blocks, KO/EN structure
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const info = {};
  for (const pg of PAGES) {
    await p.goto(url(pg));
    info[pg] = await p.evaluate(() => ({
      badHash: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
      lang: document.documentElement.lang,
      tags: [...document.body.querySelectorAll("*")]
        .map((e) => e.tagName)
        .join(),
      toc: [...document.querySelectorAll("[data-toc]")].map(
        (a) => a.dataset.toc,
      ),
      blocks: [...document.querySelectorAll("[data-block]")].map((x) => x.id),
      h1: document.querySelectorAll("h1").length,
    }));
    ok(
      !info[pg].badHash.length,
      `${pg}: unresolved hashes ${info[pg].badHash}`,
    );
    ok(info[pg].lang === pg.slice(-2), `${pg}: html lang ${info[pg].lang}`);
    ok(info[pg].h1 === 1, `${pg}: ${info[pg].h1} h1`);
    ok(info[pg].toc.join() === info[pg].blocks.join(), `${pg}: TOC ≠ blocks`);
  }
  for (const k of ["home", "detail", "detail2", "list"])
    ok(
      info[`${k}-ko`].tags === info[`${k}-en`].tags,
      `${k}: KO/EN structure differs`,
    );
  ok(
    info["detail-ko"].blocks.includes("screens") &&
      info["detail-ko"].blocks.includes("related"),
    "detail: screens/related missing",
  );
  ok(
    !info["detail2-ko"].blocks.includes("screens") &&
      !info["detail2-ko"].blocks.includes("related"),
    "detail2: blocks without data rendered",
  );
  await p.goto(url("home-ko"));
  const rel = await p.evaluate(() => {
    const entry = document.querySelector('[data-project="study-timer"]');
    const toE = [...entry.querySelectorAll("p a")].map((a) =>
      a.getAttribute("href"),
    );
    const back = (id) =>
      [...document.getElementById(id).querySelectorAll("p a")].some((a) =>
        a.getAttribute("href").includes("sys-detail-ko"),
      );
    return {
      toAward: toE.some((h) => h === "#award-oo-hackathon"),
      toAct: toE.some((h) => h === "#act-oo-hackathon"),
      awardBack: back("award-oo-hackathon"),
      actBack: back("act-oo-hackathon"),
    };
  });
  ok(Object.values(rel).every(Boolean), `relations: ${JSON.stringify(rel)}`);
  await p.close();
}

// ── media slots keep their exact capture ratio at every width
{
  const WANT = { web: 16 / 10, mobile: 6 / 13, photo: 4 / 3 };
  for (const pg of ["home-ko", "home-en", "detail-ko", "detail-en"])
    for (const w of [320, 390, 768, 1024, 1440]) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      await p.goto(url(pg));
      const r = await p.evaluate((WANT) => {
        const bad = [];
        let n = 0;
        for (const el of document.querySelectorAll("[data-slot]")) {
          const rc = el.getBoundingClientRect();
          if (!rc.width) continue;
          n++;
          const ratio = rc.width / rc.height;
          if (Math.abs(ratio / WANT[el.dataset.slot] - 1) > 0.02)
            bad.push(`${el.dataset.slot} ${ratio.toFixed(3)}`);
        }
        return { bad, n };
      }, WANT);
      ok(r.n > 0, `${pg}@${w}: no media slots`);
      ok(!r.bad.length, `${pg}@${w}: ${r.bad.slice(0, 4).join("; ")}`);
      await p.close();
    }
}

// ── copy buttons: success, and the blocked-clipboard fallback
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  const p = await ctx.newPage();
  await p.goto(url("home-ko"));
  const btns = p.locator("[data-copy]");
  for (let i = 0; i < (await btns.count()); i++) {
    await btns.nth(i).click();
    await p.waitForTimeout(100);
    const r = await p.evaluate(
      async (el) => ({
        clip: await navigator.clipboard.readText(),
        want: el.dataset.copy,
        done: el.dataset.done,
        status: document.querySelector("[data-copy-status]").textContent,
      }),
      await btns.nth(i).elementHandle(),
    );
    ok(
      r.clip === r.want && r.done === "true" && r.status,
      `copy #${i}: ${JSON.stringify(r)}`,
    );
  }
  await ctx.close();
  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const q = await ctx2.newPage();
  await q.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("blocked")) },
    }),
  );
  await q.goto(url("home-ko"));
  const fb = q.locator("[data-copy]");
  for (let i = 0; i < (await fb.count()); i++) {
    await fb.nth(i).click();
    await q.waitForTimeout(100);
    const r = await q.evaluate(
      (el) => ({
        done: el.dataset.done,
        sel: String(getSelection()),
        want: el.dataset.copy,
        status: document.querySelector("[data-copy-status]").textContent,
      }),
      await fb.nth(i).elementHandle(),
    );
    ok(
      r.done === "fail" && r.sel === r.want && r.status.includes("직접"),
      `copy-fail #${i}: ${JSON.stringify(r)}`,
    );
  }
  await ctx2.close();
}

await b.close();
console.log(
  fails.length
    ? `FAIL ${fails.length}\n- ` + fails.join("\n- ")
    : "ALL CHECKS PASSED",
);
