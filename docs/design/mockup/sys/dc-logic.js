class Component extends DCLogic {
  cfg() {
    return __CFG__;
  }
  componentDidMount() {
    this._spy = () => this.spy();
    this._end = () => {
      if ((this._lock || 0) > Date.now() && !this.arrived()) return; // a stale scrollend from before the click
      this._lock = 0;
      this.spy();
    };
    window.addEventListener("scroll", this._spy, { passive: true });
    window.addEventListener("resize", this._spy);
    window.addEventListener("scrollend", this._end);
    this.spy();
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this._spy);
    window.removeEventListener("resize", this._spy);
    window.removeEventListener("scrollend", this._end);
  }
  // exactly one current section: the last one whose top passed the line under the sticky header
  spy() {
    const c = this.cfg();
    const ids = c.nav || c.toc;
    if (!ids || (this._lock || 0) > Date.now()) return;
    const de = document.documentElement;
    if (de.scrollHeight <= window.innerHeight + 2) return; // full-height canvas frame: keep the first section
    const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!secs.length) return;
    const hdr = document.querySelector("header");
    const line = (hdr ? hdr.getBoundingClientRect().bottom : 0) + 24;
    const passed = secs.filter((x) => x.getBoundingClientRect().top <= line);
    let row = [secs[0]];
    if (passed.length) {
      const top = passed[passed.length - 1].getBoundingClientRect().top;
      row = secs.filter(
        (x) => Math.abs(x.getBoundingClientRect().top - top) < 4,
      );
    }
    const bottom = window.innerHeight + window.scrollY >= de.scrollHeight - 2;
    let cur = row[0].id;
    if (this._clicked) {
      if (bottom || row.some((x) => x.id === this._clicked))
        cur = this._clicked;
      else this._clicked = null;
    } else if (bottom) cur = secs[secs.length - 1].id;
    if ((this.state || {}).cur !== cur) this.setState({ cur: cur });
  }
  arrived() {
    const el = this._clicked && document.getElementById(this._clicked);
    if (!el) return true;
    const de = document.documentElement;
    const pt = parseFloat(getComputedStyle(de).scrollPaddingTop) || 0;
    const max = de.scrollHeight - window.innerHeight;
    const goal = Math.min(
      max,
      Math.max(0, window.scrollY + el.getBoundingClientRect().top - pt),
    );
    return Math.abs(window.scrollY - goal) < 6;
  }
  pick(id) {
    this._clicked = id;
    this._lock = Date.now() + 2500; // released early by the jump's scrollend
    this.setState({ cur: id });
  }
  filter(slug) {
    const st = this.state || {};
    const next = st.tech === slug ? null : slug;
    const c = this.cfg();
    let status = "";
    if (next) {
      const t = c.techs[next];
      status = c.filterTpl
        .replace("{tech}", t.label)
        .replace("{n}", t.projects.length);
    }
    this.setState({ tech: next, status: status });
  }
  doCopy(key) {
    const c = this.cfg();
    const item = c.copy[key];
    const done = (ok) => {
      const cp = Object.assign({}, (this.state && this.state.copy) || {});
      cp[key] = ok ? "done" : "fail";
      this.setState({ copy: cp, status: ok ? item.status : c.copyHint });
      this._ct = this._ct || {};
      clearTimeout(this._ct[key]);
      this._ct[key] = setTimeout(
        () => {
          const cp2 = Object.assign({}, (this.state && this.state.copy) || {});
          delete cp2[key];
          this.setState({ copy: cp2 });
        },
        ok ? 1600 : 4000,
      );
    };
    try {
      navigator.clipboard.writeText(item.value).then(
        () => done(true),
        () => done(false),
      );
    } catch (e) {
      done(false);
    }
  }
  renderVals() {
    const c = this.cfg();
    const st = this.state || {};
    const ids = c.nav || c.toc || [];
    const cur = st.cur || ids[0];
    const nav = {};
    const toc = {};
    ids.forEach((id) => {
      const v = {
        cur: cur === id ? "true" : "false",
        aria: cur === id ? "location" : "false",
        click: () => this.pick(id),
      };
      if (c.nav) nav[id] = v;
      else toc[id] = v;
    });
    const tech = {};
    const match = {};
    Object.keys(c.techs).forEach((slug) => {
      tech[slug] = {
        cur: st.tech === slug ? "true" : "false",
        click: () => this.filter(slug),
      };
      match[slug] = st.tech === slug ? "true" : "false";
    });
    const proj = {};
    c.projects.forEach((pid) => {
      proj[pid] =
        !st.tech || c.techs[st.tech].projects.indexOf(pid) >= 0
          ? "true"
          : "false";
    });
    const copy = {};
    Object.keys(c.copy).forEach((k) => {
      const s = (st.copy || {})[k];
      copy[k] = {
        label: s === "done" ? c.copied : s === "fail" ? c.copyFail : c.copyIdle,
        done: s === "done" ? "true" : s === "fail" ? "fail" : "false",
        go: () => this.doCopy(k),
      };
    });
    return {
      nav: nav,
      toc: toc,
      tech: tech,
      match: match,
      proj: proj,
      filter: {
        show: st.tech ? "true" : "false",
        text: st.tech ? st.status : "",
        clear: () => this.setState({ tech: null, status: "" }),
      },
      copy: copy,
      status: st.status || "",
    };
  }
}
