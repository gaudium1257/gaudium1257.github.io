---
name: add-section
description: Add a new kind of portfolio section (e.g. 자격증, 블로그 글, 발표) end to end — schema, content folder, loader, validation, dictionary labels, navigation, UI, and the docs that must stay in sync. Use when the user wants a section that doesn't exist yet.
---

# add-section

A section touches several layers; skipping one leaves the harness inconsistent. Do all of these, in order:

1. **Schema** — add a zod schema in `src/content/schema.ts`. All user-facing text is `Localized`; add `related` if it can link to other items; add `id` if it's a collection.
2. **Collect** — wire it into `src/content/collect.ts`: parse (collection folder `content/<name>/` or single file), register ids in the index/relations if it has ids, add to the TODO scan.
3. **Content** — create the folder/file under `content/` (a `.gitkeep` or an empty-but-valid file; no invented entries).
4. **Labels** — add the nav label to `src/i18n/dictionaries/ko.ts` and `en.ts` (tsc enforces the same shape).
5. **Registry** — add `{ id, label }` to `src/config/sections.ts` at the right position. Navigation is generated from it.
6. **UI** — a section component following the existing sections' structure and design tokens (no raw hex colors; responsive at 375px).
7. **Docs** — update the tables in `CLAUDE.md` and `.claude/skills/add-content/SKILL.md`. If projects can relate to it, mention it in section 12 of `docs/prompts/project-fact-sheet.md`.
8. Run the `verify` skill.
