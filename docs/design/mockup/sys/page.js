(() => {
  const root = document.documentElement;

  // Motion toggle ("Pause motion", pressed = paused): pauses every loop through --play
  // (root data-motion=off), remembered in localStorage
  const mt = document.querySelector("[data-motion-toggle]");
  const applyMotion = (off) => {
    root.dataset.motion = off ? "off" : "on";
    mt.setAttribute("aria-pressed", String(off));
  };
  let saved = null;
  try {
    saved = localStorage.getItem("motion");
  } catch {}
  applyMotion(saved === "off");
  mt.addEventListener("click", () => {
    const off = root.dataset.motion !== "off";
    applyMotion(off);
    try {
      localStorage.setItem("motion", off ? "off" : "on");
    } catch {}
  });

  // Play gates: loops run only while their container is on screen
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) =>
          e.target.setAttribute("data-inview", String(e.isIntersecting)),
        ),
      { threshold: 0.25 },
    );
    document.querySelectorAll("[data-gate]").forEach((el) => io.observe(el));
  } else
    document
      .querySelectorAll("[data-gate]")
      .forEach((el) => el.setAttribute("data-inview", "true"));

  // Copy buttons, announced in one status region. If the clipboard is blocked, the value's
  // visible text is selected so it can be copied by hand, and the hint says so.
  const status = document.querySelector("[data-copy-status]");
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
      status.textContent = ok ? tx.status : tx.hint;
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

  // Scrollspy: a row of sections sharing a top lights up together (data-current); exactly one link gets aria-current.
  // The line sits just under the sticky header, where an anchor jump lands, so a short section still becomes current.
  const spy = (links, key, sectionIds, rowMode) => {
    if (!links.length) return;
    const secs = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    let clicked = null,
      lock = 0,
      last = "";
    const set = (row, cur) => {
      const k = row.join() + "|" + cur;
      if (k === last) return;
      last = k;
      links.forEach((a) => {
        const id = a.dataset[key];
        if (rowMode) a.setAttribute("data-current", String(row.includes(id)));
        if (id === cur) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    const rowAt = (ref) =>
      secs
        .filter((s) => Math.abs(s.getBoundingClientRect().top - ref) < 4)
        .map((s) => s.id);
    const update = () => {
      if (Date.now() < lock) return;
      const line =
        document.querySelector("header").getBoundingClientRect().bottom + 24;
      let top = null;
      for (const s of secs) {
        const tp = s.getBoundingClientRect().top;
        if (tp <= line) top = tp;
      }
      const bottom = innerHeight + scrollY >= root.scrollHeight - 2;
      let row = bottom
        ? rowAt(secs.at(-1).getBoundingClientRect().top)
        : top === null
          ? [secs[0].id]
          : rowAt(top);
      if (clicked && !row.includes(clicked)) {
        // at the page bottom a clicked section that can't reach the line stays current
        if (bottom)
          row = rowAt(
            document.getElementById(clicked).getBoundingClientRect().top,
          );
        else clicked = null;
      }
      set(row, clicked || (bottom ? row.at(-1) : row[0]));
    };
    links.forEach((a) =>
      a.addEventListener("click", () => {
        const id = a.dataset[key];
        const el = document.getElementById(id);
        if (!el) return;
        clicked = id;
        lock = Date.now() + 900;
        set(rowAt(el.getBoundingClientRect().top), id);
      }),
    );
    addEventListener("scrollend", () => {
      lock = 0;
      update();
    });
    let ticking = false;
    const tick = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    update();
  };
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  spy(navLinks, "nav", [...new Set(navLinks.map((a) => a.dataset.nav))], true);
  const tocLinks = [...document.querySelectorAll("[data-toc]")];
  spy(
    tocLinks,
    "toc",
    tocLinks.map((a) => a.dataset.toc),
    false,
  );
})();
