#!/usr/bin/env python3
"""Media edge cases: render home/detail/list with other MEDIA sets into proto/_scen-*/ (own CSS) for scen.mjs."""
import importlib.util, os, sys, glob, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
PROTO = os.path.join(HERE, "..", "proto")
SCEN = {
    "phone": {"study-timer": ["mobile", "mobile"], "attendance": ["mobile"], "lecture-bot": ["photo"]},
    "single": {"study-timer": ["web"], "attendance": [], "lecture-bot": ["web", "web"]},
    "none": {"study-timer": [], "attendance": [], "lecture-bot": []},
    "mixed": {"study-timer": ["photo", "mobile", "web", "mobile", "mobile", "web"], "attendance": ["mobile", "photo"], "lecture-bot": ["mobile", "mobile", "mobile"]},
}
for d in [x for x in glob.glob(os.path.join(PROTO, "_scen-*")) if os.path.isdir(x)]:
    shutil.rmtree(d)
spec = importlib.util.spec_from_file_location("gen", os.path.join(HERE, "gen.py"))
g = importlib.util.module_from_spec(spec)
sys.argv = ["gen.py"]
spec.loader.exec_module(g)
for name, media in SCEN.items():
    g.MEDIA.clear()
    g.MEDIA.update(media)
    for page in ("home", "detail", "list"):
        html = g.render_proto(page, "ko").replace('href="../sys.css"', 'href="../_scen.css"')
        d = os.path.join(PROTO, f"_scen-{name}-{page}")
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf8").write(html)
open(os.path.join(PROTO, "_scen-input.css"), "w").write('@import "tailwindcss" source(none);\n@import "./sys-theme.css";\n@source "./_scen-*/index.html";\n')
print("scenarios:", ", ".join(SCEN))
