(() => {
  const root = document.documentElement;
  const cfg = JSON.parse(document.body.dataset.cfg || "{}");
  const status = document.querySelector("[data-copy-status]");
  const say = (msg) => {
    status.textContent = "";
    requestAnimationFrame(() => (status.textContent = msg));
  };

  // Copy buttons, announced in one status region. If the clipboard is blocked, the value's
  // visible text is selected so it can be copied by hand, and the hint says so.
  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const lab = b.querySelector("[data-copy-label]");
      const tx = JSON.parse(b.dataset.copyText);
      let ok = true;
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
      } catch {
        ok = false;
      }
      lab.textContent = ok ? tx.done : tx.fail;
      b.setAttribute("data-done", ok ? "true" : "fail");
      say(ok ? tx.status : tx.hint);
      if (!ok) {
        const sel = `[data-copy-value="${b.dataset.copyKey}"]`;
        let p = b.parentElement;
        while (p && !p.querySelector(sel)) p = p.parentElement;
        const v = p && p.querySelector(sel);
        if (v) {
          const r = document.createRange();
          r.selectNodeContents(v);
          getSelection().removeAllRanges();
          getSelection().addRange(r);
        }
      }
      clearTimeout(b._t);
      b._t = setTimeout(
        () => {
          lab.textContent = tx.idle;
          b.setAttribute("data-done", "false");
        },
        ok ? 1600 : 4000,
      );
    }),
  );

  // Tech filter (home + project list). Each tech is a real link (no JS: the list filtered by that tech);
  // with JS the list filters in place, the URL keeps ?tech=<slug>, and the result is announced.
  const techLinks = [...document.querySelectorAll("a[data-tech]")];
  const entries = [...document.querySelectorAll("[data-project]")];
  const bar = document.querySelector("[data-filter-bar]");
  if (techLinks.length && entries.length && bar) {
    const text = bar.querySelector("[data-filter-text]");
    let current = null;
    const apply = (slug, announce) => {
      current = slug;
      techLinks.forEach((a) =>
        a.setAttribute("aria-current", String(a.dataset.tech === slug)),
      );
      let n = 0;
      entries.forEach((li) => {
        const hit = !slug || li.dataset.techs.split(" ").includes(slug);
        li.setAttribute("data-show", String(hit));
        if (hit) n++;
        li.querySelectorAll("[data-node]").forEach((c) =>
          c.setAttribute(
            "data-match",
            String(!!slug && c.dataset.node === slug),
          ),
        );
      });
      const url = new URL(location.href);
      if (slug) url.searchParams.set("tech", slug);
      else url.searchParams.delete("tech");
      history.replaceState(null, "", url);
      bar.setAttribute("data-show", String(!!slug));
      if (slug) {
        const label = techLinks.find((a) => a.dataset.tech === slug).dataset
          .label;
        text.textContent = cfg.filter
          .replace("{tech}", label)
          .replace("{n}", n);
        if (announce) say(text.textContent);
      }
    };
    techLinks.forEach((a) =>
      a.addEventListener("click", (ev) => {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; // new tab: open the static page
        ev.preventDefault();
        const kbd = ev.detail === 0; // Enter on a focused link
        const next = current === a.dataset.tech ? null : a.dataset.tech;
        apply(next, !(kbd && next)); // keyboard: focus reads the result, so the status region stays quiet
        const list = document.querySelector("[data-project-list]");
        if (list.getBoundingClientRect().top > innerHeight - 160)
          bar.scrollIntoView({ block: "start" });
        if (kbd && next) text.focus({ preventScroll: true }); // the next Tab reaches "Clear filter", then the results
      }),
    );
    bar.querySelector("[data-filter-clear]").addEventListener("click", () => {
      const was = techLinks.find((a) => a.dataset.tech === current);
      apply(null, false);
      if (was) was.focus();
    });
    const q = new URLSearchParams(location.search).get("tech");
    if (q && techLinks.some((a) => a.dataset.tech === q)) apply(q, false);
  }

  // "See all N screens" also unfolds the screens folded into <details>
  document
    .querySelectorAll('a[href="#screens"]')
    .forEach((a) =>
      a.addEventListener("click", () =>
        document
          .querySelectorAll("#screens details")
          .forEach((d) => (d.open = true)),
      ),
    );

  // Open a collapsed <details> when the hash points inside it
  const openOnHash = () => {
    const el =
      location.hash &&
      document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const d = el && el.closest("details");
    if (d && !d.open) {
      d.open = true;
      el.scrollIntoView();
    }
  };
  addEventListener("hashchange", openOnHash);
  openOnHash();

  // Scrollspy: exactly one link is current — the last section whose top has passed the line just under the
  // sticky header (where an anchor jump lands). A clicked section stays current at the page bottom.
  const spy = (links, key) => {
    if (!links.length) return;
    const ids = links.map((a) => a.dataset[key]);
    const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
    let clicked = null,
      lock = 0,
      last = "";
    const set = (cur) => {
      if (cur === last) return;
      last = cur;
      links.forEach((a) => {
        const on = a.dataset[key] === cur;
        a.setAttribute("data-current", String(on));
        if (on) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    const update = () => {
      if (Date.now() < lock) return;
      const line =
        document.querySelector("header").getBoundingClientRect().bottom + 24;
      const passed = secs.filter((x) => x.getBoundingClientRect().top <= line);
      let row = [secs[0]];
      if (passed.length) {
        const top = passed.at(-1).getBoundingClientRect().top;
        row = secs.filter(
          (x) => Math.abs(x.getBoundingClientRect().top - top) < 4,
        ); // sections side by side share a top: the first wins unless the other was clicked
      }
      const bottom = innerHeight + scrollY >= root.scrollHeight - 2;
      let cur = row[0].id;
      if (clicked) {
        if (bottom || row.some((x) => x.id === clicked)) cur = clicked;
        else clicked = null;
      } else if (bottom) cur = secs.at(-1).id;
      set(cur);
    };
    let fallback = 0;
    // the hold ends when the jump has arrived (section at the scroll-padding line, or the page can't scroll further);
    // a scrollend left over from an earlier scroll doesn't count
    const arrived = () => {
      const el = clicked && document.getElementById(clicked);
      if (!el) return true;
      const pt = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const max = root.scrollHeight - innerHeight;
      const goal = Math.min(
        max,
        Math.max(0, scrollY + el.getBoundingClientRect().top - pt),
      ); // where the jump will stop, clamped to the scrollable range
      return Math.abs(scrollY - goal) < 6;
    };
    const release = () => {
      lock = 0;
      clearTimeout(fallback);
      update();
    };
    links.forEach((a) =>
      a.addEventListener("click", () => {
        clicked = a.dataset[key];
        lock = Infinity; // until the jump's scroll ends (fallback where scrollend is missing)
        clearTimeout(fallback);
        fallback = setTimeout(release, 2500);
        set(clicked);
      }),
    );
    let ticking = false;
    const tick = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    addEventListener("scrollend", () => {
      if (lock === Infinity && !arrived()) return;
      release();
    });
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    update();
  };
  spy([...document.querySelectorAll("[data-nav]")], "nav");
  spy([...document.querySelectorAll("[data-toc]")], "toc");
})();
