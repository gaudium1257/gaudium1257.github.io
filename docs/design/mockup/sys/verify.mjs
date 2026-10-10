// node verify.mjs — spec §11 checks 5, 7, 9, 10, 12 + the code gate, on proto/sys-*/index.html
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
const url = (pg) => "file://" + path.join(proto, `sys-${pg}`, "index.html");
const PAGES = [
  "home-ko",
  "home-en",
  "detail-ko",
  "detail-en",
  "list-ko",
  "list-en",
];
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
    .replace(/<style>[\s\S]*?<\/style>/, "");
  const classes = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) =>
    m[1].split(/\s+/),
  );
  ok(
    !/#[0-9a-fA-F]{3,8}\b/.test(html.replace(/href="#[^"]*"/g, "")),
    `${pg}: raw hex in markup`,
  );
  ok(!/\sstyle=/.test(html), `${pg}: inline style`);
  ok(!classes.some((c) => /(^|:)text-xs$/.test(c)), `${pg}: text-xs`);
  ok(
    !classes.some((c) => /gradient|blur|backdrop|(^|:)shadow-/.test(c)),
    `${pg}: gradient/blur/shadow`,
  );
  const ungated = classes.filter(
    (c) =>
      (/(^|:)transition-transform$/.test(c) ||
        /(^|:)(group-[^:]*?:|peer-[^:]*?:)?hover:-?(rotate|translate|scale)/.test(
          c,
        ) ||
        /group-hover[^:]*:-?(rotate|translate|scale)/.test(c) ||
        /group-has-[^ ]*:-?(rotate|translate|scale)/.test(c)) &&
      !c.startsWith("motion-safe:"),
  );
  ok(
    !ungated.length,
    `${pg}: ungated transforms ${[...new Set(ungated)].slice(0, 5)}`,
  );
  const anims = classes.filter(
    (c) => /(^|:)animate-/.test(c) && !c.startsWith("motion-safe:"),
  );
  ok(!anims.length, `${pg}: ungated animations ${anims.slice(0, 3)}`);
}

const b = await chromium.launch();

// ── 7. axe
for (const pg of PAGES)
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.emulateMedia({ reducedMotion: "reduce" });
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

// ── 5. current section (home)
for (const pg of ["home-ko", "home-en"])
  for (const w of [1440, 390]) {
    const p = await b.newPage({
      viewport: { width: w, height: w > 1000 ? 900 : 844 },
    });
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto(url(pg));
    const ids = [
      "about",
      "projects",
      "activities",
      "awards",
      "society",
      "skills",
      "education",
      "connect",
    ];
    const state = () =>
      p.evaluate(() => {
        const vis = [...document.querySelectorAll("header nav a")].filter(
          (a) => a.offsetParent,
        );
        return {
          aria: vis
            .filter((a) => a.hasAttribute("aria-current"))
            .map((a) => a.dataset.nav),
          cur: vis
            .filter((a) => a.dataset.current === "true")
            .map((a) => a.dataset.nav),
        };
      });
    for (const id of ids) {
      await p.evaluate((id) => {
        document.getElementById(id).scrollIntoView();
      }, id);
      await p.waitForTimeout(120);
      const s = await state();
      const atBottom = await p.evaluate(
        () =>
          innerHeight + scrollY >= document.documentElement.scrollHeight - 2,
      );
      ok(
        s.aria.length === 1,
        `${pg}@${w} scroll ${id}: aria-current count ${s.aria.length}`,
      );
      ok(
        s.aria[0] === id ||
          (atBottom && s.aria[0] === "connect") ||
          s.cur.includes(id),
        `${pg}@${w} scroll ${id}: aria=${s.aria} cur=${s.cur}`,
      );
    }
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(120);
    for (const id of ids) {
      await p
        .locator(`header nav a[data-nav="${id}"]`)
        .filter({ visible: true })
        .click();
      await p.waitForTimeout(250);
      const s = await state();
      ok(
        s.aria.length === 1 && s.aria[0] === id,
        `${pg}@${w} click ${id}: aria=${s.aria}`,
      );
      if (w === 1440 && (id === "activities" || id === "awards"))
        ok(
          s.cur.includes("activities") && s.cur.includes("awards"),
          `${pg}@${w} click ${id}: paired data-current ${s.cur}`,
        );
    }
    await p.close();
  }

