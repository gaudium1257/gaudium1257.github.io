class Component extends DCLogic {
  cfg() {
    return __CFG__;
  }
  componentDidMount() {
    this._spy = () => this.spy();
    this._end = () => {
      this._lock = 0;
      this.spy();
    };
    window.addEventListener("scroll", this._spy, { passive: true });
    window.addEventListener("resize", this._spy);
    window.addEventListener("scrollend", this._end);
    if ("IntersectionObserver" in window) {
      this._io = new IntersectionObserver(
        (es) => {
          const g = Object.assign({}, (this.state && this.state.gates) || {});
          es.forEach((e) => {
            g[e.target.getAttribute("data-gate")] = e.isIntersecting;
          });
          this.setState({ gates: g });
        },
        { threshold: 0.25 },
      );
      document
        .querySelectorAll("[data-gate]")
        .forEach((el) => this._io.observe(el));
    }
    let m = null;
    try {
      m = window.localStorage.getItem("motion");
    } catch (e) {}
    if (m === "off") this.setState({ motion: "off" });
    this.spy();
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this._spy);
    window.removeEventListener("resize", this._spy);
    window.removeEventListener("scrollend", this._end);
    if (this._io) this._io.disconnect();
  }
  rowAt(secs, ref) {
    return secs
      .filter((s) => Math.abs(s.getBoundingClientRect().top - ref) < 4)
      .map((s) => s.id);
  }
  spy() {
    const c = this.cfg();
    const ids = c.nav || c.toc;
    if (!ids || (this._lock || 0) > Date.now()) return;
    const de = document.documentElement;
    if (de.scrollHeight <= window.innerHeight + 2) return; // full-height canvas frame: keep the first section
    const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!secs.length) return;
    const line = window.innerHeight * 0.35;
    let top = null;
    secs.forEach((s) => {
      const tp = s.getBoundingClientRect().top;
      if (tp <= line) top = tp;
    });
    const bottom = window.innerHeight + window.scrollY >= de.scrollHeight - 2;
    const row = bottom
      ? this.rowAt(secs, secs[secs.length - 1].getBoundingClientRect().top)
      : top === null
        ? [secs[0].id]
        : this.rowAt(secs, top);
    if (this._clicked && row.indexOf(this._clicked) < 0) this._clicked = null;
    const cur = this._clicked || (bottom ? row[row.length - 1] : row[0]);
    const st = this.state || {};
    if ((st.row || []).join() !== row.join() || st.cur !== cur)
      this.setState({ row: row, cur: cur });
  }
  pick(id) {
    const c = this.cfg();
    const ids = c.nav || c.toc;
    const el = document.getElementById(id);
    if (!el) return;
    const secs = ids.map((i) => document.getElementById(i)).filter(Boolean);
    this._clicked = id;
    this._lock = Date.now() + 900;
    this.setState({
      row: this.rowAt(secs, el.getBoundingClientRect().top),
      cur: id,
    });
  }
  doCopy(key) {
    const c = this.cfg();
    const item = c.copy[key];
    const done = (ok) => {
      const cp = Object.assign({}, (this.state && this.state.copy) || {});
      cp[key] = ok ? "done" : "fail";
      this.setState({ copy: cp, status: ok ? item.status : c.copyFail });
      this._ct = this._ct || {};
      clearTimeout(this._ct[key]);
      this._ct[key] = setTimeout(() => {
        const cp2 = Object.assign({}, (this.state && this.state.copy) || {});
        delete cp2[key];
        this.setState({ copy: cp2 });
      }, 1600);
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
    const row = st.row || ids.slice(0, 1);
    const cur = st.cur || ids[0];
    const nav = {};
    const toc = {};
    ids.forEach((id) => {
      const v = {
        cur: row.indexOf(id) >= 0 ? "true" : "false",
        aria: cur === id ? "location" : "false",
        click: () => this.pick(id),
      };
      if (c.nav) nav[id] = v;
      else toc[id] = v;
    });
    const gates = {};
    c.gates.forEach((g) => {
      gates[g] = st.gates && st.gates[g] === false ? "false" : "true";
    });
    const copy = {};
    Object.keys(c.copy).forEach((k) => {
      const s = (st.copy || {})[k];
      copy[k] = {
        label: s === "done" ? c.copied : s === "fail" ? c.copyFail : c.copyIdle,
        done: s === "done" ? "true" : "false",
        go: () => this.doCopy(k),
      };
    });
    const off = st.motion === "off";
    return {
      nav: nav,
      toc: toc,
      gates: gates,
      copy: copy,
      status: st.status || "",
      motion: {
        state: off ? "off" : "on",
        pressed: off ? "true" : "false",
        label: off ? c.play : c.pause,
        toggle: () => {
          const n = off ? "on" : "off";
          try {
            window.localStorage.setItem("motion", n);
          } catch (e) {}
          this.setState({ motion: n });
        },
      },
    };
  }
}
