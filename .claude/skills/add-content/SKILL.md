---
name: add-content
description: Add or update portfolio content (projects, activities, awards, skills, education & career, profile) from a project fact sheet or from the owner's answers, without inventing anything. Use whenever the user pastes a fact sheet / JSON from docs/prompts/project-fact-sheet.md, or says "프로젝트 추가", "수상 추가", "활동 추가", "경력 추가", "내용 수정".
---

# add-content

Content is the owner's public record. **Nothing goes in that the owner or a fact sheet did not state.** When something is missing, ask; never fill gaps with plausible text.

## Where things go

| Kind               | File                                                                              | Schema      |
| ------------------ | --------------------------------------------------------------------------------- | ----------- |
| Project            | `content/projects/<id>.json` (+ fact sheet in `content/sources/projects/<id>.md`) | `Project`   |
| 활동               | `content/activities/<id>.json`                                                    | `Activity`  |
| 수상               | `content/awards/<id>.json`                                                        | `Award`     |
| 개발 역량          | `content/skills.json`                                                             | `Skills`    |
| 학력 및 경력사항   | `content/education.json` (`items` = 학력, `career` = 경력)                        | `Education` |
| 자기소개 / connect | `content/profile.json`                                                            | `Profile`   |

Schemas: `src/content/schema.ts` — read it before writing JSON. Ids are global kebab-case and must equal the file name.

## Project (from the fact-sheet prompt)

1. Require **both** outputs of `docs/prompts/project-fact-sheet.md`: the Markdown fact sheet and the JSON. If only one is given, ask for the other. If the user has neither, give them that prompt file and stop.
2. Save the fact sheet verbatim to `content/sources/projects/<id>.md` (the audit trail; not rendered on the site).
3. Save the JSON to `content/projects/<id>.json`. The post-edit hook validates it; fix any schema errors by asking or by correcting obvious format mistakes only (never by changing facts).
4. Run the `content-fact-checker` subagent on the pair. Resolve every finding: remove unsupported claims or ask the user — do not reword them to sound safer.
5. Images: if the fact sheet lists candidates and the user provides files, copy to `public/images/projects/<id>/` and set `thumbnail` / `screenshots` with real alt text (`logo`: a square app icon or logo mark, PNG/WebP/SVG ≥256px — the validator rejects non-square files; `thumbnail`: a 16:10 lead image that leads alone on cards and the detail header). Give each screenshot its `kind` (`web` 16:10 · `mobile` 6:13 · `photo` 4:3). Boxes never crop and the validator rejects a ratio off by more than 1%, so pad (don't crop) files to the exact ratio first.
6. Relations: map section 12 of the fact sheet ("관련 활동·수상·경력") to existing ids and fill `related` (one side is enough; the loader links both ways). If the target doesn't exist yet, offer to add it.
7. `techNotes` (where each tech was used, keyed by the exact `techStack` name): keep only notes the fact sheet supports; the validator rejects keys that are not in `techStack`. Ask for missing ones rather than inventing.
8. AI coding assistants (Claude Code, Copilot, Cursor…) go in `aiTools`, never in `techStack` or `skills.json` (owner decision 2026.10: they are shown on a separate line so the stack doesn’t read as AI-dependent).
9. Skills: for each `techStack` item not in `content/skills.json` (validator warns), ask whether to add it to 개발 역량 and under which group. Keep spelling identical.
10. Ask where it goes in `content/project-order.json` (the owner's order for home and the list; unlisted projects follow, newest first).

## Other kinds (from the owner's answers)

Interview with short, concrete questions — only the fields the schema needs, both languages. Offer an English translation for the owner to approve rather than asking them to write it. Examples:

- 수상: 대회/상 이름, 상 등급, 주최, 날짜(YYYY-MM), 관련 프로젝트, 증빙 링크
- 활동: 활동명, 기관, 유형, 기간, 역할, 한 일, 관련 프로젝트
- 학력: 학교, 전공, 학위, 재학 상태, 기간 (모르는 항목은 비워 둠)
- 경력: 기관·단체, 역할, 기간 (모르는 항목은 비워 둠)

Numbers (participants, users, ranks) only when the owner states them.

## Finish

1. `npm run validate:content` → 0 errors. Warnings about TODO / skills must be explained to the user.
2. `npm run build`, then use the `verify` skill to look at the affected pages in ko and en.
3. Commit on the current `dev/` branch: `content: add <kind> <id>`.