// ── 9. reduced motion = static
for (const pg of ["home-ko", "detail-ko", "list-ko"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto(url(pg));
  const hovers = [
    ".group\\/poster",
    "article.group",
    "li.group.bg-surface",
    "li[data-kind]",
    "#skills li.group",
    "li.group.relative",
  ];
  for (const sel of hovers) {
    const loc = p.locator(sel).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await loc.hover();
      await p.waitForTimeout(80);
    }
  }
  const r = await p.evaluate(() => ({
    anims: document
      .getAnimations()
      .filter(
        (a) =>
          a instanceof CSSAnimation ||
          /transform|translate|rotate|scale/.test(a.transitionProperty || ""),
      ).length,
    trans: [
      ...document.querySelectorAll("[aria-hidden=true], [aria-hidden=true] *"),
    ].filter(
      (e) =>
        /transform|translate|rotate|scale|all/.test(
          getComputedStyle(e).transitionProperty,
        ) && getComputedStyle(e).transitionDuration !== "0s",
    ).length,
  }));
  ok(r.anims === 0, `${pg} reduced: ${r.anims} animations`);
  ok(
    r.trans === 0,
    `${pg} reduced: ${r.trans} shapes with transform transitions`,
  );
  await p.close();
}

// ── 10. motion on
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url("home-ko"));
  await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => {
    const inf = document
      .getAnimations()
      .filter((a) => a.effect.getTiming().iterations === Infinity);
    const durs = [
      ...new Set(inf.map((a) => a.effect.getTiming().duration / 1000)),
    ];
    // hero relay: pause every poster loop and step a virtual clock 0..48s
    const poster = document.querySelector(".group\\/poster");
    const loops = inf.filter((a) => poster.contains(a.effect.target));
    loops.forEach((a) => a.pause());
    const t0 = loops.map((a) => a.currentTime);
    const pose = () =>
      loops.map((a) => getComputedStyle(a.effect.target).transform);
    let prev = null,
      maxMoving = 0,
      moves = [];
    for (let ms = 0; ms <= 48000; ms += 100) {
      loops.forEach((a, i) => {
        a.currentTime = t0[i] + ms;
      });
      const cur = pose();
      if (prev) {
        const n = cur.filter((v, i) => v !== prev[i]).length;
        if (n) moves.push(ms);
        maxMoving = Math.max(maxMoving, n);
      }
      prev = cur;
    }

    const starts = moves
      .filter((m, i) => i === 0 || m - moves[i - 1] > 100)
      .map((m) => m / 1000);
    // gated loops below the fold
    const offscreen = inf.filter((a) => {
      const g = a.effect.target.closest(".play-gate");
      return g && g.getBoundingClientRect().top > innerHeight;
    });
    return {
      durs,
      heroLoops: loops.length,
      maxMoving,
      starts,
      offscreenRunning: offscreen.filter((a) => a.playState === "running")
        .length,
      offscreen: offscreen.length,
    };
  });
  ok(
    r.durs.every((d) => [24, 48, 96, 60].includes(d)),
    `motion: durations ${r.durs}`,
  );
  ok(r.maxMoving <= 1, `motion: ${r.maxMoving} hero shapes moving at once`);
  ok(
    r.offscreen > 0 && r.offscreenRunning === 0,
    `motion: offscreen running ${r.offscreenRunning}/${r.offscreen}`,
  );
  console.log(
    "hero relay move starts (s):",
    r.starts.join(", "),
    "| loops:",
    r.heroLoops,
    "| durations:",
    r.durs.join(","),
  );
  await p.reload();
  await p.waitForTimeout(300);
  await p.click("[data-motion-toggle]");
  await p.waitForTimeout(100);
  const paused = await p.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.effect.getTiming().iterations === Infinity)
      .every((a) => a.playState === "paused"),
  );
  ok(paused, "motion: toggle did not pause all loops");
  await p.reload();
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => ({
    pressed: document
      .querySelector("[data-motion-toggle]")
      .getAttribute("aria-pressed"),
    paused: document
      .getAnimations()
      .filter((a) => a.effect.getTiming().iterations === Infinity)
      .every((a) => a.playState === "paused"),
  }));
  ok(
    after.pressed === "true" && after.paused,
    `motion: pause did not survive reload ${JSON.stringify(after)}`,
  );
  await p.click("[data-motion-toggle]");
  await p.close();
}

