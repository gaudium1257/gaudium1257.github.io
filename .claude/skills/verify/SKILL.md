---
name: verify
description: Prove a change works before committing or reporting done — runs lint/typecheck/content validation, a static build, and responsive screenshots (375/768/1440, ko+en) that you actually look at. Use after any UI, content, or config change, and before every push.
---

# verify

1. `npm run check` — lint + typecheck + content validation. Fix everything; don't silence rules.
2. `npm run build` — must produce `out/` with no errors. Content errors fail the build by design.
3. `npm run screenshot -- <paths>` — default `/ko/ /en/`; add every page you touched (e.g. `/ko/projects/<id>/`). Then **Read the PNGs** in `screenshots/` and check:
   - no horizontal overflow (the script prints ⚠ if the page is wider than the viewport)
   - text readable, nothing clipped or overlapping at 375px
   - the same page in ko and en has the same structure (no missing translated string)
   - every section is reachable from the navigation without long scrolling
4. Before a deploy-bound PR (to `main`): `npm run validate:content:strict` must pass (no TODO placeholders).
5. Report what you ran and what you saw. If something was skipped, say so.