// ── 12. relations, hashes, copy, KO/EN structure
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  const p = await ctx.newPage();
  const links = {};
  for (const pg of PAGES) {
    await p.goto(url(pg));
    links[pg] = await p.evaluate(() => ({
      hashes: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
      lang: document.documentElement.lang,
      tags: [...document.body.querySelectorAll("*")]
        .map((e) => e.tagName)
        .join(","),
      rel: [...document.querySelectorAll("p a, li a")].map((a) => [
        a.closest("[id]")?.id,
        a.getAttribute("href"),
      ]),
    }));
    ok(
      !links[pg].hashes.length,
      `${pg}: unresolved hashes ${links[pg].hashes}`,
    );
    ok(links[pg].lang === pg.slice(-2), `${pg}: html lang ${links[pg].lang}`);
  }
  for (const k of ["home", "detail", "list"])
    ok(
      links[`${k}-ko`].tags === links[`${k}-en`].tags,
      `${k}: KO/EN element structure differs`,
    );
  // every edge visible in both directions on home (projects link to the detail page)
  await p.goto(url("home-ko"));
  const edges = [
    ["study-timer", "award-oo-hackathon"],
    ["study-timer", "act-oo-hackathon"],
    ["act-oo-hackathon", "award-oo-hackathon"],
    ["attendance", "the-lab"],
  ];
  const relOk = await p.evaluate((edges) => {
    const has = (from, to) => {
      const toHref = (id) =>
        ["study-timer", "attendance", "lecture-bot"].includes(id)
          ? "sys-detail"
          : id === "the-lab"
            ? "#society"
            : "#" + id;
      const scope =
        from === "the-lab"
          ? document.querySelector("#society")
          : ["study-timer", "attendance", "lecture-bot"].includes(from)
            ? [...document.querySelectorAll("#projects article")].find(
                (a) =>
                  a.querySelector("h3").textContent.trim() ===
                  {
                    "study-timer": "스터디 타이머",
                    attendance: "학회 출석 관리 서비스",
                    "lecture-bot": "강의 요약 챗봇",
                  }[from],
              )
            : document.getElementById(from);
      return (
        !!scope &&
        [...scope.querySelectorAll("p a")].some((a) =>
          a.getAttribute("href").includes(toHref(to)),
        )
      );
    };
    return edges.map(([a, c]) => [a, c, has(a, c), has(c, a)]);
  }, edges);
  for (const [a, c, f, r] of relOk)
    ok(f && r, `relation ${a}<->${c}: ${f}/${r}`);
  for (const sel of ["#about [data-copy]", "#connect [data-copy]"]) {
    const btns = p.locator(sel);
    for (let i = 0; i < (await btns.count()); i++) {
      const bt = btns.nth(i);
      await bt.click();
      await p.waitForTimeout(100);
      const r = await p.evaluate(
        async (el) => ({
          clip: await navigator.clipboard.readText(),
          want: el.dataset.copy,
          status: document.querySelector("[data-copy-status]").textContent,
          done: el.dataset.done === "true",
          label: el.querySelector("[data-copy-label]").textContent,
        }),
        await bt.elementHandle(),
      );
      ok(
        r.clip === r.want && r.status && r.done && r.label === "복사됨",
        `copy ${sel}#${i}: ${JSON.stringify(r)}`,
      );
    }
  }
  await ctx.close();
}

await b.close();
console.log(
  fails.length
    ? `FAIL ${fails.length}\n- ` + fails.join("\n- ")
    : "ALL CHECKS PASSED",
);
